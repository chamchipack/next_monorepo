import { OriginType } from "./origin";

export interface RegularPayment {
  lastPaymentDate?: string;
  nextDueDate?: string;
}

export interface LessonBasedPayment {
  isPaid?: boolean;
  total?: number;
  over?: number;
  remaining?: number;
}

/**
 * @description
 * Default Type of Student Collection
 */
export interface Student extends OriginType {
  name: string;
  info: Record<"age" | "phone", number | string>;
  enrollmentDate: string;
  instructorId: string[];
  type: "class" | "lesson";
  classId: string[];
  sessionId: string[];
  paymentType: "regular" | "package";
  currentStatus: boolean;
  regularPayment: RegularPayment;
  lessonBasedPayment: LessonBasedPayment;
}

export const initialStudentData: Student = {
  id: "",
  name: "",
  info: { age: 0, phone: "" },
  enrollmentDate: "",
  instructorId: [],
  type: "class",
  classId: [],
  sessionId: [],
  paymentType: "regular",
  currentStatus: true,
  regularPayment: {},
  lessonBasedPayment: {},
};

type StudentDataModel = {
  [key: string]: string;
};

export const studentDataModel: StudentDataModel = {
  id: "id",
  name: "이름",
  age: "나이",
  phone: "번호",
  enrollmentDate: "등록일",
  instructorId: "담당강사",
  type: "수강타입",
  classId: "클래스명",
  sessionId: "참여세션명",
  paymentType: "결제타입",
  currentStatus: "재원상태",
  "regularPayment.lastPaymentDate": "마지막결제일",
  "regularPayment.nextDueDate": "다음결제일",
  "lessonBasedPayment.isPaid": "회차결제여부",
  "lessonBasedPayment.total": "회차전체회수",
  "lessonBasedPayment.over": "회차오버회수",
  "lessonBasedPayment.remaining": "회차남은회수",
};
