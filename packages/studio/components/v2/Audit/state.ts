import { atom } from "recoil";

interface PaymentDataGridStates {
    "paymentType.equal"?: string | null; //
    "method.or"?: string[];
    "studentName.like"?: string;
    "paymentDate.like"?: string
}

export const defaultValue = {};

const PaymentDataGridAtom = atom<PaymentDataGridStates>({
    key: "StudentDataGrid",
    default: defaultValue,
});

export default PaymentDataGridAtom;
