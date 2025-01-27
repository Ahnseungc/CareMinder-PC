import { StaffPatientRequest } from "@libraries/axios";
import { CompleteRefetchProps } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

const useCompleteAccept = (refetchProps: CompleteRefetchProps) => {
  const { refetchComplete, refetchCompletedGroup, isGroup } = refetchProps;
  return useMutation({
    mutationFn: (id: number) => {
      return StaffPatientRequest.postAccept(id);
    },
    onSuccess: () => {
      isGroup ? refetchCompletedGroup() : refetchComplete();
    },
  });
};

export default useCompleteAccept;
