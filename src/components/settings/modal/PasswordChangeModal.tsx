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
import { useRecoilState, useRecoilValue } from "recoil";
import { selectAreaState, staffListState } from "@libraries/recoil";
import useChangePassword from "@hooks/mutation/useChangePassword";
import { toast } from "react-toastify";
import useReqChangePassword from "@hooks/mutation/useRequestPassword";
import EditStaffInputField from "../EditStaffInputField";
import { StaffListType } from "@hooks/queries/useGetStaffList";
import InfoModal from "./InfoModal";
import { OPTIONS } from "../const";
import {
  EditMultiStaff,
  EditMultiStaffField,
  EditStaff,
  EditStaffField,
  NewPassword,
  NewPassWordField,
} from "@models/ward";
import EditStaffMultiField from "../EditStaffMultiInputField";
import useChangeStaffInfo from "@hooks/mutation/usePutChangeStaffInfo";
import useChangeStaffArea from "@hooks/mutation/useChangeArea";
import useChangeStaffRole from "@hooks/mutation/useChangeRole";

interface TabContentProps {
  isActive?: boolean;
}

interface PWChangeModalProps extends CMModalProps {
  staffInfo?: StaffListType;
  isMultiEdit?: boolean;
}

const TAB_MENU = ["계정 정보 수정", "비밀번호 편집"];

const MENU_OPTIONS = [
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

export default function PasswordChangeModal({
  staffInfo,
  isMultiEdit,
  ...props
}: PWChangeModalProps) {
  const [activeMenu, setActiveMenu] = useState<string>(TAB_MENU[0]);
  const [isChange, setIsChange] = useState<boolean>(true);

  const [isInfoModalOpen, openInfoModal, closeInfoModal] = useBooleanState(false);
  const [isSaveModalOpen, openSaveModal, closeSaveModal] = useBooleanState(false);
  const [isRequestModalOpen, openRequestModal, closeRequestModal] = useBooleanState(false);

  const [selectStaffList, setSelectStaffList] = useRecoilState(staffListState);
  const selectAreaList = useRecoilValue(selectAreaState);

  const { mutate: changePassword } = useChangePassword();
  const { mutate: reqChangePassword } = useReqChangePassword();
  const { mutate: changeStaffInfo } = useChangeStaffInfo();
  const { mutate: changeStaffRole } = useChangeStaffRole();
  const { mutate: changeStaffArea } = useChangeStaffArea();

  // useEffect(() => {
  //   if (isMultiEdit) {
  //     setActiveMenu(TAB_MENU[1]);
  //   } else {
  //     setActiveMenu(TAB_MENU[0]);
  //   }
  // }, [isMultiEdit, setActiveMenu]);

  /** 스태프 단일 계정 정보 수정 useForm 객체 */
  const editForm = useForm<EditStaff>({
    defaultValues: {
      name: staffInfo?.name || "",
      staffRole: staffInfo?.staffRole || "DOCTOR",
      area: staffInfo?.areas?.[0]?.areaId.toString() || "",
      id: staffInfo?.loginId || "",
      phoneNumber: staffInfo?.phoneNumber || "",
      email: staffInfo?.email || "",
    },
    mode: "onChange",
  });
  const { handleSubmit: handleEditSubmit } = editForm;

  /** 스태프 단일 계정 정보 수정 로직 */
  const editonSubmit: SubmitHandler<EditStaff> = data => {
    const newStaffRole = OPTIONS.find(option => option.value === data.staffRole)?.role as string;
    const newStaffInfo = {
      staffId: staffInfo ? staffInfo?.staffId : selectStaffList[0],
      staffRole: newStaffRole,
      areaIds: selectAreaList,
      email: data.email,
    };
    // console.log(newStaffInfo);

    changeStaffInfo(newStaffInfo, {
      onSuccess: () => {
        toast.success("변경 내용이 저장되었습니다.");
        props.onClose();
        openSaveModal();
      },
      onError: error => {
        toast.error("계정 정보 변경에 실패했습니다.");
        console.error(error);
      },
    });
  };

  /** 스태프 다중 계정 정보 수정 useForm 객체 */
  const editMultiForm = useForm<EditMultiStaff>({
    defaultValues: {
      staffRole: staffInfo?.staffRole || "DOCTOR",
      area: staffInfo?.areas?.[0]?.areaId.toString() || "",
    },
    mode: "onChange",
  });
  const { handleSubmit: handleEditMultiSubmit } = editMultiForm;

  /** 스태프 다중 계정 정보 수정 로직 */
  const editMultionSubmit: SubmitHandler<EditMultiStaff> = data => {
    /** 직업 변경 api 로직 */
    const newStaffRole = OPTIONS.find(option => option.value === data.staffRole)?.role as string;
    const changeRole = {
      userIds: selectStaffList,
      staffRole: newStaffRole,
    };
    console.log(changeRole);

    /** 구역 변경 api 로직 */
    changeStaffRole(changeRole, {
      onSuccess: () => {},
      onError: error => console.error(error),
    });

    const changeArea = {
      userIds: selectStaffList,
      areaIds: selectAreaList,
    };
    console.log(changeArea);

    changeStaffArea(changeArea, {
      onSuccess: () => {
        toast.success("변경 내용이 저장되었습니다.");
        props.onClose();
        openSaveModal();
      },
      onError: error => {
        toast.error("계정 정보 변경에 실패했습니다.");
        console.error(error);
      },
    });
  };

  /** 비밀번호 로직 변경 useForm 객체 */
  const form = useForm<NewPassword>({
    defaultValues: defaultValuesPW,
    mode: "onChange",
  });
  const { handleSubmit, reset } = form;

  /** 비밀번호 강제 변경 로직 */
  const onSubmit: SubmitHandler<NewPassword> = data => {
    const newPasswordRequest = {
      userIds: selectStaffList.length === 0 ? [staffInfo?.staffId as number] : selectStaffList,
      newPassword: data.confirmPassword,
      accountType: "STAFF",
    };
    props.onClose();
    changePassword(newPasswordRequest, {
      onSuccess: () => {
        setActiveMenu("계정 정보 수정");
        reset();
        setSelectStaffList([]);
        openInfoModal();
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  /** 비밀번호 변경 요청 로직 */
  const handleRequestChangePassword = () => {
    reqChangePassword(
      {
        userIds: selectStaffList.length === 0 ? [staffInfo?.staffId as number] : selectStaffList,
        accountType: "STAFF",
      },
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
      {/* 바말번호 변경 완료 안내 모달 */}
      <InfoModal modalType="successChangePW" open={isInfoModalOpen} onClose={closeInfoModal} />

      {/* 바말번호 변경 요청 성공 안내 모달 */}
      <InfoModal modalType="successChangeInfo" open={isSaveModalOpen} onClose={closeSaveModal} />

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
              <ModalActionButton
                onClick={
                  activeMenu === "계정 정보 수정"
                    ? !isMultiEdit
                      ? handleEditSubmit(editonSubmit)
                      : handleEditMultiSubmit(editMultionSubmit)
                    : handleSubmit(onSubmit)
                }
                disabled={
                  activeMenu === "비밀번호 편집"
                    ? false
                    : selectAreaList.length === 0
                      ? true
                      : false
                }
              >
                변경하기
              </ModalActionButton>
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
                // sx={{
                //   cursor: `${tab === "계정 정보 수정" && isMultiEdit ? "not-allowed" : "pointer"}`,
                // }}
                key={index}
                onClick={() => {
                  // if (!isMultiEdit) {
                  //   setIsChange(prev => !prev);
                  //   setActiveMenu(tab);
                  // }
                  tab === "계정 정보 수정" ? setIsChange(true) : setIsChange(false);
                  setActiveMenu(tab);
                }}
                isActive={tab === activeMenu}
              >
                <Typography
                  variant="h3"
                  // sx={{
                  //   opacity: `${tab === "계정 정보 수정" && isMultiEdit ? "0.3" : "1"}`,
                  // }}
                >
                  {tab}
                </Typography>
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
                          {MENU_OPTIONS.map(option => (
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
                      )}
                    </>
                  ),
                  "계정 정보 수정": (
                    <Stack gap={"24px"}>
                      {isMultiEdit ? (
                        <>
                          {editMultiStaffFields.map(field => (
                            <EditStaffMultiField
                              key={field.name}
                              field={field}
                              form={editMultiForm}
                            />
                          ))}
                        </>
                      ) : (
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

const fields: NewPassWordField[] = [
  { name: "password", label: "신규 비밀번호", placeholder: "비밀번호를 입력해주세요." },
  {
    name: "confirmPassword",
    label: "신규 비밀번호 확인",
    placeholder: "비밀번호를 재입력해주세요.",
  },
];

const editStaffFields: EditStaffField[] = [
  { name: "name", label: "이름", placeholder: "" },
  { name: "staffRole", label: "직업", placeholder: "" },
  { name: "area", label: "구역", placeholder: "" },
  { name: "id", label: "아이디", placeholder: "" },
  { name: "phoneNumber", label: "전화번호", placeholder: "" },
  { name: "email", label: "이메일", placeholder: "이메일을 입력해주세요." },
];

const editMultiStaffFields: EditMultiStaffField[] = [
  { name: "staffRole", label: "직업" },
  { name: "area", label: "구역" },
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
