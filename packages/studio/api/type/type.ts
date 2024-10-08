export type ResponseType<T> = {
  status: ResponseStatus["status"];
  data?: T;
  message: ResponseStatus["message"];
};

export type ResponseStatus = {
  status: 401 | 402 | 403 | 404 | 200 | 405 | 500 | 201 | 204;
  message:
    | "unauthorized"
    | "expired"
    | "invalid"
    | "refresh"
    | "success"
    | "error";
};

export enum ResponseMessage {
  auth = "unauthorized",
  exp = "expired",
  invalid = "invalid",
  ref = "refresh",
  suc = "success",
}
