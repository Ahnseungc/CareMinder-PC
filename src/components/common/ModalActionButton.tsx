import { Button, ButtonProps, styled } from "@mui/material";

type ModalActionButtonProps = {
  color?: "primary" | "secondary" | "success" | "info" | "secondarySm";
  hoverColor?: string;
} & Omit<ButtonProps, "color">;

const ModalActionButton = styled((props: ButtonProps) => <Button variant="outlined" {...props} />, {
  shouldForwardProp: prop => prop !== "variant" && prop !== "hoverColor",
})<ModalActionButtonProps>(({ color = "primary", theme, hoverColor }) => ({
  borderRadius: "100px",
  minWidth: "108px",
  padding: "6px 16px",
  height: "36px",
  fontSize: "16px",
  fontWeight: 800,
  lineHeight: "24px",
  ...(color === "primary" && {
    "backgroundColor": theme.palette.primary.main,
    "color": theme.palette.primary.contrastText,
    "border": "none",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      border: "none",
    },
    "&:disabled": {
      backgroundColor: theme.palette.primary.light,
      border: "none",
      color: theme.palette.primary.contrastText,
    },
  }),
  ...(color === "secondary" && {
    "color": theme.palette.text.primary,
    "borderColor": theme.palette.divider,
    "backgroundColor": theme.palette.primary.contrastText,
    "&:hover": {
      borderColor: theme.palette.divider,
      backgroundColor: hoverColor || theme.palette.primary.light,
    },
  }),
  ...(color === "success" && {
    "color": theme.palette.secondary.contrastText,
    "borderColor": theme.palette.divider,
    "backgroundColor": theme.palette.secondary.main,
    "&:hover": {
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.primary.light,
    },
  }),
  ...(color === "info" && {
    "color": theme.palette.secondary.contrastText,
    "borderColor": theme.palette.divider,
    "backgroundColor": theme.palette.success.light,
    "&:hover": {
      borderColor: theme.palette.divider,
      backgroundColor: "#5DB8BEcc",
    },
    "&:disabled": {
      backgroundColor: "#5DB8BE66",
      border: "none",
      color: theme.palette.primary.contrastText,
    },
  }),
}));

export default ModalActionButton;
