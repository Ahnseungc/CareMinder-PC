import { Box, styled } from "@mui/material";

export const SectionBase = styled(Box)(({ theme }) => ({
  width: "calc(50% - 15px)",
  padding: "30px",
  borderRadius: "24px",
  backgroundColor: theme.palette.background.paper,
  minHeight: "80vh",
}));

export const LeftSection = styled(SectionBase)({
  // 왼쪽 컨테이너에 스타일 적용
});

export const RightSection = styled(SectionBase)({
  // 오른쪽 컨테이너에 스타일 적용
});

export const TitleWrapper = styled("div")`
  margin-bottom: 26px;
  display: flex;
  justify-content: space-between;
`;
export const Title = styled("div")`
  font-weight: 700;
  font-size: 24px;
  color: #000000;
`;
export const SubTitle = styled("div")`
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const SubTitleLeft = styled("div")`
  & > div {
    margin-right: 7px;
    font-size: 14px;
  }
  display: flex;
  align-items: center;
`;
export const FilterBox = styled("div")`
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.palette.action.disabled};
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
`;
export const SearchBoxWrapper = styled("div")`
  position: relative;
`;
