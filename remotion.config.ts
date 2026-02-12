/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideWebpackConfig(enableTailwind);

// Optimize for social media
Config.setCodec("h264");
// Config.setCrf(20); // Disabling CRF to allow hardware acceleration
Config.setHardwareAcceleration("if-possible"); // Enable NVENC/hardware encoding
Config.setPixelFormat("yuv420p"); // Compatible with most platforms
Config.setConcurrency(8); // Utilize multiple CPU cores
Config.setScale(1); // Ensure no unnecessary upscaling
Config.setChromeMode("chrome-for-testing"); // Enable GPU in headless mode
