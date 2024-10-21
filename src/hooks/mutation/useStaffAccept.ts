import { StaffPatientRequest } from "@libraries/axios";
import { VoidFn } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

export const useStaffAccept = (
  pendingRefetch: VoidFn,
  inprogressRefetch: VoidFn,
  inprogressGroupRefetch: VoidFn,
  staffAcceptIsGroup: boolean,
) => {
  return useMutation({
    mutationFn: (id: number) => {
      return StaffPatientRequest.postAccept(id);
    },
    onSuccess: () => {
      pendingRefetch();
      staffAcceptIsGroup ? inprogressGroupRefetch() : inprogressRefetch();
    },
  });
};
