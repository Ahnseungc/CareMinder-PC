import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@utils/axios/axiosInstance";

const dischargePatients = async (tabletId: number): Promise<void> => {
  return (await axiosInstance.post("/patients/discharge-by-web", tabletId)).data;
};

export default function useDischargePatients(): UseMutationResult<void, AxiosError, number> {
  return useMutation({ mutationFn: dischargePatients });
}
