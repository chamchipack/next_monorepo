import db from "@/api/module";
import { Student } from "@/config/type/default/students";
import { Collection } from ".";

interface Pagination {
  page: number;
  perPage: number;
}

interface StudentRows {
  rows: Student[];
  total: number;
}

export const fetchStudents = async (
  collection: Collection,
  pagination: Pagination,
  datagridStudentState: any
): Promise<StudentRows> => {
  const { data: { items = [], totalItems = 0 } = {} } = await db.search(
    collection,
    { pagination, options: { ...datagridStudentState } }
  );

  return { rows: items, total: totalItems };
};
