import { FC } from "react";
import { Button, ButtonProps, styled } from "@mui/material";

export type CustomButtonProps = {
  buttontype:
    | "primary"
    | "primarySpaure"
    | "primarySpaureWhite"
    | "login"
    | "primaryWhite"
    | "primaryBlack"
    | "primarySpaureLong"
    | "impactRed";
} & ButtonProps;

const CButton: FC<CustomButtonProps> = ({ children, buttontype, ...props }) => {
  return (
    <StyledButton buttontype={buttontype} {...props}>
      {children}
    </StyledButton>
  );
};

export default CButton;

/** styled */
const StyledButton = styled(Button)<CustomButtonProps>(({ buttontype, theme }) => ({
  ...(buttontype === "primary" && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: "100px",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "700",
    width: "100%",
  }),
  ...(buttontype === "primaryWhite" && {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.dark,
    borderRadius: "100px",
    fontSize: "16px",
    lineHeight: "24px",
    fontWeight: "700",
    border: "1px solid #ECECEC",
    width: "100%",
  }),
  ...(buttontype === "primarySpaure" && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "100%",
  }),
  ...(buttontype === "primarySpaureLong" && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "338px",
  }),
  ...(buttontype === "primarySpaureWhite" && {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    width: "100%",
  }),
  ...(buttontype === "primaryBlack" && {
    backgroundColor: theme.palette.primary.contrastText,
    color: "black",
    border: `1px solid #8C8E94`,
    width: "100%",
    height: "100%",
    borderRadius: "100px",
    fontSize: "14px",
  }),
  ...(buttontype === "login" && {
    "backgroundImage": "linear-gradient(#5D6DBE,#607AFF)",
    "color": theme.palette.primary.contrastText,
    "border": `1px solid ${theme.palette.primary.main}`,
    "borderRadius": "141.95px",
    "fontSize": "28px",
    "lineHeight": "42px",
    "fontWeight": "700",
    "width": "329.33px",
    "height": "70.98px",
    "&:disabled": {
      backgroundImage: "none",
      backgroundColor: theme.palette.action.disabled,
      color: theme.palette.primary.contrastText,
      border: "none",
    },
  }),
  ...(buttontype === "impactRed" && {
    "backgroundColor": "#FF5353",
    "color": theme.palette.primary.contrastText,
    "borderRadius": "100px",
    "fontSize": "14px",
    "lineHeight": "24px",
    "fontWeight": "500",
    "width": "141px",
    "height": "32px",
    "&:disabled": {
      backgroundImage: "none",
      backgroundColor: theme.palette.action.disabled,
      color: theme.palette.primary.contrastText,
      border: "none",
    },
    "&:hover": {
      backgroundColor: "#fffff",
      border: "1px solid #FF5353",
      color: "#FF5353",
    },
  }),
}));

/* 
EX)
<CButton buttonType="primary">파란색 원형 기본</CButton>
<CButton buttonType="primaryWhite">하얀색 원형 기본</CButton>
<CButton buttonType="primarySpaure">파란색 사각</CButton>
<CButton buttonType="primarySpaureWhite">하얀색 사각</CButton>
<CButton buttonType="primarySpaureLong">파란색 긴 사각</CButton>
<CButton buttonType="login">로그인</CButton>

\*/
