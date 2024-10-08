import { atom } from "recoil";

type EditAccessState = boolean;

export const defaultValue = false;

const EditAccessAtom = atom<EditAccessState>({
  key: "EditAccessAtom",
  default: defaultValue,
});

export default EditAccessAtom;
