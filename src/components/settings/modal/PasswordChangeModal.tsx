import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { Stack, styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as Right } from "@/assets/chevron-right.svg";
import { SwitchCase, useBooleanState } from "@toss/react";
import NewPasswordField from "../NewPasswordInputField";
import { SubmitHandler, useForm } from "react-hook-form";
import ChangeModal from "./ChangeModal";
import { useRecoilState } from "recoil";
import { staffListState } from "@libraries/recoil";
import useChangePassword from "@hooks/mutation/useChangePassword";
import { toast } from "react-toastify";
import useReqChangePassword from "@hooks/mutation/useRequestPassword";
import EditStaffInputField from "../EditStaffInputField";
import { StaffListType } from "@hooks/queries/useGetStaffList";

interface TabContentProps {
  isActive?: boolean;
}
const TAB_MENU = ["계정 정보 수정", "비밀번호 편집"];
const OPTIONS = [
  {
    type: "강제 변경하기",
    description: (
      <Typography>
        <ul>
          <li>사용자가 스태프의 비밀번호를 즉시 강제로 변경합니다.</li>
          <li>설정한 비밀번호로 바로 적용되며, 스태프에게 변경 사실이 전달되지 않습니다.</li>
        </ul>
      </Typography>
    ),
  },
  {
    type: "변경 요청하기",
    description: (
      <Typography>
        <ul>
          <li>스태프에게 비밀번호 변경 요청 메시지가 전송됩니다.</li>
          <li>2일 내로 변경하지 않을 경우, 계정이 잠기며 병동 계정에서 해제할 수 있습니다.</li>
        </ul>
      </Typography>
    ),
  },
];

const defaultValuesPW: NewPassword = {
  password: "",
  confirmPassword: "",
};

const defaultValuesEditStaff: EditStaff = {
  name: "",
  staffRole: "DOCTOR",
  area: "",
  id: "",
  phoneNumber: "",
  email: "",
};

interface PWChangeModalProps extends CMModalProps {
  staffInfo?: StaffListType;
}

export default function PasswordChangeModal({ staffInfo, ...props }: PWChangeModalProps) {
  const [activeMenu, setActiveMenu] = useState<string>(TAB_MENU[0]);
  const [isChange, setIsChange] = useState<boolean>(true);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isRequestModalOpen, openRequestModal, closeRequestModal] = useBooleanState(false);
  const [selectStaffList, setSelectStaffList] = useRecoilState(staffListState);

  const { mutate: changePassword } = useChangePassword();
  const { mutate: reqChangePassword } = useReqChangePassword();

  const form = useForm<NewPassword>({
    defaultValues: defaultValuesPW,
    mode: "onChange",
  });
  const { handleSubmit, reset } = form;

  const editForm = useForm<EditStaff>({
    defaultValues: defaultValuesEditStaff,
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<NewPassword> = data => {
    console.log(data);
    console.log(selectStaffList);
    const newPasswordRequest = {
      userIds: selectStaffList,
      newPassword: data.confirmPassword,
    };
    changePassword(newPasswordRequest, {
      onSuccess: () => {
        setSelectStaffList([]);
        setIsSuccess(true);
      },
      onError: error => {
        toast.error(error.message);
      },
    });
    /**비밀번호 강제 변경 api 로직 구현할 부분 */
  };

  const handleRequestChangePassword = () => {
    reqChangePassword(
      { userIds: selectStaffList },
      {
        onSuccess: () => {
          setSelectStaffList([]);
          closeRequestModal();
        },
        onError: error => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleModalClose = () => {
    reset();
    props.onClose();
    setTimeout(() => {
      setActiveMenu("계정 정보 수정");
      setIsChange(true);
      setIsSuccess(false);
    }, 100);
  };

  const handleChangePW = (type: string) => {
    switch (type) {
      case "강제 변경하기":
        setIsChange(prev => !prev);
        return;
      case "변경 요청하기":
        props.onClose();
        openRequestModal();
        return;
    }
  };

  return (
    <>
      {/* 비밀번호 변경 요청하기 모달 */}
      <ChangeModal
        open={isRequestModalOpen}
        onClose={closeRequestModal}
        onConfirm={handleRequestChangePassword}
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
      />

      <CMModal
        {...props}
        maxWidth="md"
        title={"스태프 계정 정보 수정하기"}
        footer={
          isChange ? (
            <>
              <ModalActionButton color="secondary" onClick={handleModalClose}>
                취소
              </ModalActionButton>
              <ModalActionButton onClick={handleSubmit(onSubmit)}>변경하기</ModalActionButton>
            </>
          ) : (
            <>
              <ModalActionButton
                color="secondary"
                onClick={() => {
                  props.onClose();
                  setTimeout(() => {
                    setActiveMenu("계정 정보 수정");
                    setIsChange(true);
                  }, 100);
                }}
              >
                취소
              </ModalActionButton>
            </>
          )

          // !isChange ? (
          //   <>
          //     <ModalActionButton color="secondary" onClick={() => props.onClose()}>
          //       취소
          //     </ModalActionButton>
          //   </>
          // ) : !isSuccess ? (
          //   <>
          //     <ModalActionButton color="secondary" onClick={handleModalClose}>
          //       취소
          //     </ModalActionButton>
          //     <ModalActionButton onClick={handleSubmit(onSubmit)}>변경하기</ModalActionButton>
          //   </>
          // ) : (
          //   <>
          //     <ModalActionButton onClick={handleModalClose}>닫기</ModalActionButton>
          //   </>
          // )
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
                onClick={() => {
                  setIsChange(prev => !prev);
                  setActiveMenu(tab);
                }}
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
                  "비밀번호 편집": (
                    <>
                      {!isChange ? (
                        <>
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
                      ) : !isSuccess ? (
                        <Stack gap={"24px"} sx={{ padding: "0 100px" }}>
                          <Typography
                            variant="h2"
                            sx={{ marginBottom: "9px", textAlign: "center" }}
                          >
                            새로운 비밀번호를 입력해주세요.
                          </Typography>
                          {fields.map(field => (
                            <NewPasswordField key={field.name} field={field} form={form} />
                          ))}
                          <Typography variant="h4" sx={{ textAlign: "start", color: "#878787" }}>
                            ・ 영문(대소문자)또는 숫자 조합의 4~20자
                          </Typography>
                          <Typography variant="h4" sx={{ textAlign: "center", color: "#878787" }}>
                            강제변경하기
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack gap={"24px"}>
                          <Typography
                            variant="h2"
                            sx={{ marginBottom: "9px", textAlign: "center" }}
                          >
                            비밀번호 변경 완료
                          </Typography>
                          <Typography variant="h4" sx={{ textAlign: "center", color: "#878787" }}>
                            새로운 비밀번호로 변경 완료되었습니다.
                            <br />
                            기존에 로그인 된 기기에서 로그아웃되었습니다.
                          </Typography>
                          <Typography variant="h4" sx={{ textAlign: "center", color: "#878787" }}>
                            강제변경하기
                          </Typography>
                        </Stack>
                      )}
                    </>
                  ),
                  "계정 정보 수정": (
                    <div>
                      <Stack gap={"24px"}>
                        {staffInfo && (
                          <>
                            {editStaffFields.map(field => (
                              <EditStaffInputField
                                key={field.name}
                                field={field}
                                form={editForm}
                                staffInfo={staffInfo}
                              />
                            ))}
                          </>
                        )}
                      </Stack>
                    </div>
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
  { name: "password", label: "신규 비밀번호", placeholder: "비밀번호를 입력해주세요." },
  {
    name: "confirmPassword",
    label: "신규 비밀번호 확인",
    placeholder: "비밀번호를 재입력해주세요.",
  },
];

export type EditStaffRequest = {
  staffId: number;
  staffRole: string;
  areaId: number;
  email: string;
};

export type EditStaff = {
  name: string;
  staffRole: string;
  area: string;
  id: string;
  phoneNumber: string;
  email: string;
};

export type EditStaffField = {
  name: keyof EditStaff;
  label: string;
  placeholder: string;
};

const editStaffFields: EditStaffField[] = [
  { name: "name", label: "이름", placeholder: "" },
  { name: "staffRole", label: "직업", placeholder: "" },
  { name: "area", label: "구역", placeholder: "" },
  { name: "id", label: "아이디", placeholder: "" },
  { name: "phoneNumber", label: "전화번호", placeholder: "" },
  { name: "email", label: "이메일", placeholder: "" },
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
  width: "50%",
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
