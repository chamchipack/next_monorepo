import { atom } from "recoil";

interface StudentDataGridStates {
  "name.like"?: string; //
  "type.equal"?: string; //
  "classId.like"?: string[];
  "paymentType.equal"?: string | null; //
  "currentStatus.like"?: boolean | null; //
  "lessonBasedPayment.isPaid.like"?: boolean | null; //
}

export const defaultValue = {};

const StudentDataGridAtom = atom<StudentDataGridStates>({
  key: "StudentDataGrid",
  default: defaultValue,
});

export default StudentDataGridAtom;
