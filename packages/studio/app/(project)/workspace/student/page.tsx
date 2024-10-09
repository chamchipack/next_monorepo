import StudentFilter from "@/components/v2/Student/StudentFilter";
import StudentGrid from "@/components/v2/Student/StudentGrid";
import { getData } from "@/api/module/fetch";

const MainPage = async () => {
  const params = { target: "student", type: "search", options: {}, sort: {} }
  const result = await getData(params)
  const form = { rows: result?.data?.items, total: result?.data?.items?.length }
  // console.log(form)
  return (
    <>
      <StudentFilter />
      <div>{form?.total}그억</div>
      <StudentGrid />
    </>
  );
};

export default MainPage;
