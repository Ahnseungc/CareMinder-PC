import { roleColor } from "@utils/homePage";
import { ReactComponent as CheckIcon } from "@/assets/homeIcons/check.svg";
import { MainListBoxProps } from "@models/home";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import getPrevTimes from "@utils/getPrevTimes";
import { ReactComponent as MoreHorizRoundedIcon } from "@/assets/homeIcons/Dot.svg";
import { ReactComponent as VectorIcon } from "@/assets/homeIcons/Dark_Vector.svg";
import * as S from "../Style/listBox.style";

function MainPatientListBox({ isAccept, data, onMutates }: MainListBoxProps) {
  const roleColorPick = roleColor(data.aiRole);

  return (
    <S.InnerContainer color={roleColorPick.light}>
      <S.LeftLine color={roleColorPick.dark}></S.LeftLine>
      <S.Title color={roleColorPick.dark} tabIndex={0}>
        <div>
          <div>
            {data.areaSimple.areaName} ({data.tabletSimple.tabletName})
          </div>
          <span> | </span>
          <div>{data.patientSimple.patientName}</div>
        </div>
        <S.TitleRight
          onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}
        >
          <S.Vector isMemo={false}>
            <VectorIcon />
          </S.Vector>
          메모
        </S.TitleRight>
      </S.Title>
      <S.Bottom>
        <S.TxtBox color={roleColorPick.light}>
          <div>{data.content}</div>
          <S.TxtBoxRight>{getPrevTimes(data.createdAt)}</S.TxtBoxRight>
        </S.TxtBox>
        <S.Dot onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}>
          <MoreHorizRoundedIcon />
        </S.Dot>
        <S.Check
          color={roleColorPick.dark}
          onClick={e => onMutates(e, data.patientRequestId, isAccept ? "accept" : "wait")}
        >
          {isAccept ? <CheckIcon /> : <ArrowForwardRoundedIcon style={{ color: "white" }} />}
        </S.Check>
      </S.Bottom>
    </S.InnerContainer>
  );
}
export default MainPatientListBox;
