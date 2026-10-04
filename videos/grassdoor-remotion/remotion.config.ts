// All configuration options: https://remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Use the Chromium headless shell that ships with this environment, with software WebGL
// so the Three.js icons and the silk shader render.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
);
Config.setChromiumOpenGlRenderer("swangle");
