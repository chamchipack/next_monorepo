import { atom } from "recoil";

interface SessionDataGridStates {
  "type.like"?: string;
  "regularDays.or"?: string[];
  "name.like"?: string;
}

export const defaultValue = {};

const SessionDataGridAtom = atom<SessionDataGridStates>({
  key: "SessionDataGrid",
  default: defaultValue,
});

export default SessionDataGridAtom;
