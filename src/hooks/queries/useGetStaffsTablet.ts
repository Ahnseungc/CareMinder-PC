import StaffTabletRequest from "@libraries/axios/staffTabletRequest";
import { reqWardParamsType } from "@models/ward-tablet";
import { useQuery } from "@tanstack/react-query";

const getStaffsTabletRequests = async ({ token, patientName, myArea }: reqWardParamsType) => {
  const res = await StaffTabletRequest.getStaffTabletRequests({
    token,
    patientName,
    myArea,
  });
  return res.data.data;
};

export default function useGetWardTabletRequests({
  token,
  patientName,
  myArea,
}: reqWardParamsType) {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetStaffTabletRequests", token, patientName, myArea],
    queryFn: () => getStaffsTabletRequests({ token, patientName, myArea }),
  });
  return { data, isLoading };
}
