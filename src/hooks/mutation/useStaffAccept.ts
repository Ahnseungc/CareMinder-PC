import { StaffPatientRequest } from "@libraries/axios";
import { RefetchProps } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

const useStaffAccept = (refetchProps: RefetchProps) => {
  const { pendingRefetch, staffAcceptIsGroup, inprogressGroupRefetch, inprogressRefetch } =
    refetchProps;
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

export default useStaffAccept;
