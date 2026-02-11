import whisper
import json
import os
from pathlib import Path

# Load Whisper model (base is good balance between speed and accuracy)
print("Loading Whisper model...")
model = whisper.load_model("base")

# Audio directory
audio_dir = Path(__file__).parent.parent / "public" / "Audio"
output_dir = Path(__file__).parent.parent / "Transcription"
output_dir.mkdir(exist_ok=True)

# Audio files
audio_files = [
    "toma_1.m4a",
    "toma_2.m4a",
    "toma_3.m4a",
    "toma_4.m4a",
    "toma_5.m4a",
    "toma_6.m4a",
    "toma_7.m4a",
]

all_data = {}

for i, audio_file in enumerate(audio_files, 1):
    file_path = audio_dir / audio_file
    
    if not file_path.exists():
        print(f"⚠️  File not found: {file_path}")
        continue
    
    print(f"\nProcessing toma_{i}...")
    
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
    
    # Save to individual JSON file
    output_file = output_dir / f"toma_{i}_timestamps.json"
    
    data = {
        "take": i,
        "duration": result["segments"][-1]["end"] if result["segments"] else 0,
        "text": result["text"].strip(),
        "words": words_with_timestamps
    }
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    all_data[f"toma_{i}"] = data
    
    print(f"✅ toma_{i}: {data['duration']:.2f}s - {len(words_with_timestamps)} words")
    print(f"   Text: {result['text'][:80]}...")

# Save combined data
combined_file = output_dir / "all_timestamps.json"
with open(combined_file, "w", encoding="utf-8") as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ All transcriptions saved to: {output_dir}")
print("\nDurations:")
for take, data in all_data.items():
    print(f"  {take}: {data['duration']:.2f} seconds")
