import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@utils/axios/axiosInstance";

export type SleepModeType = "FULL_ACCESS" | "REQUEST_ONLY" | "FORCE_TERMINATE";

export type SleepModeData = {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  type: SleepModeType;
};
const applySleepMode = async (sleepModeData: SleepModeData) => {
  const res = await axiosInstance.post("/sleepMode/ward", sleepModeData);
  return res.data;
};

export default function usePostSleepMode() {
  return useMutation({
    mutationFn: applySleepMode,
    onSuccess: () => {
      console.log("수면 모드 설정 성공");
    },
    onError: error => {
      console.error("수면 모드 설정 중 오류가 발생했습니다", error);
    },
  });
}
