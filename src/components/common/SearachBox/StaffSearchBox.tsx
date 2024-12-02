import { Box, Input, styled } from "@mui/material";
import { useRef, useState } from "react";
import { SearchInputProps } from "@models/search";
import { ReactComponent as Search } from "@/assets/homeIcons/Search.svg";
import { ReactComponent as DownArrow } from "@/assets/serachIcons/DownArrow.svg";

export default function StaffSearchBox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const toggleList = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <SearchInputWrapper>
        <SearchInput
          ref={inputRef}
          type="search"
          value={""}
          onChange={searchHandler}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsOpen(false);
            }, 200);
          }}
          placeholder="환자 검색하기"
          disableUnderline={true}
          startAdornment={
            <ListBox onClick={toggleList}>
              <Search style={{ marginBottom: "2px" }} />
            </ListBox>
          }
          endAdornment={<DownArrow />}
          isOpen={isOpen}
        />
        {isOpen && (
          <StaffList>
            <NoSearchStaff>검색 결과 없음</NoSearchStaff>
          </StaffList>
        )}
      </SearchInputWrapper>
    </>
  );
}

const SearchInputWrapper = styled(Box)({
  position: "absolute",
  right: "-20px",
  top: "-4px",
});

const SearchInput = styled(Input, {
  shouldForwardProp: prop => prop !== "isOpen",
})<SearchInputProps>(({ theme, isOpen }) => ({
  position: "relative",
  width: "200px",
  minHeight: "36px",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "6px",
  padding: isOpen ? "7.9px 15px 178px 15px" : "7.9px 15px",
  transition: "padding 0.3s ease-in-out",
  backgroundColor: theme.palette.background.paper,
}));

const ListBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  marginRight: "10px",
}));

const StaffList = styled(Box)(({ theme }) => ({
  "display": "flex",
  "flexDirection": "column",
  "gap": "10px",
  "position": "absolute",
  "top": "40px",
  "width": "320px",
  "maxHeight": "160px",
  "marginLeft": "36px",
  "overflowY": "auto",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.light,
  },
  "opacity": 0,
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "animation": "fadeIn 0.6s ease-in-out forwards",
}));

const NoSearchStaff = styled(Box)({
  width: "86px",
  height: "20px",
});
