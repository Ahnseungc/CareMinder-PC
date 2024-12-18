import { useEffect, useState } from "react";

export default function useTimer(initialSeconds: number) {
  const [timer, setTimer] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer: number) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const resetTimer = () => {
    setTimer(initialSeconds);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  return { timer, resetTimer, stopTimer };
}
