import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

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
  const res = await axiosInstance.get("/wards/staff-simple-list");
  console.log(res.data);
  return res.data;
};

export const useGetStaffSimpleList = (): UseQueryResult<GetStaffSimpleListResponse, AxiosError> => {
  return useQuery<GetStaffSimpleListResponse, AxiosError>({
    queryKey: ["staffList"],
    queryFn: getStaffSimpleList,
  });
};
