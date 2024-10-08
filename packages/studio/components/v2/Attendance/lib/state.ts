import moment from "moment";
import { atom } from "recoil";

interface AttendanceDataStates {
  "name.like"?: string; //
  attendanceDate?: string;
}

export const defaultValue = {
  attendanceDate: moment().format("YYYY-MM-DD"),
};

const AttendanceDataAtom = atom<AttendanceDataStates>({
  key: "AttendanceData",
  default: defaultValue,
});

export default AttendanceDataAtom;
