import { StaffPatientRequest } from "@libraries/axios";
import { VoidFn } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

const useStaffComplete = (
  pendingRefetch: VoidFn,
  inprogressRefetch: VoidFn,
  inprogressGroupRefetch: VoidFn,
  staffAcceptIsGroup: boolean,
) => {
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
