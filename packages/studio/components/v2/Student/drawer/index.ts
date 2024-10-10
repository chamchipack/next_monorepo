import { Day, LessonFlexible, TimeSet } from "@/config/type/default/session";
import { Student } from "@/config/type/default/students";

export type StudentSubmit = {
  id?: string;
  name?: string;
  classId?: string[];
  paymentType?: "regular" | "package" | "";
  lastPaymentDate?: string;
  total?: number;
  remaining?: number;
  info?: Record<"age" | "phone", number | string>;
  enrollmentDate?: string;
  instructorId?: string[];
  type?: "class" | "lesson";
  sessionId?: string[];
  currentStatus?: boolean;
};

type LessionTimeset = {
  [key in Day]?: TimeSet;
};

export type SessionSubmit = {
  id?: string;
  name?: string;
  regularDays?: string[];
  lessonTimes?: LessionTimeset;
  classId?: string;
  studentId?: string[];
  type?: "class" | "lesson";
  description?: string;
  instructorId?: string[];
  regularTimes?: TimeSet;
  flexibleSchedule?: LessonFlexible[];
};

export interface SubmitForm {
  student?: StudentSubmit;
  session?: SessionSubmit;
}

export interface Assemble {
  student?: StudentSubmit;
  session?: SessionSubmit;
}
