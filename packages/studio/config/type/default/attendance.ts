import { OriginType } from "./origin";

/**
 * @description
 * Default Type of Attendance Collection
 */
export interface Attendance extends OriginType {
  classId: string;
  sessionId: string;
  sessionName: string;
  className: string;
  studentId: string;
  studentName: string;
  paymentType: "regular" | "package";
  instructorId: string;
  confirmationId: string;
  dayOfWeek: string;
  attendanceDate: string;
  status: "present" | "absent" | "late" | "excused";
  confirmationDate: string;
  excusedDate?: string;
}

type AttendanceDataModel = {
  [key: string]: string;
};

export const initialAttendanceData: Attendance = {
  id: "",
  sessionId: "",
  sessionName: "",
  classId: "",
  className: "",
  studentId: "",
  studentName: "",
  paymentType: "regular",
  dayOfWeek: "",
  instructorId: "",
  confirmationId: "",
  attendanceDate: "", // 실제 출석 날짜
  status: "present", // e.g., "present", "absent", "late", "excused"
  confirmationDate: "", // 출석 확인 날짜excusedDate
  excusedDate: "",
};

export const DaysOfWeek: { [k: string]: string } = {
  "0": "일요일",
  "1": "월요일",
  "2": "화요일",
  "3": "수요일",
  "4": "목요일",
  "5": "금요일",
  "6": "토요일",
};

export const AttendanceDataModel: AttendanceDataModel = {
  id: "id",
  sessionId: "세션 아이디",
  sessionName: "세션명",
  classId: "클래스 아이디",
  className: "클래스명",
  studentId: "수강생 아이디",
  studentName: "수강생 이름",
  paymentType: "결제타입",
  dayOfWeek: "요일",
  instructorId: "담당 강사명",
  confirmationId: "강사 아이디",
  attendanceDate: "출석 날짜", // 실제 출석 날짜
  status: "출석 상태", // e.g., "present", "absent", "late", "excused"
  confirmationDate: "출석 처리일", // 출석 확인 날짜excusedDate
  excusedDate: "보강날짜",
};
