import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type AreasType = {
  areaId: number;
  areaName: string;
  memo: string;
};

export type GetWardAreaListsResponse = {
  wardId: number;
  wardName: string;
  areas: AreasType[];
};

export const getWardAreaLists = async () => {
  const res = await axiosInstance.get("/admins/ward-area-list");
  return res.data;
};

export const useGetWardAreaLists = (): UseQueryResult<GetWardAreaListsResponse[], AxiosError> => {
  return useQuery<GetWardAreaListsResponse[], AxiosError>({
    queryKey: ["ward-area-List"],
    queryFn: getWardAreaLists,
  });
};
