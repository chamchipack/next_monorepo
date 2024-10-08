import moment from "moment";
import { atom } from "recoil";

interface AttendanceDataGridStates {
  "paymentType.equal"?: string | null; //
  "status.or"?: string[];
  "studentName.like"?: string;
  "attendanceDate.like"?: string;
}

export const defaultValue = {
  // "attendanceDate.like": moment().format("YYYY-MM-DD"),
};

const AttendanceDataGridAtom = atom<AttendanceDataGridStates>({
  key: "AttendanceDataGridAtom",
  default: defaultValue,
});

export default AttendanceDataGridAtom;
