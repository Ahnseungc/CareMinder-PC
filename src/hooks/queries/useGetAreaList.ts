import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type GetAreaListResponse = {
  id: number;
  wardId: number;
  name: string;
};

export const getAreaList = async () => {
  const res = await axiosInstance.get("/areas");
  return res.data;
};

export const useGetAreaList = (): UseQueryResult<GetAreaListResponse[], AxiosError> => {
  return useQuery<GetAreaListResponse[], AxiosError>({
    queryKey: ["areaList"],
    queryFn: getAreaList,
  });
};
