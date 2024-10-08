import { RecoilState, atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

type AuthUser = {
  _id: string;
  isAdmin: boolean;
  name: string;
  username: string;
  isSuperAccount: boolean;
  menuAccess: string;
};

type RecoilClass = {
  collectionId: string;
  collectionName: string;
  created: "";
  id: string;
  name: string;
  price: string;
  startDate: string;
  teacherId: string;
  timesPerWeek: string;
  updated: string;
};

export const authUser: RecoilState<AuthUser> = atom({
  key: "uniqueAuthUserKey",
  default: {
    _id: "",
    isAdmin: "",
    name: "",
    username: "",
    isSuperAccount: false,
    menuAccess: "",
  },
  effects_UNSTABLE: [persistAtom],
});

export const recoilClass: RecoilState<RecoilClass> = atom({
  key: "classState",
  default: [
    {
      collectionId: "",
      collectionName: "",
      created: "Z",
      id: "",
      name: "",
      price: "",
      startDate: "",
      teacherId: "",
      timesPerWeek: "",
      updated: "",
    },
  ],
  effects_UNSTABLE: [persistAtom],
});

export const recoilMembers = atom({
  key: "memberState",
  default: { id: { name: "" } },
  effects_UNSTABLE: [persistAtom],
});

export const refreshScheduleState = atom({
  key: "refreshScheduleState",
  default: false,
});
