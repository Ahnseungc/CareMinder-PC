import StaffTabletRequest from "@libraries/axios/staffTabletRequest";
import { reqWardParamsType } from "@models/ward-tablet";
import { useQuery } from "@tanstack/react-query";

const getStaffsTabletRequests = async ({ token, searchValue, myArea }: reqWardParamsType) => {
  const res = await StaffTabletRequest.getStaffTabletRequests({
    token,
    searchValue,
    myArea,
  });
  return res.data.data;
};

export default function useGetWardTabletRequests({
  token,
  searchValue,
  myArea,
}: reqWardParamsType) {
  const { data, isLoading } = useQuery({
    queryKey: ["useGetStaffTabletRequests", token, searchValue, myArea],
    queryFn: () => getStaffsTabletRequests({ token, searchValue, myArea }),
  });
  return { data, isLoading };
}
