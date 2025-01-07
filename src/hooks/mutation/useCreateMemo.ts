// import { StaffPatientRequest } from "@libraries/axios";
// import { CompleteRefetchProps } from "@models/staff";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export interface createMemoReqest {
  patientId: number;
  content: string;
}

const createMemo = async (memoData: createMemoReqest) => {
  const res = await axiosInstance.post("/memo/patient", memoData);
  return res.data;
};

const useCreateMemo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMemo,
    onSuccess: () => {
      console.log("메모 추가 완료");
      queryClient.invalidateQueries({ queryKey: ["memoList"] });
    },
    onError: err => {
      console.log("메모추가 실패", err);
    },
  });
};

export default useCreateMemo;
