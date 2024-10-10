import { Student } from "@/config/type/default/students";

export type AttendStatus =
  | "standby"
  | "needCharge"
  | "absent"
  | "present"
  | "late"
  | "excused";

export enum AttendEnums {
  standby = "처리 대기",
  needCharge = "결제 필요",
  present = "정상 출석",
  absent = "결석",
  late = "지각",
}

export const AttendStatusTemplate = {
  present: { name: "출석", color: "success.main" },
  late: { name: "지각", color: "warning.main" },
  excused: { name: "보강", color: "primary.main" },
  absent: { name: "결석", color: "error.main" },
  // standby: { name: "출석 대기", color: "primary.main" },
  // needCharge: { name: "결제 필요", color: "warning.main" },
};

export interface Rows extends Student {
  rowStatus: AttendStatus;
  excusedDate?: string;
  isEditable: boolean;
  lessonTime?: { stime: string; etime: string };
}
