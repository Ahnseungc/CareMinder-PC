import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "@components/fcm/initFirebase";

type MessageType = {
  content: {
    areaName: string;
    patientName: string;
    patientRequestId: number;
    requestTitle?: string;
    message?: string;
    requestContent?: string;
  };
  notificationId: string;
  type: string;
};
export default function Alarm() {
  const [message, setMessage] = useState<MessageType | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  const NURSE = {
    dark: "#04B300",
    light: "#EAF8EA",
  };

  useEffect(() => {
    onMessage(messaging, payload => {
      setMessage(JSON.parse(payload!.data!.data));
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
  }, []);

  if (isOpen === undefined) return <></>;
  // if (isOpen === false) return <></>;

  if (message?.content.message)
    return (
      <Wrapper isOpen={isOpen!} onClick={() => setIsOpen(false)}>
        <Title>{message?.content?.requestTitle}</Title>
        <Place>
          <Ball color={NURSE.dark}></Ball>
          {message?.content?.areaName} | {message?.content?.patientName}
        </Place>
        <Contents color={NURSE.light}>{message?.content?.message}</Contents>
      </Wrapper>
    );

  if (!message?.content.message)
    return (
      <Wrapper isOpen={isOpen!} onClick={() => setIsOpen(false)}>
        <Title>
          <Place>
            <Ball color={NURSE.dark}></Ball>
            {message?.content?.areaName} | {message?.content?.patientName}
          </Place>
        </Title>
        <ContentsWhite>{message?.content?.requestContent}</ContentsWhite>
      </Wrapper>
    );

  return <></>;
}
const Wrapper = styled("div")<{ isOpen: boolean }>`
  cursor: pointer;
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
  font-weight: 700;
  border-bottom: 1px solid rgba(196, 197, 204, 1);
  margin-bottom: 12px;
  padding: 1px 10px 3px 10px;
  overflow: hidden;
  white-space: nowrap;
`;
const Place = styled("div")`
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-size: 16px;
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
  min-width: 200px;
`;
const ContentsWhite = styled("div")`
  font-weight: 600;
  padding: 8px 8px 8px 16px;
  height: 100%;
  min-width: 200px;
`;

const Ball = styled("div")<{ color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${({ color }) => color};
  margin-right: 5px;
  border-radius: 50%;
`;
