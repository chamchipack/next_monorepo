import { RecoilState, atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

type BreadCrumbType = {
  title?: string;
  desc?: string;
};

export const breadCrumbDefault: BreadCrumbType = {
  title: "",
  desc: "",
};

export const breadCrumbState: RecoilState<BreadCrumbType> = atom({
  key: "breadCrumbState",
  default: breadCrumbDefault,
  effects_UNSTABLE: [persistAtom],
});
