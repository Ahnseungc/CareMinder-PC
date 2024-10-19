import { StaffPatientRequest } from "@libraries/axios";
import { useMutation } from "@tanstack/react-query";

export const useStaffAccept = () => {
  return useMutation({
    mutationFn: (data: number) => {
      return StaffPatientRequest.postAccept(data);
    },
    onSuccess: () => {},
  });
};
