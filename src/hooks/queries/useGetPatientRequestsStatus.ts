import { PatientRequest } from "@libraries/axios";
import { PatientStatus } from "@models/home";
import { useQuery } from "@tanstack/react-query";

const getPatientRequestsStatus = async (status: PatientStatus) => {
  const res = await PatientRequest.getPatientRequestsStatus(status);
  return res.data.data;
};

export default function useGetPatientRequestsStatus(status: PatientStatus) {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetPatientRequestsStatus", status],
    queryFn: () => getPatientRequestsStatus(status),
  });
  return { data, isLoading };
}
