import CSwitch from "@components/common/atom/C-Switch";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { ReactComponent as PersonIcon } from "@/assets/completedRequests/person.svg";
import { ReactComponent as HamburgerIcon } from "@/assets/completedRequests/hamburger.svg";
import PatientBox from "@components/common/patientListBox";
import { RequestsData } from "@models/home";
import useGetCompleted from "@hooks/queries/useGetCompleted";
import useGetCompletedGroup from "@hooks/queries/useGetCompletedGroup";
import useCompleteAccept from "@hooks/mutation/useCompleteAccept";
import useCompleteDischargeByWeb from "@hooks/mutation/useCompleteDischargeByWeb";
import { useSetRecoilState } from "recoil";
import { layoutState } from "@libraries/recoil";
import * as S from "../../pages/user/Style/wardAndStaff.style";
import { bottomScroll, roleColor } from "@utils/homePage";
import { LoadChatHistory } from "@components/chat/chattingModel";
import { Message } from "@models/staff";
import ChatBox from "@components/chat/chatBox";

export default function CompletedRequestsPage() {
  const setlayoutState = useSetRecoilState(layoutState);

  const [isPatient, setIsPatient] = useState<boolean>(false);
  const [isFocusPatientData, setIsFocusPatientData] = useState<null | RequestsData>();
  const [myArea, setMyArea] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: getCompleted, refetch: refetchComplete } = useGetCompleted(myArea, isPatient);
  const { data: getCompletedGroup, refetch: refetchCompletedGroup } = useGetCompletedGroup(
    myArea,
    isPatient,
  );
  const refetchProps = {
    refetchComplete,
    refetchCompletedGroup,
    isPatient,
  };
  const { mutate: mutateAccept } = useCompleteAccept(refetchProps);
  const { mutate: mutateDischarge } = useCompleteDischargeByWeb(refetchProps);

  const onMutates = (e: React.MouseEvent, id: number, type: string) => {
    e.stopPropagation();
    if (type === "accept") {
      mutateAccept(id);
    }
    if (type === "discharge") {
      mutateDischarge(id);
    }
    setIsFocusPatientData(null);
  };

  const getHistoryChatting = async () => {
    const history = await LoadChatHistory(isFocusPatientData?.patientRequestId!);
    setMessages(history);
    bottomScroll();
  };

  useEffect(() => {
    setlayoutState("home");
  }, []);

  useEffect(() => {
    if (isFocusPatientData) {
      getHistoryChatting();
    }
  }, [isFocusPatientData]);

  const roleColorPick = roleColor(
    isFocusPatientData === undefined ? "NURSE" : isFocusPatientData!.aiRole,
  );

  return (
    <>
      <S.LeftSection>
        <S.TitleWrapper>
          <S.Title>완료 요청 히스토리</S.Title>
          <S.SearchBoxWrapper>{/* <StaffSearchBox /> */}</S.SearchBoxWrapper>
        </S.TitleWrapper>
        <S.SubTitle>
          <S.SubTitleLeft>
            <div>필터</div>
            <S.FilterBox
              // onClick={() =>
              //   setIsPatient(prev => !prev))
              // }
              isTrue={isPatient}
            >
              환자별
            </S.FilterBox>
            <S.FilterBox isTrue={false}>구역</S.FilterBox>
            <S.FilterBox isTrue={false}>직종</S.FilterBox>
          </S.SubTitleLeft>
        </S.SubTitle>
        {!isPatient &&
          getCompleted?.map(el => (
            <div key={el.patientRequestId} onClick={() => setIsFocusPatientData(el)}>
              <PatientBox
                key={el.patientRequestId}
                user="completedRequest"
                data={el}
                roomId={isFocusPatientData?.patientRequestId}
                onMutates={onMutates}
              />
            </div>
          ))}
        {isPatient && <div>dd</div>}
      </S.LeftSection>

      <S.RightSection>
        <ChatWrapper>
          <ChatContainer id="top" color={roleColorPick.dark}>
            {messages.map((el, idx) => (
              <ChatBox key={idx} data={el} color={roleColorPick.normal} />
            ))}
          </ChatContainer>
          <RestoreWrapper>
            <Restore
              color={roleColorPick.dark}
              onClick={e => onMutates(e, isFocusPatientData!.patientRequestId, "accept")}
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
        </ChatWrapper>
      </S.RightSection>
    </>
  );
}

const ChatWrapper = styled("div")``;

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
const InputWrapper = styled("div")`
  margin-top: 26px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;
const ChatContainer = styled("div")<{ color: string }>`
  background-color: red;
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
const Wrapper = styled("div")`
  min-height: 80vh;
`;
const Container = styled("div")`
  display: flex;
  background-color: red;
`;
const LeftWrapper = styled("div")`
  width: 100%;
  margin-right: 8px;
`;
const RightWrapper = styled("div")`
  width: 100%;
  margin-left: 8px;
  background-color: red;
`;
const Title = styled("div")`
  font-weight: 700;
  font-size: 24px;
  color: #000000;
  margin-bottom: 26px;
`;
const SubTitle = styled("div")`
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  & > * {
    margin-right: 17px;
  }
`;
const Person = styled("div")`
  margin: 33px 0 15px 0;
  display: flex;
  align-items: center;
  & > div {
    font-size: 18px;
    font-weight: 700;
    color: #000000;
    margin: 0 7px 0 17px;
    margin-top: 5px;
  }
`;
const PatientList = styled("div")``;
const Empty = styled("div")`
  margin-top: 81px;
  background-color: red;
`;
