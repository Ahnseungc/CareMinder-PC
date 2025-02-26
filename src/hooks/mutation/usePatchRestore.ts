import { useMutation } from "@tanstack/react-query";
import { StaffPatientRequest } from "@libraries/axios";
import { CompleteRefetchProps } from "@models/staff";

const patchRestore = async (patientRequestId: number) => {
  const res = await StaffPatientRequest.patchCompletedRestore(patientRequestId);
  return res.data;
};

export default function usePatchRestore(refetchProps: CompleteRefetchProps) {
  const { refetchComplete, refetchCompletedGroup, isPatient } = refetchProps;
  return useMutation({
    mutationFn: patchRestore,
    onSuccess: () => {
      isPatient ? refetchCompletedGroup() : refetchComplete();
    },
    onError: error => {
      console.error(error);
    },
  });
}
