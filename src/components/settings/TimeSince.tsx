import { formatTimeSince } from "@utils/formatTimeSince";
import { useMemo } from "react";

interface TimeSinceProps {
  time: string;
}

export const TimeSince = ({ time }: TimeSinceProps) => {
  const formattedTime = useMemo(() => formatTimeSince(time), [time]);

  return <span>{formattedTime}</span>;
};
