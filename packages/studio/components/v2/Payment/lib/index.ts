import { Student } from "@/config/type/default/students";

export type PaymentStatus = "needCharge" | "completed";

export interface Rows extends Student {
  rowStatus: PaymentStatus;
  price?: number;
}
