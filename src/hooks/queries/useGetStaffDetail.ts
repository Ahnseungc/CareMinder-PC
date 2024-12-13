import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";
import { StaffListType } from "./useGetStaffList";

export type StaffDetailResp = Omit<StaffListType, "timeSinceLogout" | "accountLocked" | "isLogIn">;

export const getStaffDetail = async (userId: number) => {
  const res = await axiosInstance.post("/wards/staff-info", {
    userId: userId,
  });
  return res.data;
};

export default function useGetStaffDetail(): UseMutationResult<
  StaffDetailResp,
  AxiosError,
  number
> {
  return useMutation({ mutationFn: getStaffDetail });
}
