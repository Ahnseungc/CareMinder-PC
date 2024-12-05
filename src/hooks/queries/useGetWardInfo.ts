import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";
import { AxiosError } from "axios";

export type GetWardInfoResponse = {
  id: number;
  admin_id: number;
  wardName: string;
  loginId: string;
  managerName: string;
  managerPhoneNumber: string;
  managerEmail: string;
};

export const getWardInfo = async () => {
  const res = await axiosInstance.get("/wards/info");
  return res.data;
};

const useGetWardInfo = (): UseQueryResult<GetWardInfoResponse, AxiosError> => {
  return useQuery<GetWardInfoResponse, AxiosError>({
    queryKey: ["wardInfo"],
    queryFn: getWardInfo,
  });
};

export default useGetWardInfo;
