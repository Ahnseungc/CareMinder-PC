import { FC } from "react";
import { Box, styled, Typography } from "@mui/material";
import { NoticeType } from "@models/notice";
import { formatDate } from "@utils/getDateform";

interface AdminNoticeCardProps {
  notice: NoticeType;
  onChangeSelected: (id: number) => void;
}

const AdminNoticeCard: FC<AdminNoticeCardProps> = ({ notice, onChangeSelected }) => {
  return (
    <StyledBox onClick={() => onChangeSelected(notice.noticeId)}>
      <Title>{notice.title}</Title>
      <StyledBottomBox>
        <StyledNameBox>
          <Name>{notice.staffName}</Name>|<Contact>{notice.staffPhoneNumber}</Contact>
        </StyledNameBox>
        <Contact>{formatDate(new Date(notice.lastModifiedAt))}</Contact>
      </StyledBottomBox>
    </StyledBox>
  );
};

const StyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: "20.5px",
  paddingTop: "20px",
  maxHeight: "92.5px",
  cursor: "pointer",
}));

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

const Name = styled(Typography)(({ theme }) => ({
  lineHeight: "20px",
  fontSize: "13px",
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

const Contact = styled(Typography)(({ theme }) => ({
  lineHeight: "26px",
  fontSize: "13px",
  fontWeight: 400,
  color: theme.palette.text.primary,
}));
const Title = styled(Typography)(({}) => ({
  lineHeight: "24px",
  fontSize: "16px",
  fontWeight: 500,
  color: "black",
  width: "100%",
  maxWidth: "890px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export default AdminNoticeCard;
