import { StaffPatientRequest } from "@libraries/axios";
import { PatchRole } from "@libraries/axios/staffPatientRequest";
import { VoidFn } from "@models/staff";
import { useMutation } from "@tanstack/react-query";

const useStaffChangeRole = (pendingRefetch: VoidFn) => {
  return useMutation({
    mutationFn: (data: PatchRole) => {
      return StaffPatientRequest.patchChangeRole(data);
    },
    onSuccess: () => {
      pendingRefetch();
    },
  });
};

export default useStaffChangeRole;
