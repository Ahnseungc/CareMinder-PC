import StaffTabletRequest from "@libraries/axios/staffTabletRequest";

import { FilterData } from "@pages/staff/StaffWardInoutManagementPage";
import { useMutation } from "@tanstack/react-query";

export default function useGetMenagePatientList() {
  return useMutation({
    mutationFn: ({ page, object }: { page: number; object: FilterData }) =>
      StaffTabletRequest.getMenagePatient({ page, object }),
  });
}
