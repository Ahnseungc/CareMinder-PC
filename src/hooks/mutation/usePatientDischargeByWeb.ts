import { RefetchProps } from "@models/staff";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

const usePatientDischargeByWeb = (refetchProps: RefetchProps) => {
  const { pendingRefetch, inprogressRefetch, inprogressGroupRefetch, staffAcceptIsGroup } =
    refetchProps;

  return useMutation({
    mutationFn: (tabletId: number) => {
      return axiosInstance.post("/patients/discharge-by-web", { tabletIds: [tabletId] });
    },
    onSuccess: () => {
      pendingRefetch();
      staffAcceptIsGroup ? inprogressGroupRefetch() : inprogressRefetch();
    },
  });
};

export default usePatientDischargeByWeb;
