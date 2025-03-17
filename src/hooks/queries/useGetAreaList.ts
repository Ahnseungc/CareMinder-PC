import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Areas } from "./useGetStaffList";

export type GetAreaResponse = {
  wardId: number;
  wardName: string;
  areas: Areas[];
};

export type GetAreaListRequest = {
  type: string;
};

export const getAreaList = async ({ type }: GetAreaListRequest) => {
  if (type === "WARD") {
    const res = await axiosInstance.get("/areas");
    return res.data;
  } else if (type === "STAFF") {
    const res = await axiosInstance.get("/areas", {
      headers: { Authorization: `Bearer ${Cookies.get("accessTokenWard")}` },
      customHeader: true,
    } as CustomAxiosRequestConfig);
    return res.data;
  }
};

export const useGetAreaList = (options?: {
  enabled?: boolean;
}): UseQueryResult<GetAreaResponse, AxiosError> => {
  return useQuery<GetAreaResponse, AxiosError>({
    queryKey: ["areaList"],
    queryFn: () => getAreaList({ type: "WARD" }),
    enabled: options?.enabled,
  });
};

export const useGetStaffAreaList = (): UseQueryResult<GetAreaResponse, AxiosError> => {
  return useQuery<GetAreaResponse, AxiosError>({
    queryKey: ["areaListStaff"],
    retry: 3,
    retryDelay: 1000,
    queryFn: () => getAreaList({ type: "STAFF" }),
  });
};
