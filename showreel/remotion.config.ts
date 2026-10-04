/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Three.js scenes need WebGL in headless Chrome; SwiftShader works everywhere.
Config.setChromiumOpenGlRenderer("swiftshader");
// Use a locally installed headless shell when one is provided
// (e.g. REMOTION_BROWSER=/path/to/headless_shell npx remotion render).
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
