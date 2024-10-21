import { StaffPatientRequest } from "@libraries/axios";
import { RequestsData, isRoleType } from "@models/home";
import { useQuery } from "@tanstack/react-query";

const getStaffPatientPending = async (aiRole: isRoleType, myArea: boolean) => {
  const res = await StaffPatientRequest.getPending({ aiRole, myArea });
  return res.data.data;
};

export default function useGetStaffPatientPending(aiRole: isRoleType, myArea: boolean) {
  const { data, isLoading, refetch } = useQuery<RequestsData[], boolean>({
    queryKey: ["useGetStaffPatientPending", aiRole, myArea],
    queryFn: () => getStaffPatientPending(aiRole, myArea),
  });
  return { data, isLoading, refetch };
}
