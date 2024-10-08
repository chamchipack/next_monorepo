import { RecoilState, atom } from "recoil";

export const toggleCollapsed: RecoilState<boolean> = atom({
  key: "toggleCollapsed",
  default: false,
});
