import { Stack, styled } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { bottomScroll, roleColor } from "@utils/homePage";
import { ReactComponent as MoreHorizRoundedIcon } from "@/assets/homeIcons/Dot.svg";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";
import { useState } from "react";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { CSwitchProps, MainListBoxProps } from "@models/home";
import { ConnectChat, DisConnect, LoadChatHistory } from "@components/chat/chattingModel";
import ChatInput from "@components/chat/chatInput";
import { isFindRole } from "@utils/homePage";
import useStaffChangeRole from "@hooks/mutation/useStaffChangeRole";
import usePatientDischargeByWeb from "@hooks/mutation/usePatientDischargeByWeb";
import { useStaffDecline } from "@hooks/mutation";
import { Message } from "@models/staff";
import ChatBox from "@components/chat/chatBox";
import getPrevTimes from "@utils/getPrevTimes";
import { OPTIONS } from "@components/settings/const";
import MemoBox from "../MemoBox/MemoBox";

function StaffPatientListBox({
  isAccept,
  data,
  onMutates,
  roomId,
  setRoomId,
  refetchProps,
}: MainListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  const [isOptions, setIsOptions] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isMemo, setIsMemo] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { pendingRefetch } = refetchProps!;

  const { mutate: mutateRole } = useStaffChangeRole(pendingRefetch);

  const { mutate: mutateDischargeByWeb } = usePatientDischargeByWeb(refetchProps!);
  const { mutate: mutateDecline } = useStaffDecline(refetchProps!);
  // const { mutate: mutateReadMs } = useReadMessage(roomId!);

  const onOptionOnOff = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOptions(true);
    if (isOptions || isEdit) {
      setIsEdit(false);
      setIsOptions(false);
    }
  };

  const onOpenChatting = async (id: number) => {
    if (!isAccept) {
      return;
    }

    if (roomId !== id) {
      DisConnect(setRoomId!, roomId);
      ConnectChat(id, setMessages);
      const history = await LoadChatHistory(id);
      setMessages(history);
      setIsMemo(true);
      setRoomId!(id);
      bottomScroll();
    }
    if (roomId === id) {
      DisConnect(setRoomId!, roomId);
      setRoomId!(null);
      setIsMemo(false);
    }
  };

  // const onChangePatientRole = (value: CSwitchProps) => {
  //   mutateRole({
  //     aiRole: isFindRole(value)!,
  //     patientRequestId: data.patientRequestId,
  //   });
  //   setIsEdit(false);
  //   setIsOptions(false);
  // };

  const onCancelAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutateDecline(data.patientRequestId);
  };

  // useEffect(() => {
  //   console.log(messages.length);
  // if (messages.length === 0) return;
  // const filterMessages = messages.filter(el => el.role === "TABLET");
  // if (filterMessages.length === 0) return;
  // const userInfo = filterMessages[filterMessages.length - 1];
  // mutateReadMs(userInfo.messageId);
  // }, [messages]);

  return (
    <InnerContainer
      color={roleColorPick.light}
      onClick={() => onOpenChatting(data.patientRequestId)}
    >
      <LeftLine color={roleColorPick.dark}></LeftLine>
      <Title color={roleColorPick.dark} tabIndex={0} onBlur={() => setIsOptions(false)}>
        <div>
          <div>
            {data.areaSimple.areaName} ({data.tabletSimple.tabletName})
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
              {isAccept ? (
                <Option onClick={el => onCancelAccept(el)}>요청 수락 취소하기</Option>
              ) : (
                <Option
                  onMouseDown={e => {
                    e.stopPropagation(), setIsEdit(true);
                  }}
                >
                  담당직종 변경
                </Option>
              )}
              <Option onMouseDown={() => mutateDischargeByWeb(data.tabletSimple.tabletId)}>
                퇴원 처리하기
              </Option>
            </Options>
          )}
          {isEdit && (
            <Options tabIndex={0}>
              <span>담당직종 변경</span>
              {/* <BoxWrapper>
                <CComboBox
                  placeholder={"직종 선택"}
                  options={["간호사", "의사", "조무사", "직원"]}
                  value={OPTIONS.find(el => el.role === data.aiRole)?.value || "정의되지 않음"}
                  onChange={el => onChangePatientRole(el.target.value)}
                />
              </BoxWrapper> */}
            </Options>
          )}
        </Dot>
        <Check
          color={roleColorPick.dark}
          onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}
        >
          {isAccept ? <CheckIcon /> : <ArrowForwardRoundedIcon style={{ color: "white" }} />}
        </Check>
      </Bottom>
      {isAccept && data.patientRequestId === roomId && (
        <ChatWrapper color={roleColorPick.light}>
          <ChatContainer id="top">
            {messages.map((el, idx) => (
              <ChatBox
                key={idx}
                data={el}
                color={roleColorPick.normal}
                darkColor={roleColorPick.dark}
              />
            ))}
          </ChatContainer>
          <ChatInput
            roomId={roomId}
            Icon={roleColorPick.sendIcon}
            setRoomId={setRoomId!}
            color={roleColorPick.dark}
          />
        </ChatWrapper>
      )}
    </InnerContainer>
  );
}
export default StaffPatientListBox;

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
const ChatContainer = styled("div")`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  width: 100%;
  max-height: 300px;
  overflow: auto;
  border-radius: 12px 12px 0 0;
  margin-bottom: 10px;
  padding: 0 7px;
`;
const Options = styled("div")`
  background-color: ${({ theme }) => theme.palette.primary.contrastText};
  position: absolute;
  right: 0px;
  top: 40px;
  padding: 11px;
  box-shadow: 0px 4px 12px 0px #89898e4d;
  border-radius: 8px;
  & > div:first-of-type {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }
  & > span {
    font-size: 13px;
    font-weight: 700;
    color: ${({ theme }) => theme.palette.primary.dark};
  }
  z-index: 100;
`;
const Option = styled("div")`
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.dark};
  font-weight: 500;
  padding: 8px 0;
  cursor: pointer;
  width: 100%;
  :hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;
const BoxWrapper = styled("div")`
  height: 39px;
  width: 130px;
  margin-top: 8px;
`;
