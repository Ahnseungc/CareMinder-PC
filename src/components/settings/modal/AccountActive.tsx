import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Box, Stack, styled, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import AccountActiveField from "../AccountActiveField";
import { useRecoilValue } from "recoil";
import verifyPhoneState from "@libraries/recoil/verifyPhone";
import { userState } from "@libraries/recoil";
import axios from "axios";
import Cookies from "js-cookie";

interface AccountActiveModalProps extends CMModalProps {
  onConfirm: () => void;
}

const SEVER_URL = import.meta.env.VITE_SEVER_URL;
export default function AccountActiveModal({
  onClose,
  onConfirm,
  ...props
}: AccountActiveModalProps) {
  const verifyPhone = useRecoilValue(verifyPhoneState);
  const userStatus = useRecoilValue(userState);
  const accessTokenStaff = Cookies.get("accessTokenStaff");

  const form = useForm<AccountActivePhone>({
    defaultValues: { phoneNumber: "" },
    mode: "onChange",
  });
  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<AccountActivePhone> = async data => {
    try {
      const res = await axios.post(
        `${SEVER_URL}/users/active-account`,
        {
          userId: userStatus?.id,
          phoneNumber: data.phoneNumber,
          accountType: "STAFF",
        },
        {
          headers: {
            Authorization: `Bearer ${accessTokenStaff}`,
          },
        },
      );
      console.log(res);
      onConfirm();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <CMModal
        maxWidth="sm"
        onClose={onClose}
        title={"계정 활성화"}
        footer={
          <>
            <ModalActionButton hoverColor="#19181813" color="secondary" onClick={onClose}>
              취소
            </ModalActionButton>
            <ModalActionButton
              hoverColor="#30b3ff55"
              color="success"
              onClick={handleSubmit(onSubmit)}
              disabled={!verifyPhone}
            >
              완료
            </ModalActionButton>
          </>
        }
        {...props}
      >
        <ContentLayout>
          <Typography variant="h3">
            {"계정을 활성화하기 위해선 휴대전화 번호 본인 인증이 필요합니다."}
          </Typography>
          <Stack gap={"24px"} sx={{ width: "70%", marginTop: "20px" }}>
            {accountField.map(field => (
              <AccountActiveField key={field.name} field={field} form={form} />
            ))}
          </Stack>
        </ContentLayout>
      </CMModal>
    </>
  );
}

/** utils */

export type AccountActivePhone = {
  phoneNumber: string;
};

export type AccountActiveFieldType = {
  name: keyof AccountActivePhone;
  label: string;
  placeholder: string;
};

const accountField: AccountActiveFieldType[] = [
  { name: "phoneNumber", label: "전화번호", placeholder: "010-0000-0000" },
];

/** styles */

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "24px 30px",
  alignItems: "center",
});
