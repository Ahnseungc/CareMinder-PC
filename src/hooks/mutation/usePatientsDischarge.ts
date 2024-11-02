import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import axiosInstance from "@utils/axios/axiosInstance";
import { selectedWardType } from "@models/ward-tablet";

const dischargePatients = async (tabletId: selectedWardType): Promise<void> => {
  return (await axiosInstance.post("/patients/discharge-by-web", tabletId)).data;
};

export default function useDischargePatients(): UseMutationResult<
  void,
  AxiosError,
  selectedWardType
> {
  return useMutation({ mutationFn: dischargePatients });
}
