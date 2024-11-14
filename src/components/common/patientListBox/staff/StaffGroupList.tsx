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

function StaffGroupList({ data, onWaitOrAccept, roomId, setRoomId }: StaffGroupListBoxProps) {
  const roleColorPick = roleColor("NURSE");
  const [messages, setMessages] = useState<Message[]>([]);

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
    <InnerContainer color={roleColorPick.light}>
      <Title color={roleColorPick.dark} tabIndex={0}>
        <div>{data.patientSimple.patientName}</div>
      </Title>
      <BottomWrapper isFullList={isFullList}>
        {data.patientRequests.map((el: patientMapType) => (
          <Bottom color={roleColorPick.dark} isFocus={el.patientRequestId === roomId}>
            <TxtBox onClick={() => onOpenChatting(el.patientRequestId)}>
              <TxtBoxLeft>{el.content}</TxtBoxLeft>
              <TxtBoxRight>{getPrevTimes(el.createdAt)}</TxtBoxRight>
            </TxtBox>
            <Check
              color={roleColorPick.dark}
              onClick={e => onWaitOrAccept(e, el.patientRequestId, "accept")}
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
        <div>
          <ChatContainer id="top">
            {messages.map((el, idx) => (
              <ChatBox key={idx} data={el} color={roleColorPick.normal} />
            ))}
          </ChatContainer>
          <ChatInput roomId={roomId!} Icon={roleColorPick.sendIcon} setRoomId={setRoomId!} />
        </div>
      )}
    </InnerContainer>
  );
}
export default StaffGroupList;

const InnerContainer = styled(Stack)<{ color: string }>`
  border-radius: 12px;
  background-color: ${({ color }) => color};
  width: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const Title = styled("div")<{ color: string }>`
  font-weight: 700;
  font-size: 14px;
  color: ${({ color }) => color};
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  position: relative;
`;
const TxtBox = styled("div")`
  border-radius: 6px;
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
`;
const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
`;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;
const Bottom = styled("div")<{ color: string; isFocus: boolean }>`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 8px;
  & > div {
    background-color: ${({ color, isFocus }) => isFocus && color};
    cursor: pointer;
    color: ${({ isFocus }) => isFocus && "white"};
    & > div {
      color: ${({ isFocus }) => isFocus && "white"};
    }
  }
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
  margin-top: 12px;

  max-height: 300px;
  overflow: auto;
`;
