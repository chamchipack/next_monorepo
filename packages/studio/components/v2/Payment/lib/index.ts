import { Student } from "@/v2/type/students";

export type PaymentStatus = "needCharge" | "completed";

export interface Rows extends Student {
  rowStatus: PaymentStatus;
  price?: number
}
