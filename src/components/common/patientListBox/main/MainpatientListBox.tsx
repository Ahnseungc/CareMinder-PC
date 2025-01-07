import { Stack, styled } from "@mui/material";
import { roleColor } from "@utils/homePage";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";
import { MainListBoxProps } from "@models/home";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import getPrevTimes from "@utils/getPrevTimes";
import getNewRequest from "@utils/getNewRequest";

function MainPatientListBox({ isAccept, data, onMutates }: MainListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  return (
    <InnerContainer color={roleColorPick.light}>
      <Title color={roleColorPick.dark}>
        {data.areaSimple.areaName} | {data.patientSimple.patientName} (
        {data.tabletSimple.tabletName})
        {isAccept
          ? data.unreadCount !== 0 && <New>new</New>
          : getNewRequest(data.createdAt) && <New>new</New>}
      </Title>
      <Bottom>
        <TxtBox>
          <TxtBoxLeft>{data.content}</TxtBoxLeft>
          <TxtBoxRight>
            <span>{getPrevTimes(data.createdAt)}</span>
          </TxtBoxRight>
        </TxtBox>
        <Check
          color={roleColorPick.dark}
          onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}
        >
          {isAccept ? (
            <CheckIcon style={{ cursor: "pointer" }} />
          ) : (
            <ArrowForwardRoundedIcon style={{ cursor: "pointer", color: "white" }} />
          )}
        </Check>
      </Bottom>
    </InnerContainer>
  );
}
export default MainPatientListBox;

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
  align-items: center;
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
  align-items: center;
  justify-content: space-between;
`;
const TxtBoxLeft = styled("div")``;
const TxtBoxRight = styled("div")`
  color: ${({ theme }) => theme.palette.text.primary};
  min-width: 60px;
  text-align: end;
  display: flex;
  align-items: center;
  text-align: right;
  justify-content: end;
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
const New = styled("div")`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.error.main};
  font-size: 14px;
  font-weight: 700;
  padding: 0 8px;
  border-radius: 8px;
  margin-left: 8px;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;
