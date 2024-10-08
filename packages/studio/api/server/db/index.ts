import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { ResponseMessage, ResponseType } from "@/api/type/type";

const { URL } = require("url");

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

export const singleController = async () => {};

export const searchController = async (
  req: any
): Promise<ResponseType<any>> => {
  const { pagination = {}, filter = {}, target = "" } = req;

  const { page = 1, perPage = 10 }: { page?: number; perPage?: number } =
    pagination;

  if (!page || !perPage) throw new Error("Pagination not found");

  const paginationParams = Object.entries(pagination).length
    ? new URLSearchParams(pagination).toString()
    : "";

  const filterParams = Object.entries(filter).length
    ? Object.entries(filter).reduce((acc, [key, value], index) => {
        if (!value || key === "_id") return acc;
        if (key === "query") acc += value;
        else {
          const [k, type] = key.split(".");
          if (index > 0 && acc) acc += `&&`;

          if (type === "like") acc += `${k}~"${value}"`;
          else if (type === "equal") acc += `${k}="${value}"`;
          else if (type === "lte") acc += `${k}?<="${value}"`;
          else if (type === "gte") acc += `${k}?>="${value}"`;
          // if (Object.entries(filter).length > index + 1) acc += `&&`;
        }
        return acc;
      }, "")
    : "";

  const single = filter?._id ? `/${filter?._id}` : "";
  const _filter = encodeURIComponent(`${filterParams.toString()}`);
  const address = `/api/collections/${target}/records${single}?${paginationParams}${filterParams ? `&filter=${_filter}` : ""}`;

  try {
    const { data = {} } = await axiosInstance.get(address);
    // return { status: 404, message: "error" };
    return { data, status: 200, message: ResponseMessage.suc } ?? {};
  } catch (err: any) {
    if (err.response) {
      //  응답을 받았으나 요청이 에러를 발생시킨 경우
      throw new Error("Error fetching data");
    } else if (err.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      throw new Error("No response from serve");
      // return res
      //   .status(504)
      //   .json({ message: "No response from server", details: err.request });
    } else {
      // 요청을 설정하는 중에 문제가 발생한 경우
      throw new Error("Problem with request");
      // return res
      //   .status(500)
      //   .json({ message: "Request failed", details: err.message });
    }
  }
};

export const createController = async (
  req: any
): Promise<ResponseType<any>> => {
  const { data = {}, target = "" } = req;

  if (!target) throw new Error("URL not found");

  try {
    const response = await axiosInstance.post(
      `/api/collections/${target}/records`,
      data
    );
    return { status: 201, message: ResponseMessage.suc };
    // res.status(200).json({ message: "POST request processed" });
  } catch (err: any) {
    if (err.response) {
      //  응답을 받았으나 요청이 에러를 발생시킨 경우
      throw new Error("Error fetching data");
      // const { status, data } = err.response;
      // return res.status(status).json({
      //   message: data.message || "Error fetching data",
      //   details: data,
      // });
    } else if (err.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      throw new Error("No response from server");
      // return res
      //   .status(504)
      //   .json({ message: "No response from server", details: err.request });
    } else {
      // 요청을 설정하는 중에 문제가 발생한 경우
      throw new Error("Request failedt");
      // return res
      //   .status(500)
      //   .json({ message: "Request failed", details: err.message });
    }
  }
};

export const updateController = async (
  req: any
): Promise<ResponseType<any>> => {
  const { data = {}, target = "" } = req;

  if (!target) throw new Error("URL not found");

  const { id = "", ...rest } = data;

  try {
    const response = await axiosInstance.patch(
      `/api/collections/${target}/records/${id}`,
      rest
    );
    return { status: 201, message: ResponseMessage.suc };
    // res.status(200).json({ message: "PATCH request processed" });
  } catch (err: any) {
    if (err.response) {
      //  응답을 받았으나 요청이 에러를 발생시킨 경우
      throw new Error("Error fetching data");
      // const { status, data } = err.response;
      // return res.status(status).json({
      //   message: data.message || "Error fetching data",
      //   details: data,
      // });
    } else if (err.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      throw new Error("Error fetching data");
      // return res
      //   .status(504)
      //   .json({ message: "No response from server", details: err.request });
    } else {
      // 요청을 설정하는 중에 문제가 발생한 경우
      throw new Error("Error fetching data");
      // return res
      //   .status(500)
      //   .json({ message: "Request failed", details: err.message });
    }
  }
};

export const deleteController = async (
  req: any
): Promise<ResponseType<any>> => {
  const { filter: { id = "" } = {}, target = "" } = req;

  if (!id) throw new Error("id not found");

  const address = `/api/collections/${target}/records/${id}`;

  try {
    const response = await axiosInstance.delete(address);
    return { status: 204, message: ResponseMessage.suc };
  } catch (err: any) {
    if (err.response) {
      //  응답을 받았으나 요청이 에러를 발생시킨 경우
      throw new Error("Error fetching data");
      // const { status, data } = err.response;
      // return res.status(status).json({
      //   message: data.message || "Error fetching data",
      //   details: data,
      // });
    } else if (err.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      throw new Error("Error fetching data");
      // return res
      //   .status(504)
      //   .json({ message: "No response from server", details: err.request });
    } else {
      // 요청을 설정하는 중에 문제가 발생한 경우
      throw new Error("Error fetching data");
      // return res
      //   .status(500)
      //   .json({ message: "Request failed", details: err.message });
    }
  }
};
