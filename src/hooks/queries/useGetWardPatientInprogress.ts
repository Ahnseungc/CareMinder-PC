import { WardPatientRequest } from "@libraries/axios";
import { UserType } from "@models/user";
import { useQuery } from "@tanstack/react-query";

const getWardPatientInProgress = async () => {
  const res = await WardPatientRequest.getInProgress();
  return res.data.data;
};

export default function useGetWardPatientInProgress(type: UserType) {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetWardPatientInProgress"],
    queryFn: getWardPatientInProgress,
    enabled: type === "main",
  });
  return { data, isLoading };
}
