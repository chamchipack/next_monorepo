import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import StudentDataGridAtom from "./state";
import { fetchStudents } from "./api";
import { Collection } from ".";

export const isValidCollection = (
  collection: string
): collection is Collection => {
  const validCollections: Collection[] = [
    "student",
    "session",
    "attendance",
    "instructor",
    "payment",
    "class",
  ];
  return validCollections.includes(collection as Collection);
};

export const useStudentData = (
  collection: Collection,
  pagination: {
    page: number;
    perPage: number;
  }
) => {
  if (!collection) throw new Error("컬렉션을 지정해주세요");
  if (!isValidCollection(collection))
    throw new Error("유효하지 않은 컬렉션입니다");

  const datagridStudentState = useRecoilValue(StudentDataGridAtom);

  return useQuery({
    queryKey: [collection, pagination, datagridStudentState],
    queryFn: () => fetchStudents(collection, pagination, datagridStudentState),
    staleTime: 5000,
  });
};
