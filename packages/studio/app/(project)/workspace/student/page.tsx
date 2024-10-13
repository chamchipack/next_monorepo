import StudentFilter from "@/components/v2/Student/StudentFilter";
import StudentGrid from "@/components/v2/Student/StudentGrid";
import { getData } from "@/api/module/fetch";

const MainPage = async () => {
  const params = { target: "student", type: "search", options: {}, sort: {} };
  const test = "";
  const result = await getData(params);
  const initialTotalData = result?.data?.totalItems ?? 0;
  return (
    <>
      <StudentFilter />
      <StudentGrid total={initialTotalData} />
    </>
  );
};

export default MainPage;
