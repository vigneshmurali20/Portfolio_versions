import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { Finish, Hud } from "./components/Overlay";
import { Bounce } from "./scenes/Bounce";
import { Depth } from "./scenes/Depth";
import { Form } from "./scenes/Form";
import { Kinetic } from "./scenes/Kinetic";
import { Path } from "./scenes/Path";
import { Signature } from "./scenes/Signature";
import { Systems } from "./scenes/Systems";

// Vignesh — 15 s motion showreel. Each chapter designs its own hand-off into
// the next (orb swell, dot wipe, collapse), so the scenes run back to back.
export const Showreel: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#040307" }}>
      <Series>
        <Series.Sequence name="Bounce" durationInFrames={60} premountFor={fps}>
          <Bounce />
        </Series.Sequence>
        <Series.Sequence name="Kinetic" durationInFrames={51} premountFor={fps}>
          <Kinetic />
        </Series.Sequence>
        <Series.Sequence name="Form" durationInFrames={57} premountFor={fps}>
          <Form />
        </Series.Sequence>
        <Series.Sequence name="Systems" durationInFrames={54} premountFor={fps}>
          <Systems />
        </Series.Sequence>
        <Series.Sequence name="Path" durationInFrames={63} premountFor={fps}>
          <Path />
        </Series.Sequence>
        <Series.Sequence name="Depth" durationInFrames={63} premountFor={fps}>
          <Depth />
        </Series.Sequence>
        <Series.Sequence name="Signature" durationInFrames={102} premountFor={fps}>
          <Signature />
        </Series.Sequence>
      </Series>
      <Finish />
      <Hud />
      {/* Original score, synthesised to the picture by scripts/make-soundtrack.mjs */}
      <Audio src={staticFile("soundtrack.wav")} />
    </AbsoluteFill>
  );
};
