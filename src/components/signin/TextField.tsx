import { SigninFormData } from "@models/signin";
import { TextField as MuiTextField, InputAdornment } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import {
  LockOutlined as LockOutlinedIcon,
  PermIdentityOutlined as PermIdentityOutlinedIcon,
} from "@mui/icons-material";

type TextFieldProps = {
  label: string;
  name: keyof SigninFormData;
  form: UseFormReturn<SigninFormData>;
  type?: string;
  value?: string;
};

const iconMap = {
  loginId: PermIdentityOutlinedIcon,
  password: LockOutlinedIcon,
};

export default function TextField({ label, name, form, type, value }: TextFieldProps) {
  //@ts-ignore
  const Icon = iconMap[name];

  return (
    <MuiTextField
      placeholder={label}
      value={value}
      variant="outlined"
      type={type}
      {...form.register(name)}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ paddingLeft: "8px", color: theme => theme.palette.grey[500] }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </InputAdornment>
        ),
      }}
      fullWidth
      margin="normal"
    />
  );
}
