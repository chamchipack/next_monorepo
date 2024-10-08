import pb from "./pocketbase";

import { ResponseMessage, ResponseType } from "@/api/type/type";

type Collection =
  | "student"
  | "session"
  | "class"
  | "attendance"
  | "payment"
  | "instructor";

type Constructor = {
  collection: Collection;
};

type SortOption = { key: string; method: "asc" | "desc" }

interface SearchOptions {
  pagination?: { page: number; perPage: number };
  options?: any;
  target: Collection;
  sort: SortOption;
}

interface SingleOptions {
  id: string;
  target: Collection;
}

interface CreateOptions {
  data?: any;
  target: string;
}

class PocketbaseFinder {
  collection: string;

  constructor({ collection }: Constructor) {
    this.collection = collection;
    this.buildFilterParams = this.buildFilterParams.bind(this);
    this.search = this.search.bind(this);
  }

  //   function createOrFilterString(sessionIds) {
  //     return sessionIds.map(id => `sessionId='${id}'`).join(' || ');
  // }

  // // 예시 배열
  // const sessionIds = ["wjaey1h2ve7dmto", "ilkrvix7qqgv717", "anotherSessionId"];

  // // 필터 문자열 생성
  // const filterString = createOrFilterString(sessionIds);

  private buildFilterCondition(key: string, value: any) {
    if (key === "query") return value;
    const [field, type, late = ""] = key.split(".");
    if ((!value && typeof value !== "boolean") || field === "_id") return "";

    const gbn = late ? late : type;
    const _field = late ? `${field}.${type}` : field;
    switch (gbn) {
      case "like":
        return typeof value === "string"
          ? `${_field}~"${value}"`
          : `${_field}~${value}`;
      case "equal":
        return typeof value === "string"
          ? `${_field}="${value}"`
          : `${_field}=${value}`;
      case "or":
        return Array.isArray(value)
          ? `(${value.map((i) => `${_field}~"${i}"`).join("||")})`
          : "";
      case "not":
        return `${_field}!~"${value}"`;
      case "lte":
        return `${_field}?<="${value}"`;
      case "gte":
        return `${_field}?>="${value}"`;
      default:
        return "";
    }
  }

  private buildFilterParams(filter: any) {
    if (!filter) return "";
    const filterEntries = Object.entries(filter);
    if (filterEntries.length === 0) return "";

    return filterEntries
      .map(([key, value], index) => this.buildFilterCondition(key, value))
      .filter((condition) => condition !== "")
      .join("&&");
  }

  private buildSortParams({ key = "", method = "desc" }: SortOption) {
    if (!key) return ""

    return method === "desc" ? `-${key}` : key
  }

  async search(req: SearchOptions): Promise<ResponseType<any>> {
    const { pagination = {}, options = {}, target = "", sort } = req;

    const {
      page = 1,
      perPage = Infinity,
    }: { page?: number; perPage?: number } = pagination;

    if (!page || !perPage) throw new Error("Pagination not found");

    const filterParams = this.buildFilterParams(options);
    const sortOption: string = this.buildSortParams(sort) || ""

    try {
      let result: any = {};
      if (perPage === Infinity)
        result = await pb
          .collection(target)
          .getFullList({ filter: filterParams, sort: sortOption });
      else
        result = await pb
          .collection(target)
          .getList(page, perPage, { filter: filterParams, sort: sortOption });

      return {
        data: result,
        status: 200 as const,
        message: ResponseMessage.suc,
      };
    } catch (err: any) {
      if (err.response) {
        throw new Error("Error fetching data");
      } else if (err.request) {
        throw new Error("No response from serve");
      } else {
        throw new Error("Problem with request");
      }
    }
  }

  async single(req: SingleOptions): Promise<ResponseType<any>> {
    const { id = "", target = "" } = req;

    try {
      const data = (await pb.collection(target).getOne(id)) ?? {};

      return { data, status: 200 as const, message: ResponseMessage.suc };
    } catch (err: any) {
      if (err.response) {
        throw new Error("Error fetching data");
      } else if (err.request) {
        throw new Error("No response from serve");
      } else {
        throw new Error("Problem with request");
      }
    }
  }

  async create(req: CreateOptions): Promise<ResponseType<any>> {
    const { data = {}, target } = req;

    // if (!data?.id) throw new Error("Id is required");

    try {
      const record = await pb.collection(target).create(data);

      return {
        status: 201 as const,
        message: ResponseMessage.suc,
        data: record,
      };
    } catch (err: any) {
      if (err.response) {
        throw new Error("Error fetching data");
      } else if (err.request) {
        throw new Error("No response from server");
      } else {
        throw new Error("Request failedt");
      }
    }
  }

  async update(req: CreateOptions) {
    const { target, data: { id = "", ...rest } = {} } = req;

    if (!id) throw new Error("Id is required");

    try {
      const record = await pb.collection(target).update(id, rest);

      return { status: 201, message: ResponseMessage.suc };
    } catch (err: any) {
      if (err.response) {
        throw new Error("Error fetching data");
      } else if (err.request) {
        throw new Error("No response from server");
      } else {
        throw new Error("Request failedt");
      }
    }
  }

  async delete(req: SingleOptions) {
    const { target, id = "" } = req;

    if (!id) throw new Error("Id is required");

    try {
      const record = await pb.collection(target).delete(id);

      return { status: 204, message: ResponseMessage.suc };
    } catch (err: any) {
      if (err.response) {
        throw new Error("Error fetching data");
      } else if (err.request) {
        throw new Error("No response from server");
      } else {
        throw new Error("Request failedt");
      }
    }
  }
}

export default PocketbaseFinder;
