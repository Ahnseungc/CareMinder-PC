import { Box, Input, styled, Typography } from "@mui/material";
import { FC, useState } from "react";
import { ReactComponent as Buger } from "@/assets/buger-icon.svg";
import { ReactComponent as Search } from "@/assets/search-icon-new.svg";
import { ReactComponent as DownArrowMiddle } from "@/assets/downarrow-middle-icon.svg";

type CSearchBoxProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  borderColor?: string;
  select?: any;
  isOpen?: boolean;
};

const CSearchBox: FC<CSearchBoxProps> = ({ select, value, onChange, placeholder, borderColor }) => {
  // @ts-ignore
  const [isOpen, setIsOpen] = useState(false);
  const showList = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <SearchInputWrapper>
      <SearchInput
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disableUnderline={true}
        bordercolor={borderColor}
        select={select}
        startAdornment={
          select && (
            <ListBox>
              <Buger />
              <ListPImageBox>
                <ListP>공지 내용</ListP>
                <DownArrowMiddle onClick={showList} style={{ cursor: "pointer" }} />
              </ListPImageBox>
            </ListBox>
          )
        }
        endAdornment={<Search style={{ cursor: "pointer" }} />}
      />
    </SearchInputWrapper>
  );
};

const SearchInputWrapper = styled(Box)({
  width: "100%",
  position: "relative",
});

const SearchInput = styled(Input, {
  shouldForwardProp: prop => prop !== "isOpen",
})<any>(({ theme, bordercolor }) => ({
  "width": "100%",
  "maxHeight": "44px",
  "borderRadius": "6px",
  "border": `1px solid ${bordercolor ? bordercolor : "theme.palette.divider"}`,
  "transition": "padding 0.3s ease-in-out",
  "padding": "7.9px 15px",
  "backgroundColor": theme.palette.background.paper,
  "& .MuiInputBase-input": {
    color: "black",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#5E5F6599",
  },
}));

const ListBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
  marginRight: "14px",
}));

const ListPImageBox = styled(Box)(({}) => ({
  display: "flex",
  alignItems: "center",
}));

const ListP = styled(Typography)(({}) => ({
  lineHeight: "20px",
  fontSize: "13px",
  fontWeight: 500,
  color: "black",
  width: "71px",
  textAlign: "center",
}));

export default CSearchBox;
