import { StaffPatientRequest } from "@libraries/axios";
import { RefetchProps } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

const useStaffDecline = (refetchProps: RefetchProps) => {
  const { pendingRefetch, inprogressRefetch, inprogressGroupRefetch, staffAcceptIsGroup } =
    refetchProps;
  return useMutation({
    mutationFn: (id: number) => {
      return StaffPatientRequest.patchDecline(id);
    },
    onSuccess: () => {
      pendingRefetch();
      staffAcceptIsGroup ? inprogressGroupRefetch() : inprogressRefetch();
    },
  });
};

export default useStaffDecline;
