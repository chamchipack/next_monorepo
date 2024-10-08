import { getSession, signIn } from "next-auth/react";

interface Headers {
  "Content-Type": string;
}

interface FetchOptions extends RequestInit {
  headers: HeadersInit;
}

interface CustomResponse {
  status: number;
  url: string;
  options: FetchOptions;
  json(): Promise<any>;
}

interface SearchResponse {
  status: number;
  data: any;
  message: string;
}

type Schema =
  | "student"
  | "session"
  | "class"
  | "attendance"
  | "payment"
  | "instructor";

interface Session {
  user?: any;
}

enum Target {
  route = "/api/route",
  v2 = "/api/v2",
}

const headers: Headers = { "Content-Type": "application/json" };

class ApiClient {
  private headers: Headers;

  constructor() {
    this.headers = { "Content-Type": "application/json" };
  }

  private async fetchWithAccessToken(
    url: string,
    options: FetchOptions
  ): Promise<CustomResponse> {
    const response: Response = await fetch(url, options);
    return {
      status: response.status,
      url,
      options,
      json: response.json.bind(response),
    };
  }

  private async handleResponse(
    response: CustomResponse
  ): Promise<SearchResponse | unknown> {
    if (response.status === 402) {
      return this.fetchWithAccessToken(response.url, response.options).then(
        this.handleResponse.bind(this)
      );
    }

    const result = await response.json();
    if (result.status === 401) return signIn();

    return { status: response.status, ...result };
  }

  private async request(url: string, method: string, body: any): Promise<any> {
    const session: Session | null = await getSession();
    if (!session) return signIn();

    const options: FetchOptions = {
      method: method,
      headers: { ...this.headers },
      body: JSON.stringify(body),
    };

    return this.fetchWithAccessToken(url, options).then(
      this.handleResponse.bind(this)
    );
  }

  private removeEmptyValues(obj: any) {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([key, value]) => value !== "" && value !== null
      )
    );
  }

  /**
   * @description
   * DB를 검색하여 데이터를 반환한다. 기본적으로 페이징이 적용되어 있다.
   *
   * @example
   * db.search("collection", { pagination: { page: 0, perPage:10}, options: { "name.like": "name"} })
   * @param url
   * @param param1
   * @returns
   */
  public async search(
    url: Schema,
    { pagination, options, sort = { key: "", method: "desc" } }: SearchParams = {}
  ): Promise<SearchResponse> {
    const setOptions = this.removeEmptyValues(options);
    const body = {
      pagination,
      options: setOptions,
      type: "search",
      target: url,
      sort
    };
    return this.request("/api/route", "POST", body);
  }

  public async single(url: Schema, id: string): Promise<SearchResponse> {
    const body = { type: "single", target: url, id };
    return this.request("/api/route", "POST", body);
  }

  public async create(url: Schema, data: any): Promise<SearchResponse> {
    const body = { data, type: "create", target: url };
    return this.request("/api/route", "POST", body);
  }

  public async update(url: Schema, data: any): Promise<SearchResponse> {
    const body = { data, type: "update", target: url };
    return this.request("/api/route", "PUT", body);
  }

  public async deleteFetch(url: Schema, id: string): Promise<any> {
    const body = { type: "delete", id, target: url };
    return this.request("/api/route", "DELETE", body);
  }
}

interface SearchParams {
  pagination?: { page: number; perPage: number };
  options?: any;
  sort?: { key: string; method: "asc" | "desc"; }
}

const apiClient = new ApiClient();

const result = {
  search: apiClient.search.bind(apiClient),
  create: apiClient.create.bind(apiClient),
  update: apiClient.update.bind(apiClient),
  delete: apiClient.deleteFetch.bind(apiClient),
  single: apiClient.single.bind(apiClient),
};

export default result;
