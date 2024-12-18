import useSignOut from "@hooks/mutation/useSignout";
import { userState } from "@libraries/recoil";
import { UserType } from "@models/user";
import { useEffect, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { useRecoilValue } from "recoil";

interface UseAutoLogoutProps {
  timeout?: number;
  message?: string;
}

export const useAutoLogout = ({
  timeout = 1000 * 60 * 30 /** 30분 */,
  message = "장시간 반응이 없어 로그아웃 되었습니다.",
}: UseAutoLogoutProps = {}) => {
  const [remaining, setRemaining] = useState<number | null>(null);
  const userType = useRecoilValue(userState)?.type;
  const { mutate: signOut } = useSignOut(userType as UserType);

  const { getRemainingTime } = useIdleTimer({
    timeout,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
      "focus",
    ],
    throttle: 500,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingTime());
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (remaining === 0) {
      alert(message);
      signOut();
    }
  }, [remaining, signOut, message]);

  return { remaining };
};
