import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
// import { SendIcon } from "@/config/material-ui/material-ui";
import AddCardIcon from "@mui/icons-material/AddCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

export const getIsEditable = (path, access) => {
  if (!path || !access) return false;

  const { _id = "" } = result.find(({ target = "" }) => target === path) || {};
  const { editable = false } = access[_id] || {};
  return editable;
};

const result = [
  // {
  //   _id: "menu_dashboards",
  //   title: "대시보드",
  //   target: "/workspace/dashboards",
  //   icon: DashboardIcon,
  // },
  {
    _id: "menu_main",
    title: "대시보드",
    target: "/workspace/main",
    icon: DashboardIcon,
  },
  {
    _id: "menu_student",
    title: "수강생관리",
    target: "/workspace/student",
    desc: "수강생을 신규등록, 수정 및 삭제할 수 있습니다.",
    icon: PeopleAltIcon,
  },
  {
    _id: "menu_session",
    title: "세션관리",
    target: "/workspace/session",
    desc: "수강생을 신규등록, 수정 및 삭제할 수 있습니다.",
    icon: CalendarMonthIcon,
  },
  {
    _id: "menu_management",
    title: "작업관리",
    target: "/workspace/management",
    desc: "출석 및 결제 관리를 할 수 있습니다.",
    icon: AssignmentIcon,
  },
  {
    _id: "menu_class",
    title: "클래스관리",
    target: "/workspace/class",
    desc: "수업 과목을 등록 및 수정할 수 있습니다.",
    icon: AccountBalanceIcon,
  },
  {
    _id: "menu_instructor",
    title: "사용자관리",
    target: "/workspace/instructor",
    desc: "시스템 사용자를 관리합니다.",
    icon: SwitchAccountIcon,
  },
  // {
  //   _id: "menu_members",
  //   title: "인원관리",
  //   target: "/workspace/members",
  //   desc: "수강생을 신규등록, 수정 및 삭제할 수 있습니다.",
  //   icon: PeopleAltIcon,
  // },
  // {
  //   _id: "menu_schedules",
  //   title: "일정관리",
  //   target: "/workspace/schedules",
  //   desc: "수강생의 일정을 등록 및 수정할 수 있습니다.",
  //   icon: CalendarMonthIcon,
  // },
  // {
  //   _id: "menu_attends",
  //   title: "출석관리",
  //   target: "/workspace/attends",
  //   desc: "",
  //   icon: AssignmentIcon,
  // },
  // {
  //   _id: "menu_payments_history",
  //   title: "결제관리",
  //   target: "/workspace/payment-history",
  //   desc: "",
  //   icon: AddCardIcon,
  // },

  // {
  //   _id: "menu_users",
  //   title: "사용자관리",
  //   target: "/workspace/users",
  //   desc: "시스템 사용자를 관리합니다.",
  //   icon: SwitchAccountIcon,
  // },
];

export default result;

// const auth = {
//   menu_dashboards: { editable: true, access: true },
//   menu_student: { editable: true, access: true },
//   menu_session: { editable: true, access: true },
//   menu_management: { editable: true, access: true },
//   menu_members: { editable: true, access: true },
//   menu_schedules: { editable: true, access: true },
//   menu_attends: { editable: true, access: true },
//   menu_payments_history: { editable: true, access: true },
//   menu_classes: { editable: true, access: true },
//   menu_users: { editable: true, access: true },
//   menu_instructor: { editable: true, access: true },
//   menu_main: { editable: true, access: true },
// };

// const base64Encoded = btoa(unescape(encodeURIComponent(JSON.stringify(auth))));

// eyJtZW51X2Rhc2hib2FyZHMiOnsiZWRpdGFibGUiOnRydWUsImFjY2VzcyI6dHJ1ZX0sIm1lbnVfc3R1ZGVudCI6eyJlZGl0YWJsZSI6dHJ1ZSwiYWNjZXNzIjp0cnVlfSwibWVudV9zZXNzaW9uIjp7ImVkaXRhYmxlIjp0cnVlLCJhY2Nlc3MiOnRydWV9LCJtZW51X21hbmFnZW1lbnQiOnsiZWRpdGFibGUiOnRydWUsImFjY2VzcyI6dHJ1ZX0sIm1lbnVfbWVtYmVycyI6eyJlZGl0YWJsZSI6dHJ1ZSwiYWNjZXNzIjp0cnVlfSwibWVudV9zY2hlZHVsZXMiOnsiZWRpdGFibGUiOnRydWUsImFjY2VzcyI6dHJ1ZX0sIm1lbnVfYXR0ZW5kcyI6eyJlZGl0YWJsZSI6dHJ1ZSwiYWNjZXNzIjp0cnVlfSwibWVudV9wYXltZW50c19oaXN0b3J5Ijp7ImVkaXRhYmxlIjp0cnVlLCJhY2Nlc3MiOnRydWV9LCJtZW51X2NsYXNzZXMiOnsiZWRpdGFibGUiOnRydWUsImFjY2VzcyI6dHJ1ZX0sIm1lbnVfdXNlcnMiOnsiZWRpdGFibGUiOnRydWUsImFjY2VzcyI6dHJ1ZX0sIm1lbnVfaW5zdHJ1Y3RvciI6eyJlZGl0YWJsZSI6dHJ1ZSwiYWNjZXNzIjp0cnVlfSwibWVudV9tYWluIjp7ImVkaXRhYmxlIjp0cnVlLCJhY2Nlc3MiOnRydWV9fQ==
