import moment from "moment";
import { atom } from "recoil";

interface PaymentDataStates {
  "name.like"?: string; //
  paymentDate?: string;
}

export const defaultValue = {
  paymentDate: moment().format("YYYY-MM"),
};

const PaymentDataAtom = atom<PaymentDataStates>({
  key: "PaymentData",
  default: defaultValue,
});

export default PaymentDataAtom;
