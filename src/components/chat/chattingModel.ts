import { SW_SEVER_URL } from "@constants/baseUrl";
import { Message } from "@models/staff";
import { Client, IMessage } from "@stomp/stompjs";
import axiosInstance from "@utils/axios/axiosInstance";
import { bottomScroll } from "@utils/homePage";
import Cookies from "js-cookie";

let Clients: any = null;

export const LoadChatHistory = async (roomId: number) => {
  try {
    const res = await axiosInstance.get("/chat-history/" + roomId);
    return res.data.data;
  } catch (err) {
    console.error("채팅 기록을 찾을수 없습니다.");
  }
};

export const ConnectChat = (
  roomId: number,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
) => {
  const token = Cookies.get("accessTokenStaff");

  Clients = new Client({
    brokerURL: SW_SEVER_URL,
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 5000, // 자동 재 연결
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });
  Clients.onConnect = function () {
    Clients.subscribe("/sub/patient/" + roomId, callback);
  };
  const callback = function (message: IMessage) {
    if (message.body) {
      let msg = JSON.parse(message.body);
      setMessages(prevMessages => [...prevMessages, msg]);
      bottomScroll();
    }
  };

  Clients.activate();
};

export const DisConnect = (
  setRoomId: React.Dispatch<React.SetStateAction<null | number>>,
  roomId?: number | null,
) => {
  if (roomId === null) return;
  try {
    Clients.deactivate();
  } catch (err) {
    setRoomId(null);
  }
};

export const SendChat = (
  chat: string,
  setChat: React.Dispatch<React.SetStateAction<string>>,
  roomId: number,
  setRoomId: React.Dispatch<React.SetStateAction<number | null>>,
) => {
  if (chat === "") return;
  const token = Cookies.get("accessTokenStaff");

  try {
    Clients.publish({
      destination: "/pub/patient/" + roomId,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: chat }),
    });

    setChat("");
  } catch (err) {
    setRoomId(null);
  }
};
