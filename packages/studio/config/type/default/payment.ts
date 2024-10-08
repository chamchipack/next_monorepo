import { OriginType } from "./origin";
/**
 * @description
 * Default Type of Payment Collection
 */

export interface Payment extends OriginType {
  studentId: string;
  studentName: string;
  sessionId: string;
  sessionName: string;
  classId: string;
  className: string;
  instructorId: string;
  confirmationId: string;
  paymentDate: string;
  paymentType: "regular" | "package";
  confirmationDate: string;
  paymentYearMonth: string;
  amount: number;
  method: "card" | "cash" | "account" | "other";
  remarks?: string;
}

type AttendanceDataModel = {
  [key: string]: string;
};

export const PaymentDataModel: AttendanceDataModel = {
  id: "아이디",
  studentId: "수강생 아이디",
  studentName: "수강생 명",
  sessionId: "세션 아이디",
  sessionName: "세션명",
  classId: "클래스 아이디",
  className: "클래스명",
  instructorId: "강사 명",
  confirmationId: "결체 처리인",
  paymentDate: "결제일",
  paymentType: "결제타입",
  confirmationDate: "결제 처리일",
  paymentYearMonth: "결제연월",
  amount: "금액",
  method: "결제방법",
  remarks: "주석",
};

export const initialPaymentData: Payment = {
  id: "",
  studentId: "",
  studentName: "",
  sessionId: "",
  sessionName: "",
  classId: "",
  className: "",
  instructorId: "",
  confirmationId: "",
  paymentDate: "",
  paymentType: "regular",
  confirmationDate: "",
  paymentYearMonth: "",
  amount: 0,
  method: "other",
  remarks: "",
};
