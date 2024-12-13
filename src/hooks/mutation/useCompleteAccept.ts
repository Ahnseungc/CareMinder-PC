import { StaffPatientRequest } from "@libraries/axios";
import { CompleteRefetchProps } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

const useCompleteAccept = (refetchProps: CompleteRefetchProps) => {
  const { refetchComplete, refetchCompletedGroup, isPatient } = refetchProps;
  return useMutation({
    mutationFn: (id: number) => {
      return StaffPatientRequest.postAccept(id);
    },
    onSuccess: () => {
      isPatient ? refetchCompletedGroup() : refetchComplete();
    },
  });
};

export default useCompleteAccept;
