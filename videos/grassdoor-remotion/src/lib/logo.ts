import { ICON_X, KNOB, LOGO_W } from "./iconPath";

// Logo placement used by the opening and the iris into scene 2.
export const LOGO_S = 760 / LOGO_W; // logo drawn 760px wide
export const LOGO_LEFT = (1080 - 760) / 2;
export const LOGO_TOP = 960 - (544 * LOGO_S) / 2;
export const ICON_LEFT = LOGO_LEFT + ICON_X * LOGO_S;
export const KNOB_X = ICON_LEFT + KNOB.x * LOGO_S;
export const KNOB_Y = LOGO_TOP + KNOB.y * LOGO_S;
// While the door is drawn it sits centred; it then slides right into the lockup.
export const ICON_CENTRED_DX = 540 - (ICON_LEFT + (297 * LOGO_S) / 2);
