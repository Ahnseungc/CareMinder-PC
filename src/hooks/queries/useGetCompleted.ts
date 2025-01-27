import { StaffPatientRequest } from "@libraries/axios";
import { RequestsData } from "@models/home";

import { useQuery } from "@tanstack/react-query";

const getCompleted = async (myArea: boolean) => {
  const res = await StaffPatientRequest.getCompleted(myArea);
  return res.data.data;
};

export default function useGetCompleted(myArea: boolean, isGroup: boolean) {
  const { data, refetch } = useQuery<RequestsData[], boolean>({
    queryKey: ["useGetCompleted", myArea],
    queryFn: () => getCompleted(myArea),
    enabled: !isGroup,
  });
  return { data, refetch };
}
