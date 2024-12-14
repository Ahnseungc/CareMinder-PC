import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance, { CustomAxiosRequestConfig } from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export type StaffSimpleListType = {
  staffId: number;
  staffRole: string;
  name: string;
  loginId: string;
};

export type GetStaffSimpleListResponse = {
  data: StaffSimpleListType[];
};

export const getStaffSimpleList = async () => {
  const res = await axiosInstance.get("/wards/staff-simple-list", {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessTokenWard")}`,
    },
    customHeader: true,
  } as CustomAxiosRequestConfig);

  console.log(res.data);
  return res.data;
};

export const useGetStaffSimpleList = (): UseQueryResult<GetStaffSimpleListResponse, AxiosError> => {
  return useQuery<GetStaffSimpleListResponse, AxiosError>({
    queryKey: ["staffSimpleList"],
    queryFn: getStaffSimpleList,
  });
};
