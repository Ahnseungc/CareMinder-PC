import { FC, useState } from "react";
import { Box, styled, SvgIcon, Typography } from "@mui/material";
import { ReactComponent as XIcon } from "@assets/x-Icon.svg";
import { ReactComponent as WarningIcon } from "@assets/warning-icon.svg";
import { NoticeType } from "@models/notice";
import { formatDate } from "@utils/getDateform";

interface AdminNoticeCardDeatilProps {
  notice: NoticeType;
  isLoading: boolean;
}

const AdminNoticeCardDeatil: FC<AdminNoticeCardDeatilProps> = ({ notice, isLoading }) => {
  return (
    <StyledBox>
      <NoticeTitleLayout>
        <SvgIcon component={WarningIcon} inheritViewBox />
        <Notice>공지</Notice>
      </NoticeTitleLayout>

      {notice ? (
        <>
          <div style={{ display: "flex", gap: "8px" }}>
            {notice.receivers?.map((receivers, index) => {
              return (
                <RecipientLayout key={index}>
                  <p>{receivers}</p>
                  <SvgIcon component={XIcon} inheritViewBox />
                </RecipientLayout>
              );
            })}
          </div>
          <TitleLayout>
            <Title>{notice?.title}</Title>
            <StyledBottomBox>
              <StyledNameBox>
                <Name>홍길동 간호사</Name>|<Contact>010.0000.0000</Contact>
              </StyledNameBox>
              <Contact>{formatDate(new Date(notice?.lastModifiedAt))}</Contact>
            </StyledBottomBox>
          </TitleLayout>
          <TextArea>{notice?.content}</TextArea>
        </>
      ) : isLoading ? (
        <p>로딩중</p>
      ) : (
        <p>공지를 선택해 주세요.</p>
      )}
    </StyledBox>
  );
};

const StyledBox = styled(Box)({
  width: "50%",
  backgroundColor: "#EFF1F9",
  borderRadius: "24px",
  paddingTop: "34.5px",
  paddingLeft: "24px",
  paddingRight: "24px",
  height: "100%",
  minHeight: "648px",
});

const StyledNameBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});
const StyledBottomBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "8px",
});

const TextArea = styled(Box)({
  color: "black",
  fontSize: "14px",
  lineHeight: "24px",
  fontWeight: "400",
});

const Name = styled(Typography)(({ theme }) => ({
  lineHeight: "20px",
  fontSize: "13px",
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

const Notice = styled(Typography)(({ theme }) => ({
  lineHeight: "20px",
  fontSize: "13px",
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

const Contact = styled(Typography)(({ theme }) => ({
  lineHeight: "26px",
  fontSize: "13px",
  fontWeight: 400,
  color: theme.palette.text.primary,
}));

const RecipientLayout = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const Title = styled(Typography)(({}) => ({
  lineHeight: "26px",
  fontSize: "20px",
  fontWeight: 500,
  color: "black",
}));

const NoticeTitleLayout = styled(Box)({
  display: "flex",
  gap: "4px",
  alignItems: "center",
});

const TitleLayout = styled(Box)({
  paddingBottom: "16px",
  borderBottom: "1px solid #FFFFFF",
});

export default AdminNoticeCardDeatil;
