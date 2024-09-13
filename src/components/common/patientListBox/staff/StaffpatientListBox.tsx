import { Stack, styled } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { ChatBox } from "@components/home";
import { PatientListBoxType } from "..";
import { roleColor } from "@utils/homePage";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";

type StaffListBoxProps = {
  isAccept: boolean;
  data: PatientListBoxType;
};

function StaffPatientListBox({ isAccept, data }: StaffListBoxProps) {
  const roleColorPick = roleColor(data.role);

  return (
    <InnerContainer color={roleColorPick.light}>
      <Title color={roleColorPick.dark}>
        <div>{data.place}</div>
        <MoreHorizRoundedIcon sx={{ color: "#C4C5CC" }} />
      </Title>
      <Bottom>
        <TxtBox>
          <TxtBoxLeft>
            {data.isNew && <SmallCheck color={roleColorPick.dark}>N</SmallCheck>}
            {data.request}
          </TxtBoxLeft>
          <TxtBoxRight>{data.time}분전</TxtBoxRight>
        </TxtBox>
        <Check color={roleColorPick.dark}>
          {isAccept ? <CheckIcon /> : <ArrowForwardRoundedIcon />}
        </Check>
      </Bottom>
      {isAccept && (
        <ChatContainer>
          <ChatBox leftorRight="right" />
        </ChatContainer>
      )}
    </InnerContainer>
  );
}
export default StaffPatientListBox;

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
const Bottom = styled("div")`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: space-between;
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
`;
const SmallCheck = styled("div")<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  padding-top: 2px;
  justify-content: center;
  margin-right: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 900;
  margin-bottom: 2px;
`;

const ChatContainer = styled("div")`
  border-top: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  margin-top: 12px;
`;
