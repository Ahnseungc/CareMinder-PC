import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type WardTabledListType = {
  areaId: number;
  areaName: string;
  tabletId: number;
  tabletName: string;
  serialNumber: string;
  patientId: number;
  patientName: string;
  createdAt: string;
};

export type GetWardTabletListResponse = {
  data: WardTabledListType[];
};

export const getWardTabledList = async () => {
  const res = await axiosInstance.get("/wards/tablet-list");
  console.log(res.data);
  return res.data;
};

export const useGetWardTabletList = (): UseQueryResult<GetWardTabletListResponse, AxiosError> => {
  return useQuery<GetWardTabletListResponse, AxiosError>({
    queryKey: ["ward-tablet-list"],
    queryFn: getWardTabledList,
  });
};
