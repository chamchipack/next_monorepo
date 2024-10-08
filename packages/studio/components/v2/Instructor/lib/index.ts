import {
  initialInstructorData,
  Instructor,
} from "@/config/type/default/instructor";

export interface ButtonOptions {
  batchExcel: boolean;
  excel: boolean;
  register: boolean;
  modify: boolean;
  delete: boolean;
}

export const buttonOptions: ButtonOptions = {
  batchExcel: false,
  excel: true,
  register: true,
  modify: true,
  delete: true,
};

export enum DrawerType {
  "none" = "none",
  "form" = "form",
  "upload" = "upload",
  "download" = "download",
}

export enum OpenType {
  "none" = "none",
  "create" = "create",
  "update" = "update",
}

export interface Row extends Instructor {
  auth: { [key: string]: { editable: boolean; access: boolean } };
}

export const initialData = {
  ...initialInstructorData,
  auth: {},
};
