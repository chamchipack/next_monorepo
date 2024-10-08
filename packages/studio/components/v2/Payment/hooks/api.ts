import db from "@/api/module";
import { Collection } from ".";
import { Class } from "@/config/type/default/class";

interface ClassRows {
  rows: Class[];
  total: number;
}

export const fetchClassData = async (
  collection: Collection
): Promise<ClassRows> => {
  const { data: items } = await db.search(collection, { options: {} });
  return { rows: items, total: items.length };
};
