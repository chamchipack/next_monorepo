import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddCardIcon from "@mui/icons-material/AddCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

// 메뉴 항목의 타입 정의
interface MenuItem {
  _id: string;
  title: string;
  target: string;
  desc?: string;
  icon: React.ComponentType;
}

// 접근 권한 타입 정의
interface Access {
  [key: string]: {
    access: boolean;
    editable: boolean;
  };
}

// 특정 경로가 편집 가능한지 여부를 판단하는 함수
export const getIsEditable = (path: string, access: Access): boolean => {
  if (!path || !access) return false;

  const { _id = "" } = result.find(({ target = "" }) => target === path) || {};
  const { editable = false } = access[_id] || {};
  return editable;
};

// 메뉴 항목 배열
const result: MenuItem[] = [
  {
    _id: "menu_main",
    title: "대시보드",
    target: "/viewon/main",
    icon: DashboardIcon,
  },
  {
    _id: "menu_student",
    title: "수강생관리",
    target: "/viewon/student",
    desc: "수강생을 신규등록, 수정 및 삭제할 수 있습니다.",
    icon: PeopleAltIcon,
  },
  {
    _id: "menu_session",
    title: "세션관리",
    target: "/viewon/session",
    desc: "수강생을 신규등록, 수정 및 삭제할 수 있습니다.",
    icon: CalendarMonthIcon,
  },
  {
    _id: "menu_management",
    title: "작업관리",
    target: "/viewon/management",
    desc: "출석 및 결제 관리를 할 수 있습니다.",
    icon: AssignmentIcon,
  },
  {
    _id: "menu_instructor",
    title: "사용자관리",
    target: "/viewon/instructor",
    desc: "시스템 사용자를 관리합니다.",
    icon: SwitchAccountIcon,
  },
  // 추가된 메뉴 항목이 있으면 아래 주석을 해제하여 사용할 수 있습니다.
  // {
  //   _id: "menu_members",
  //   title: "인원관리",
  //   target: "/viewon/members",
  //   desc: "수강생을 신규등록, 수정 및 삭제할 수 있습니다.",
  //   icon: PeopleAltIcon,
  // },
  // {
  //   _id: "menu_schedules",
  //   title: "일정관리",
  //   target: "/viewon/schedules",
  //   desc: "수강생의 일정을 등록 및 수정할 수 있습니다.",
  //   icon: CalendarMonthIcon,
  // },
  // {
  //   _id: "menu_attends",
  //   title: "출석관리",
  //   target: "/viewon/attends",
  //   desc: "",
  //   icon: AssignmentIcon,
  // },
  // {
  //   _id: "menu_payments_history",
  //   title: "결제관리",
  //   target: "/viewon/payment-history",
  //   desc: "",
  //   icon: AddCardIcon,
  // },
  // {
  //   _id: "menu_classes",
  //   title: "클래스관리",
  //   target: "/viewon/classes",
  //   desc: "수업 과목을 등록 및 수정할 수 있습니다.",
  //   icon: AccountBalanceIcon,
  // },
  // {
  //   _id: "menu_users",
  //   title: "사용자관리",
  //   target: "/viewon/users",
  //   desc: "시스템 사용자를 관리합니다.",
  //   icon: SwitchAccountIcon,
  // },
];

export default result;
