import { StaffPatientRequest } from "@libraries/axios";
import { RefetchProps } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

const useStaffComplete = (refetchProps: RefetchProps) => {
  const { staffAcceptIsGroup, inprogressGroupRefetch, inprogressRefetch } = refetchProps;
  return useMutation({
    mutationFn: (id: number) => {
      return StaffPatientRequest.patchComplete(id);
    },
    onSuccess: () => {
      staffAcceptIsGroup ? inprogressGroupRefetch() : inprogressRefetch();
    },
  });
};

export default useStaffComplete;
