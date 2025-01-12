import { Stack, styled } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { bottomScroll, roleColor } from "@utils/homePage";
import { useEffect, useState } from "react";
import { StaffListBoxProps } from "@models/home";
import getPrevTimes from "@utils/getPrevTimes";
import ChatBox from "@components/chat/chatBox";
import { LoadChatHistory } from "@components/chat/chattingModel";
import { Message } from "@models/staff";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";
import MemoBox from "../MemoBox/MemoBox";

function CompletedPatientListBox({ isAccept, data, onMutates, roomId }: StaffListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  const [isOptions, setIsOptions] = useState(false);
  const [isMemo, setIsMemo] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const onOptionOnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOptions) {
      setIsOptions(false);
    } else if (!isOptions) {
      setIsOptions(true);
    }
  };

  const getHistoryChatting = async () => {
    const history = await LoadChatHistory(data.patientRequestId);
    setMessages(history);
    bottomScroll();
  };

  useEffect(() => {
    if (isAccept) {
      getHistoryChatting();
    }
  }, [data]);

  return (
    <InnerContainer color={roleColorPick.light}>
      <LeftLine color={roleColorPick.dark}></LeftLine>
      <Title color={roleColorPick.dark} tabIndex={0} onBlur={() => setIsOptions(false)}>
        <div>
          <div>
            {data.areaSimple?.areaName} ({data.tabletSimple?.tabletName})
          </div>
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
      {isMemo && <MemoBox color={roleColorPick.light} patientId={data.patientSimple.patientId} />}

      <Bottom>
        <TxtBox color={roleColorPick.light}>
          <TxtBoxLeft>{data.content}</TxtBoxLeft>
          <TxtBoxRight>{getPrevTimes(data.createdAt)}</TxtBoxRight>
        </TxtBox>
        <Dot onClick={onOptionOnOff}>
          <MoreHorizRoundedIcon />
          {isOptions && (
            <Options>
              <Option onClick={e => onMutates(e, data.patientRequestId, "accept")}>복원하기</Option>

              <Option onClick={e => onMutates(e, data.tabletSimple.tabletId, "discharge")}>
                퇴원 처리하기
              </Option>
            </Options>
          )}
        </Dot>
      </Bottom>

      {isAccept && (
        <div>
          <ChatContainer id="top" color={roleColorPick.dark}>
            {messages.map((el, idx) => (
              <ChatBox key={idx} data={el} color={roleColorPick.normal} />
            ))}
          </ChatContainer>
          <RestoreWrapper>
            <Restore
              color={roleColorPick.dark}
              onClick={e => onMutates(e, data.patientRequestId, "accept")}
            >
              요청 복원하기
            </Restore>
          </RestoreWrapper>
          <InputWrapper>
            <Input
              type="text"
              placeholder="현재는 메세지를 입력할 수 없습니다 / 이미 처리 완료된 채팅입니다."
              disabled={true}
            />
            <SendButton></SendButton>
          </InputWrapper>
        </div>
      )}
    </InnerContainer>
  );
}
export default CompletedPatientListBox;

const InnerContainer = styled(Stack)<{ color: string }>`
  position: relative;
  width: 100%;
  padding: 0 13px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;
const LeftLine = styled("div")<{ color: string }>`
  width: 4px;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 0;
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
const TxtBox = styled("div")<{ color: string }>`
  border-radius: 6px;
  width: 100%;
  border: 3px solid ${({ color }) => color};
  padding: 6px 16px 6px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.palette.primary.dark};
  display: flex;
  justify-content: space-between;
`;
const TxtBoxLeft = styled("div")`
  display: flex;
  align-items: center;
`;
const Vector = styled("div")<{ isMemo: boolean }>`
  transform: ${({ isMemo }) => isMemo && "rotate(-90deg)"};
  margin-right: 8px;
`;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
`;
const Bottom = styled("div")`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  position: relative;
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

const Dot = styled("div")`
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  margin-left: 6px;
  align-items: center;
  justify-content: center;
`;
const ChatWrapper = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  margin-top: 8px;
  border-radius: 12px;
`;

const ChatContainer = styled("div")<{ color: string }>`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  margin-top: 12px;
  max-height: 400px;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ color }) => color};
    border-radius: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(220, 20, 60, 0.1);
  }
`;
const Options = styled("div")`
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  position: absolute;
  top: 20px;
  right: 0px;
  padding: 11px;
  box-shadow: 0px 4px 12px 0px #89898e4d;
  border-radius: 8px;
  & > div:first-of-type {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }
  & > span {
    font-size: 14px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.primary.dark};
  }
`;
const Option = styled("div")`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.dark};
  font-weight: 500;
  padding: 8px 0;
  cursor: pointer;
  width: 69px;
  :hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

const InputWrapper = styled("div")`
  margin-top: 26px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;
const Input = styled("input")`
  width: 100%;
  border: none;
  padding: 10px;
  border-radius: 10px 0 0 10px;
  background-color: transparent;
`;
const SendButton = styled("div")`
  padding: 4px 10px 0 10px;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
`;
const Restore = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  text-align: center;
  padding: 6px 0;
  border-radius: 6px;
  width: 98px;
  font-weight: 600;
`;
const RestoreWrapper = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 26px;
`;
