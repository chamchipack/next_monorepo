import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { fetchClassData } from "./api";
import { Collection } from ".";
import PaymentDataAtom from "../lib/state";

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

export const useClassData = (collection: Collection) => {
  if (!collection) throw new Error("컬렉션을 지정해주세요");
  if (!isValidCollection(collection))
    throw new Error("유효하지 않은 컬렉션입니다");

  return useQuery({
    queryKey: [collection],
    queryFn: () => fetchClassData(collection),
    staleTime: 5000,
  });
};
