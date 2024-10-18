import { WardPatientRequest } from "@libraries/axios";
import { UserType } from "@models/user";
import { useQuery } from "@tanstack/react-query";

const getWardPatientPending = async () => {
  const res = await WardPatientRequest.getPending();
  return res.data.data;
};

export default function useGetWardPatientPending(type: UserType) {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetWardPatientPending"],
    queryFn: getWardPatientPending,
    enabled: type === "main",
  });
  return { data, isLoading };
}
