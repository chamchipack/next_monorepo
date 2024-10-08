import { atom } from "recoil";

interface ClassDataGridStates {
  "name.like"?: string;
}

export const defaultValue = {};

const ClassDataGridAtom = atom<ClassDataGridStates>({
  key: "ClassDataGrid",
  default: defaultValue,
});

export default ClassDataGridAtom;
