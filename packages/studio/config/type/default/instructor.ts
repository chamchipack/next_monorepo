import { OriginType } from "./origin";

export interface Instructor extends OriginType {
    username?: string;
    email?: string;
    name?: string;
    isAdmin: boolean;
    menuAccess: string;
}

export const initialInstructorData: Instructor = {
    username: "",
    email: "",
    name: "",
    isAdmin: false,
    menuAccess: ""
}

type InstructorModel = {
    [key: string]: string;
};

export const instructorDataModel: InstructorModel = {
    id: "id",
    username: "유저명",
    name: "아이디",
    isAdmin: "관리자여부",
    menuAccess: "접근권한"
}