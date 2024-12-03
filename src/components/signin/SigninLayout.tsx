import AccountActiveModal from "@components/settings/modal/AccountActive";
import InfoModal, { ModalType } from "@components/settings/modal/InfoModal";
import StopAccountActiveModal from "@components/settings/modal/StopAccountActive";
import { SigninHeader } from "@components/signin";
import SigninForm from "@components/signin/SigninForm";
import UserTypeTag from "@components/signin/UserTypeTag";
import { useSignin } from "@hooks/mutation";
import { SigninFormData } from "@models/signin";
import { UserType } from "@models/user";
import { Grid, Divider, styled, Stack } from "@mui/material";
import { useBooleanState } from "@toss/react";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type SigninLayoutProps = {
  type: UserType;
  footer?: ReactElement;
  options?: ReactElement;
};

export default function SigninLayout({ type, footer, options }: SigninLayoutProps) {
  const form = useForm<SigninFormData>();
  const { mutate: signin, error } = useSignin();
  const [open, openModal, closeModal] = useBooleanState();

  const [isopenAccountModal, onOpenAccountModal, closeAccountModal] = useBooleanState(); // 계정 활성화 Modal
  const [openStopModal, onOpenStopModal, closeStopModal] = useBooleanState(); // 계정 활성화 중단 Modal
  const [isModalType, setIsModalType] = useState<ModalType>("waiting");

  /* 어드민 계정 로그인 시 에러 핸들링*/
  useEffect(() => {
    // @ts-ignore
    if (error?.response) {
      // @ts-ignore
      if (error?.response.data.statusCode === "401") {
        /** 계정 잠김 에러 핸들링 */
        setIsModalType("waiting");
        onOpenAccountModal();
        // @ts-ignore
      } else if (error?.response.data.statusCode === "404") {
        /** 존재하지 않는 계정 에러 핸들링 */
        setIsModalType("noResult");
      } else {
        setIsModalType("error");
      }
      openModal();
    }
  }, [error]);

  const onSubmit = signin;

  const onCloseAccountModal = (type: string) => {
    if (type === "취소") return onOpenStopModal();

    if (type === "중단하기") {
      closeStopModal();
      return closeAccountModal();
    }
  };

  return (
    <>
      <AccountActiveModal
        open={isopenAccountModal}
        onClose={closeAccountModal}
        onCloseAccountModal={onCloseAccountModal}
      />
      <StopAccountActiveModal
        open={openStopModal}
        onClose={closeStopModal}
        onCloseAccountModal={onCloseAccountModal}
      />
      <InfoModal open={open} onClose={closeModal} modalType={isModalType}></InfoModal>
      <Container item xs>
        <Content>
          <SigninHeader />
          <UserTypeTag type={type} />
          <SigninForm form={form} onSubmit={onSubmit} type={type} />
          {options}
        </Content>
        {footer && (
          <Footer divider={<Divider orientation="vertical" />}>
            {/* Todo */}
            {/* <Link href="#" variant="h3">
            ID / PW 찾기
          </Link> */}
            {footer}
          </Footer>
        )}
      </Container>
    </>
  );
}

/** styles */

const Container = styled(Grid)({
  minWidth: "fit-content",

  padding: "24px",
  paddingBottom: "50px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

const Content = styled(Stack)({
  margin: "30px 0 60px 0",
  flex: 1,

  alignItems: "center",
  justifyContent: "center",
});

const Footer = styled(Stack)({
  height: "24px",
  gap: "14px",

  flexDirection: "row",

  justifyContent: "center",
  alignItems: "center",
});
