import { SEVER_URL } from "@constants/baseUrl";
import { EventSourcePolyfill } from "event-source-polyfill";
import Cookies from "js-cookie";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";

type MessageType = {
  content: {
    areaName: string;
    patientName: string;
    patientRequestId: number;
    requestContent: string;
  };
  notificationId: string;
  type: string;
};

export default function Alarm() {
  const [message, setMessage] = useState<MessageType | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const userType = JSON.parse(localStorage.getItem("recoil-persist") as string).userState.type;

  const NURSE = {
    dark: "#04B300",
    light: "#EAF8EA",
  };

  useEffect(() => {
    const EventSource = EventSourcePolyfill;

    const eventSource = new EventSource(`${SEVER_URL}/sse/open`, {
      headers: {
        Authorization: `Bearer ${userType === "WARD" ? Cookies.get("accessTokenWard") : Cookies.get("accessTokenStaff")}`,
      },
      withCredentials: true,
      heartbeatTimeout: 86400000,
    });

    eventSource.onopen = () => {};

    eventSource.addEventListener("notification", async (e: any) => {
      const res = await e.data;
      const parsedData = JSON.parse(res);
      setMessage(parsedData);
      setIsOpen(true);

      const slideOutTimer = setTimeout(() => {
        setIsOpen(false);

        const clearNoticeTimer = setTimeout(() => {
          setMessage(undefined);
        }, 500);

        return () => clearTimeout(clearNoticeTimer);
      }, 5000);

      return () => clearTimeout(slideOutTimer);
    });

    eventSource.onerror = function () {
      console.log("에러");
      eventSource.close();
    };
  }, [userType]);

  return (
    <Wrapper isOpen={isOpen}>
      <Title>{message?.content?.requestContent}</Title>
      <Place>
        <Ball color={NURSE.dark}></Ball>
        {message?.content?.areaName} | {message?.content?.patientName}
      </Place>
      <Contents color={NURSE.light}>{message?.content?.requestContent}</Contents>
    </Wrapper>
  );
}
const Wrapper = styled("div")<{ isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  padding: 16px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.palette.secondary.light};
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  animation: ${({ isOpen }) => (isOpen ? "slideInRight" : "slideOutRight")} 1s ease forwards;
`;

const Title = styled("div")`
  font-weight: 600;
  border-bottom: 1px solid rgba(196, 197, 204, 1);
  margin-bottom: 12px;
  padding: 1px 16px;
  overflow: hidden;
  white-space: nowrap;
`;
const Place = styled("div")`
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;
const Contents = styled("div")<{ color: string }>`
  font-weight: 500;
  border-radius: 6px;
  padding: 8px 8px 8px 16px;
  border: 1px solid rgba(236, 236, 236, 1);
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ color }) => color};
`;
const Ball = styled("div")<{ color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${({ color }) => color};
  margin-right: 5px;
  border-radius: 50%;
`;
