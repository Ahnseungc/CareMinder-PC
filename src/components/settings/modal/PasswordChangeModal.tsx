import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Stack, styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as Right } from "@/assets/chevron-right.svg";
import { ReactComponent as Nothing } from "@/assets/frown.svg";
import { SwitchCase, useBooleanState } from "@toss/react";
import NewPasswordField from "../NewPasswordInputField";
import { SubmitHandler, useForm } from "react-hook-form";
import InfoModal from "./InfoModal";
import ChangeModal from "./ChangeModal";

interface TabContentProps {
  isActive?: boolean;
}
const TAB_MENU = ["비밀번호 변경", "NFC 변경", "지문 변경"];
const OPTIONS = [
  {
    type: "강제 변경",
    description: (
      <Typography>
        비밀번호를 직접 수정합니다.
        <br />
        사용자에게 비밀번호가 변경되었다는 사실은 전달되지 않습니다.
      </Typography>
    ),
  },
  {
    type: "변경 요청",
    description: (
      <Typography>
        해당 구성원에게 메시지로 로그인 정보 업데이트 요청이 전송됩니다.
        <br />
        현재 계정에 로그인된 상태라면 15분 후 자동으로 로그아웃 됩니다.
      </Typography>
    ),
  },
];

const defaultValues: NewPassword = {
  password: "",
  confirmPassword: "",
};

export default function PasswordChangeModal(props: CMModalProps) {
  const [activeMenu, setActiveMenu] = useState<string>(TAB_MENU[0]);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [isRequestModalOpen, openRequestModal, closeRequestModal] = useBooleanState(false);

  const form = useForm<NewPassword>({
    defaultValues,
    mode: "onChange",
  });
  const { handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<NewPassword> = data => {
    console.log(data);
    /**비밀번호 강제 변경 api 로직 구현할 부분 */
  };

  const handleModalClose = () => {
    reset();
    setIsChange(false);
    props.onClose();
  };

  const handleChangePW = (type: string) => {
    switch (type) {
      case "강제 변경":
        setIsChange(prev => !prev);
        return;
      case "변경 요청":
        props.onClose();
        openRequestModal();
        return;
    }
  };

  return (
    <>
      <ChangeModal
        open={isRequestModalOpen}
        onClose={closeRequestModal}
        onConfirm={() => null}
        modalTitle={"비밀번호를 변경하도록 요청하시겠습니까?"}
        subTitle={
          <Typography variant="body1" sx={{ textAlign: "center", lineHeight: "1.8" }}>
            해당 구성원에게 메시지로 로그인 정보 업데이트 요청이 전송됩니다.
            <br /> 현재 계정에 로그인된 상태라면 15분 후 자동으로 로그아웃 됩니다.
            <br /> 사용자는 2일 이내에 비밀번호를 변경해야 하며, 변경하지 않으면 계정이 잠깁니다.
            <br /> 잠긴 계정은 관리자 계정이나 병동 계정을 통해 해제할 수 있습니다.
          </Typography>
        }
        rightText={"요청하기"}
        isPasswordChange={true}
      />
      <CMModal
        {...props}
        maxWidth="sm"
        title={"비밀번호 편집"}
        footer={
          isChange ? (
            <>
              <ModalActionButton color="secondary" onClick={handleModalClose}>
                취소
              </ModalActionButton>
              <ModalActionButton onClick={handleSubmit(onSubmit)}>추가하기</ModalActionButton>
            </>
          ) : (
            <></>
          )
        }
      >
        <X
          style={{ position: "absolute", right: "24px", top: "28px", cursor: "pointer" }}
          onClick={handleModalClose}
        />
        <Container>
          <TabContainer>
            {TAB_MENU.map((tab, index) => (
              <TabContent
                key={index}
                onClick={() => setActiveMenu(tab)}
                isActive={tab === activeMenu}
              >
                <Typography variant="h3">{tab}</Typography>
              </TabContent>
            ))}
          </TabContainer>
          <BodyContainer>
            <OptionContainer>
              <SwitchCase
                value={activeMenu}
                caseBy={{
                  "비밀번호 변경": (
                    <>
                      {!isChange ? (
                        <>
                          {" "}
                          {OPTIONS.map(option => (
                            <PWOption onClick={() => handleChangePW(option.type)}>
                              <Typography variant="h3" sx={{ marginBottom: "9px" }}>
                                {option.type}
                              </Typography>
                              {option.description}
                              <Right
                                style={{
                                  position: "absolute",
                                  top: "54.5px",
                                  right: "24px",
                                }}
                              />
                            </PWOption>
                          ))}
                        </>
                      ) : (
                        <Stack gap={"24px"}>
                          {fields.map(field => (
                            <NewPasswordField key={field.name} field={field} form={form} />
                          ))}
                          <Typography variant="h4" sx={{ textAlign: "center", color: "#878787" }}>
                            강제변경하기
                          </Typography>
                        </Stack>
                      )}
                    </>
                  ),
                  "NFC 변경": (
                    <OtherOption>
                      <Nothing />
                      <Typography variant="body2">등록된 NFC 정보가 없습니다.</Typography>
                    </OtherOption>
                  ),
                  "지문 변경": (
                    <OtherOption>
                      <Nothing />
                      <Typography variant="body2">등록된 지문 정보가 없습니다.</Typography>
                    </OtherOption>
                  ),
                }}
              />
            </OptionContainer>
          </BodyContainer>
        </Container>
      </CMModal>
    </>
  );
}

/**utils */

export type NewPassword = {
  password: string;
  confirmPassword: string;
};

export type NewPassWordField = {
  name: keyof NewPassword;
  label: string;
  placeholder: string;
};

const fields: NewPassWordField[] = [
  { name: "password", label: "비밀번호", placeholder: "비밀번호를 입력해주세요." },
  { name: "confirmPassword", label: "비밀번호 확인", placeholder: "비밀번호를 재입력해주세요." },
];

/** styles */

const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  padding: "28px 38.5px 10px 38.5px",
});

const TabContainer = styled(Box)({
  width: "100%",
  display: "flex",
  gap: "4px",
});

const TabContent = styled(Box)<TabContentProps>(({ theme, isActive }) => ({
  width: "33.3%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  padding: "6px 35px",
  marginTop: "40px",

  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  borderBottom: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.action.disabled}`,

  cursor: "pointer",
}));

const BodyContainer = styled(Box)({
  width: "100%",
  marginTop: "40px",
});

const OptionContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",

  gap: "12px",

  minHeight: "278px",
});

const PWOption = styled(Box)(({ theme }) => ({
  position: "relative",
  cursor: "pointer",
  padding: "26px 24px",
  borderRadius: "24px",
  backgroundColor: theme.palette.success.main,
}));

const OtherOption = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "24px",
});
