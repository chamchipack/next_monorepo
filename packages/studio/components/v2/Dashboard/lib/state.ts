import { atom } from "recoil";

enum Toggle {
  entire = "entire",
  class = "class",
  type = "type",
  method = "method",
}

type ToggleButtonState = Toggle;

export const defaultValue = Toggle.entire;

const ToggleButtonStateAtom = atom<ToggleButtonState>({
  key: "ToggleButtonStateAtom",
  default: defaultValue,
});

export default ToggleButtonStateAtom;
