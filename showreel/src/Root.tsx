import React from "react";
import { Composition, Folder } from "remotion";
import { Showreel } from "./Showreel";
import { Bounce } from "./scenes/Bounce";
import { Depth } from "./scenes/Depth";
import { Form } from "./scenes/Form";
import { Kinetic } from "./scenes/Kinetic";
import { Path } from "./scenes/Path";
import { Signature } from "./scenes/Signature";
import { Systems } from "./scenes/Systems";
import "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Showreel" component={Showreel} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Folder name="Chapters">
        <Composition id="Bounce" component={Bounce} durationInFrames={60} fps={30} width={1920} height={1080} />
        <Composition id="Kinetic" component={Kinetic} durationInFrames={51} fps={30} width={1920} height={1080} />
        <Composition id="Form" component={Form} durationInFrames={57} fps={30} width={1920} height={1080} />
        <Composition id="Systems" component={Systems} durationInFrames={54} fps={30} width={1920} height={1080} />
        <Composition id="Path" component={Path} durationInFrames={63} fps={30} width={1920} height={1080} />
        <Composition id="Depth" component={Depth} durationInFrames={63} fps={30} width={1920} height={1080} />
        <Composition id="Signature" component={Signature} durationInFrames={102} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
