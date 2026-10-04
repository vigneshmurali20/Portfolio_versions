import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HUD } from "./components/HUD";
import { Silk } from "./components/Silk";
import { kk } from "./lib/anim";
import { S1Logo } from "./scenes/S1Logo";
import { S2Explore } from "./scenes/S2Explore";
import { S3Unbox } from "./scenes/S3Unbox";
import { S4Track } from "./scenes/S4Track";
import { S5Credit } from "./scenes/S5Credit";
import { S6OnePlace } from "./scenes/S6OnePlace";
import { S7Closure } from "./scenes/S7Closure";
import "./lib/fonts";

/** Bright cuts: the outgoing white scene blooms to white, we cut, and the light decays over the silk scene. */
const BrightCuts: React.FC = () => {
  const f = useCurrentFrame();
  const o = Math.max(kk(f, [178, 183, 196], [0, 1, 0]), kk(f, [508, 513, 526], [0, 1, 0]));
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};

/**
 * Grassdoor — 21s vertical showreel spot.
 * Silk (WebGL) is the base layer; white scenes iris / flash / blur over it, so every cut is a
 * silk ⇄ #FFFFFF match cut carried by the knob-dot motif.
 */
export const GrassdoorAd: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#021416" }}>
      <Silk period={21} />
      <Sequence name="01 Logo" from={0} durationInFrames={70} premountFor={fps}>
        <S1Logo />
      </Sequence>
      <Sequence name="02 Explore (white)" from={60} durationInFrames={122} premountFor={fps}>
        <S2Explore />
      </Sequence>
      <Sequence name="03 Unbox" from={180} durationInFrames={108} premountFor={fps}>
        <S3Unbox />
      </Sequence>
      <Sequence name="04 Track (white)" from={276} durationInFrames={90} premountFor={fps}>
        <S4Track />
      </Sequence>
      <Sequence name="05 Credit" from={358} durationInFrames={98} premountFor={fps}>
        <S5Credit />
      </Sequence>
      <Sequence name="06 One place (white)" from={444} durationInFrames={69} premountFor={fps}>
        <S6OnePlace />
      </Sequence>
      <Sequence name="07 Closure" from={510} durationInFrames={120} premountFor={fps}>
        <S7Closure />
      </Sequence>
      <BrightCuts />
      <HUD />
      {/* Master soundtrack: Lyria music bed (beat-aligned), Gemini TTS voice-over with sidechain ducking,
          synthesised SFX on every animation hit. Built by tools/mix.py — stems in public/audio/stem-*.wav. */}
      <Audio name="Soundtrack" src={staticFile("audio/mix.wav")} premountFor={fps} />
    </AbsoluteFill>
  );
};
