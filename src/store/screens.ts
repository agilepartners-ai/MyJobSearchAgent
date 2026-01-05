import { atom } from "jotai";

export type Screen =
  | "introLoading"
  | "outage"
  | "outOfMinutes"
  | "intro"
  | "instructions"
  | "settings"
  | "finalScreen"
  | "sessionEnded";

interface ScreenState {
  currentScreen: Screen;
}

const initialScreenState: ScreenState = {
  currentScreen: "introLoading",
};

export const screenAtom = atom<ScreenState>(initialScreenState);