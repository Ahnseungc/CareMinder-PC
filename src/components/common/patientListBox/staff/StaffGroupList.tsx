import { Stack, styled } from "@mui/material";
import { bottomScroll, roleColor } from "@utils/homePage";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";
import { useState } from "react";
import { ConnectChat, DisConnect, LoadChatHistory } from "@components/chat/chattingModel";
import { Message, patientMapType } from "@models/staff";
import ChatBox from "@components/chat/chatBox";
import ChatInput from "@components/chat/chatInput";
import getPrevTimes from "@utils/getPrevTimes";
import { StaffGroupListBoxProps } from "@models/index";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";
import MemoBox from "../MemoBox/MemoBox";

function StaffGroupList({ data, onMutates, roomId, setRoomId }: StaffGroupListBoxProps) {
  const roleColorPick = roleColor(data.patientRequests[0].aiRole);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMemo, setIsMemo] = useState<boolean>(false);

  const onOpenChatting = async (id: number) => {
    if (roomId !== id) {
      DisConnect(setRoomId!, roomId);
      ConnectChat(id, setMessages);
      const history = await LoadChatHistory(id);
      setMessages(history);
      setRoomId!(id);
      bottomScroll();
    }
    if (roomId === id) {
      DisConnect(setRoomId!, roomId);
      setRoomId!(null);
    }
  };

  const [isFullList, setIsFullList] = useState(false);

  return (
    <InnerContainer>
      <Title color={roleColorPick.dark} tabIndex={0}>
        <div>
          <div>{data.patientRequests[0].areaSimple.areaName}</div>
          <span> | </span>
          <div>{data.patientSimple.patientName}</div>
        </div>
        <TitleRight
          onClick={e => {
            e.stopPropagation(), setIsMemo(prev => !prev);
          }}
        >
          <Vector isMemo={isMemo}>
            <VectorIcon />
          </Vector>
          메모
        </TitleRight>
      </Title>
      {isMemo && <MemoBox color={roleColorPick.light} />}

      <BottomWrapper isFullList={isFullList}>
        {data.patientRequests.map((el: patientMapType) => (
          <Bottom color={roleColorPick.dark}>
            <LeftLine color={roleColorPick.dark}></LeftLine>

            <TxtBox
              onClick={() => onOpenChatting(el.patientRequestId)}
              color={roleColorPick.dark}
              isFocus={el.patientRequestId === roomId}
              light={roleColorPick.light}
            >
              <TxtBoxLeft>{el.content}</TxtBoxLeft>
              <TxtBoxRight>{getPrevTimes(el.createdAt)}</TxtBoxRight>
            </TxtBox>
            <Check
              color={roleColorPick.dark}
              onClick={e => onMutates(e, el.patientRequestId, "accept")}
            >
              <CheckIcon />
            </Check>
          </Bottom>
        ))}
      </BottomWrapper>
      <IsTotalList onClick={() => setIsFullList(prev => !prev)}>
        {isFullList ? "닫기" : "요청 전체 보기"}
      </IsTotalList>
      {data.patientRequests.find((e: patientMapType) => e.patientRequestId === roomId) && (
        <ChatWrapper color={roleColorPick.light}>
          <ChatContainer id="top">
            {messages.map((el, idx) => (
              <ChatBox key={idx} data={el} color={roleColorPick.normal} />
            ))}
          </ChatContainer>
          <ChatInput
            roomId={roomId!}
            Icon={roleColorPick.sendIcon}
            setRoomId={setRoomId!}
            color={roleColorPick.normal}
          />
        </ChatWrapper>
      )}
    </InnerContainer>
  );
}
export default StaffGroupList;

const InnerContainer = styled(Stack)`
  border-radius: 12px;
  width: 100%;
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const Vector = styled("div")<{ isMemo: boolean }>`
  transform: ${({ isMemo }) => isMemo && "rotate(-90deg)"};
  margin-right: 8px;
`;
const Title = styled("div")<{ color: string }>`
  font-weight: 700;
  font-size: 16px;
  color: #000000;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  margin-right: 30px;
  & > div {
    display: flex;
  }
  & > div > span {
    margin: 0 5px;
  }
`;
const TitleRight = styled("div")`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
`;
const TxtBox = styled("div")<{ color: string; isFocus: boolean; light: string }>`
  border-radius: 6px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
  background-color: ${({ color, isFocus }) => isFocus && color};
  cursor: pointer;
  color: ${({ isFocus }) => isFocus && "white"};
  border: 3px solid ${({ light }) => light};
  & > div {
    color: ${({ isFocus }) => isFocus && "white"};
  }
`;
const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
  margin-left: 3px;
`;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;
const Bottom = styled("div")<{ color: string }>`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 8px;
  position: relative;
  :hover {
    & > div {
      background-color: ${({ color }) => color};
      cursor: pointer;
      color: white;
      & > div {
        color: white;
      }
    }
  }
`;
const Check = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 3px;
`;
const BottomWrapper = styled("div")<{ isFullList: boolean }>`
  max-height: ${({ isFullList }) => !isFullList && "135px"};
  overflow: auto;
`;
const IsTotalList = styled("div")`
  color: #878787;
  font-size: 12px;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
`;
const ChatContainer = styled("div")`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  width: 100%;
  max-height: 300px;
  overflow: auto;
  border-radius: 12px 12px 0 0;
  margin-bottom: 10px;
  padding: 0 7px;
`;
const LeftLine = styled("div")<{ color: string }>`
  width: 4px;
  height: 60%;
  bottom: 7px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 10px;
`;
const ChatWrapper = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  margin-top: 8px;
  border-radius: 12px;
`;
