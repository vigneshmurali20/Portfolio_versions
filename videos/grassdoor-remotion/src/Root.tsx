import { Composition, Folder } from "remotion";
import { GrassdoorAd } from "./GrassdoorAd";
import { Silk } from "./components/Silk";
import { FPS, H, TOTAL, W } from "./lib/theme";
import { S1Logo } from "./scenes/S1Logo";
import { S2Explore } from "./scenes/S2Explore";
import { S3Unbox } from "./scenes/S3Unbox";
import { S4Track } from "./scenes/S4Track";
import { S5Credit } from "./scenes/S5Credit";
import { S6OnePlace } from "./scenes/S6OnePlace";
import { S7Closure } from "./scenes/S7Closure";
import "./lib/fonts";

// Scenes are registered on their own over the silk so each can be previewed / tweaked in Studio.
const OnSilk = (C: React.FC): React.FC => {
  const Wrapped: React.FC = () => (
    <>
      <Silk />
      <C />
    </>
  );
  return Wrapped;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="GrassdoorAd" component={GrassdoorAd} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
      <Folder name="Scenes">
        <Composition id="S1-Logo" component={OnSilk(S1Logo)} durationInFrames={70} fps={FPS} width={W} height={H} />
        <Composition id="S2-Explore" component={OnSilk(S2Explore)} durationInFrames={122} fps={FPS} width={W} height={H} />
        <Composition id="S3-Unbox" component={OnSilk(S3Unbox)} durationInFrames={108} fps={FPS} width={W} height={H} />
        <Composition id="S4-Track" component={OnSilk(S4Track)} durationInFrames={90} fps={FPS} width={W} height={H} />
        <Composition id="S5-Credit" component={OnSilk(S5Credit)} durationInFrames={98} fps={FPS} width={W} height={H} />
        <Composition id="S6-OnePlace" component={OnSilk(S6OnePlace)} durationInFrames={69} fps={FPS} width={W} height={H} />
        <Composition id="S7-Closure" component={OnSilk(S7Closure)} durationInFrames={120} fps={FPS} width={W} height={H} />
      </Folder>
    </>
  );
};
