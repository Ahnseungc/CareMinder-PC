import { CompleteRefetchProps } from "@models/staff";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const useCompleteDischargeByWeb = (refetchProps: CompleteRefetchProps) => {
  const { refetchComplete, refetchCompletedGroup, isPatient } = refetchProps;

  return useMutation({
    mutationFn: (tabletId: number) => {
      return axiosInstance.post("/patients/discharge-by-web", { tabletIds: [tabletId] });
    },
    onSuccess: () => {
      isPatient ? refetchCompletedGroup() : refetchComplete();
    },
  });
};

export default useCompleteDischargeByWeb;
