import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export type GetAreaListResponse = {
  id: number;
  wardId: number;
  name: string;
  memo: string;
};

export type getAreaListRequest = {
  type: string;
  token?: string;
};

export const getAreaList = async ({ type }: getAreaListRequest) => {
  if (type === "WARD") {
    const res = await axiosInstance.get("/areas");
    return res.data;
  } else if (type === "STAFF") {
    const res = await axiosInstance.get("/areas", {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessTokenWard")}`,
      },
    });
    return res.data;
  }
};

export const useGetAreaList = (): UseQueryResult<GetAreaListResponse[], AxiosError> => {
  return useQuery<GetAreaListResponse[], AxiosError>({
    queryKey: ["areaList"],
    queryFn: () => getAreaList({ type: "WARD" }),
  });
};

export const useGetStaffAreaList = (): UseQueryResult<GetAreaListResponse[], AxiosError> => {
  return useQuery({
    queryKey: ["areaList"],
    retry: 3,
    retryDelay: 1000,
    queryFn: () => getAreaList({ type: "STAFF" }),
  });
};
