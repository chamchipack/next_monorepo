import { OriginType } from "./origin";

/**
 * @description
 * Default Type of Class Collection
 */

export interface Class extends OriginType {
  name: string;
  price: number;
  instructorId: string[];
  sdate: string;
}

export const initialClassData: Class = {
  id: "",
  name: "",
  price: 0,
  instructorId: [],
  sdate: "",
};
