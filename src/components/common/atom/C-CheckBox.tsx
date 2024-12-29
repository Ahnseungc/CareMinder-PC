import { Checkbox, SvgIcon } from "@mui/material";
import palette from "@styles/palette";
import { ReactComponent as CheckedIcon } from "@assets/checked-icon.svg";
import { FC } from "react";

interface CCheckBoxProps {
  onChange: (...props: any[]) => void;
  checked: boolean;
}

const CCheckBox: FC<CCheckBoxProps> = ({ onChange, checked }) => {
  return (
    <>
      <Checkbox
        checked={checked}
        onChange={onChange}
        icon={
          <div
            style={{
              width: "28px",
              height: "28px",
              border: `1px solid ${palette.divider}`,
              borderRadius: "6px",
              backgroundColor: "#ECECEC80",
            }}
          />
        }
        checkedIcon={
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: `${palette.secondary.main}`,
              borderRadius: "6px",
              position: "relative",
            }}
          >
            <SvgIcon
              component={CheckedIcon}
              inheritViewBox
              sx={{
                display: "flex",
                alignItems: "center",
                width: "15px",
                height: "12px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fill: "transparent",
              }}
            />
          </div>
        }
        sx={{
          padding: 0,
          width: "28px",
          height: "28px",
        }}
      />
    </>
  );
};

export default CCheckBox;
