import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type StaffList = {
  name: string;
  phoneNumber: string;
  email: string;
  nfc: string;
  fingerprint: string;
  staffRole: string;
};

export type GetStaffListResponse = {
  data: StaffList[];
};

export const getStaffList = async () => {
  const res = await axiosInstance.get("/staffs/list");
  return res.data;
};

export const useGetStaffList = (): UseQueryResult<GetStaffListResponse, AxiosError> => {
  return useQuery<GetStaffListResponse, AxiosError>({
    queryKey: ["staffList"],
    queryFn: getStaffList,
  });
};
