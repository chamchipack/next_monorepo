import { OriginType } from "./origin";

export type TimeSet = {
  stime?: string;
  etime?: string;
};

export type LessonFlexible = {
  date: string;
  status: "completed" | "scheduled" | "cancelled";
};

export type Day = "0" | "1" | "2" | "3" | "4" | "5" | "6";
export type LessionTime = {
  [key in Day]?: TimeSet;
};

/**
 * @description
 * Default Type of Session Collection
 */
export interface Session extends OriginType {
  name: string;
  classId: string;
  studentId: string[];
  type: "class" | "lesson";
  description: string;
  instructorId: string[];
  regularDays: Day[];
  regularTimes?: TimeSet;
  lessonTimes?: LessionTime;
  flexibleSchedule: LessonFlexible[];
}

export const initialSessionData: Session = {
  id: "",
  name: "",
  classId: "",
  studentId: [],
  type: "lesson",
  description: "",
  instructorId: [],
  regularDays: [],
  regularTimes: {},
  lessonTimes: {},
  flexibleSchedule: [],
};

type AttendanceDataModel = {
  [key: string]: string;
};

export const sessionDataModel: AttendanceDataModel = {
  id: "아이디",
  name: "세션명",
  classId: "과목명",
  studentId: "수강생명",
  type: "수강타입",
  description: "주석",
  instructorId: "담당 강사아이디",
  regularDays: "수업일",
  regularTimes: "수업 시간",
  lessonTimes: "레슨 시간",
  flexibleSchedule: "변동 날짜",
};
