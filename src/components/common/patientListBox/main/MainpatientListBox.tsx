import { Stack, styled } from "@mui/material";
import { roleColor } from "@utils/homePage";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";
import { MainListBoxProps } from "@models/home";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import getPrevTimes from "@utils/getPrevTimes";
import { ReactComponent as MoreHorizRoundedIcon } from "@/assets/homeIcons/Dot.svg";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";

function MainPatientListBox({ isAccept, data, onMutates }: MainListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  return (
    <InnerContainer color={roleColorPick.light}>
      <LeftLine color={roleColorPick.dark}></LeftLine>
      <Title color={roleColorPick.dark} tabIndex={0}>
        <div>
          <div>
            {data.areaSimple.areaName} ({data.tabletSimple.tabletName})
          </div>
          <span> | </span>
          <div>{data.patientSimple.patientName}</div>
        </div>
        <TitleRight
          onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}
        >
          <Vector isMemo={false}>
            <VectorIcon />
          </Vector>
          메모
        </TitleRight>
      </Title>
      <Bottom>
        <TxtBox color={roleColorPick.light}>
          <TxtBoxLeft>{data.content}</TxtBoxLeft>
          <TxtBoxRight>{getPrevTimes(data.createdAt)}</TxtBoxRight>
        </TxtBox>
        <Dot onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}>
          <MoreHorizRoundedIcon />
        </Dot>
        <Check
          color={roleColorPick.dark}
          onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}
        >
          {isAccept ? <CheckIcon /> : <ArrowForwardRoundedIcon style={{ color: "white" }} />}
        </Check>
      </Bottom>
    </InnerContainer>
  );
}
export default MainPatientListBox;

const InnerContainer = styled(Stack)<{ color: string }>`
  position: relative;
  width: 100%;
  padding: 0 13px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
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
const TxtBox = styled("div")`
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
const TitleRight = styled("div")`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.primary};
  cursor: pointer;
`;
const TxtBoxLeft = styled("div")``;
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
const Vector = styled("div")<{ isMemo: boolean }>`
  transform: ${({ isMemo }) => isMemo && "rotate(-90deg)"};
  margin-right: 8px;
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
const LeftLine = styled("div")<{ color: string }>`
  width: 4px;
  height: 100%;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  position: absolute;
  left: 0;
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
