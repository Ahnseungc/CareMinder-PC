import { StaffPatientRequest } from "@libraries/axios";
import { useQuery } from "@tanstack/react-query";

const getCompletedGroup = async (myArea: boolean) => {
  const res = await StaffPatientRequest.getCompletedGroup(myArea);
  return res.data.data;
};

export default function useGetCompletedGroup(myArea: boolean, isGroup: boolean) {
  const { data, refetch } = useQuery<any[], boolean>({
    queryKey: ["useGetCompletedGroup", myArea, isGroup],
    queryFn: () => getCompletedGroup(myArea),
    enabled: isGroup,
  });
  return { data, refetch };
}
