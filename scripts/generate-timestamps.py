import whisper
import json
import os
from pathlib import Path

# Load Whisper model (base is good balance between speed and accuracy)
print("Loading Whisper model...")
model = whisper.load_model("base")

# Audio directory
audio_dir = Path(__file__).parent.parent / "public" / "Audio"
# Output to src/config/timestamps.json to be used by the app
output_dir = Path(__file__).parent.parent / "src" / "config"
output_dir.mkdir(exist_ok=True, parents=True)

# Scan for audio files
print(f"Scanning {audio_dir}...")
audio_files = sorted([f.name for f in audio_dir.glob("toma_*.m4a")])

if not audio_files:
    print("No audio files found!")
    exit(1)

print(f"Found {len(audio_files)} audio files: {audio_files}")

all_data = {}

for audio_file in audio_files:
    # Extract take number from filename
    try:
        take_num = int(audio_file.replace("toma_", "").replace(".m4a", ""))
    except ValueError:
        print(f"⚠️ Skipping {audio_file}: could not parse take number")
        continue

    file_path = audio_dir / audio_file
    
    print(f"\nProcessing toma_{take_num}...")
    
    # Transcribe with word-level timestamps
    result = model.transcribe(
        str(file_path),
        language="es",
        word_timestamps=True,
        verbose=False
    )
    
    # Extract word-level timestamps
    words_with_timestamps = []
    
    for segment in result["segments"]:
        if "words" in segment:
            for word_data in segment["words"]:
                words_with_timestamps.append({
                    "word": word_data["word"].strip(),
                    "start": word_data["start"],
                    "end": word_data["end"]
                })
    
    data = {
        "take": take_num,
        "duration": result["segments"][-1]["end"] if result["segments"] else 0,
        "text": result["text"].strip(),
        "words": words_with_timestamps
    }
    
    # Key by toma_X as expected by takes.ts
    all_data[f"toma_{take_num}"] = data
    
    print(f"✅ toma_{take_num}: {data['duration']:.2f}s - {len(words_with_timestamps)} words")
    print(f"   Text: {result['text'][:80]}...")

# Save combined data to src/config/timestamps.json
combined_file = output_dir / "timestamps.json"
with open(combined_file, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ All transcriptions saved to: {combined_file}")

