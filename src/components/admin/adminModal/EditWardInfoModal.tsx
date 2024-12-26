import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { SwitchCase, useBooleanState } from "@toss/react";
import { NewPassword, NewPassWordField } from "@models/ward";
import { EditWard, EditWardField } from "@models/admin";
import { Stack, Typography } from "@mui/material";
import EditWardInfoField from "./EditWardInfoField";
import { SubmitHandler, useForm } from "react-hook-form";
import { WardListType } from "@hooks/queries/useGetWardList";
import NewPasswordField from "@components/settings/NewPasswordInputField";
import { useRecoilState } from "recoil";
import { wardNameCheckState } from "@libraries/recoil/idDoubleCheck";
import useChangePassword from "@hooks/mutation/useChangePassword";
import wardListState from "@libraries/recoil/wardList";
import { toast } from "react-toastify";
import InfoModal from "@components/settings/modal/InfoModal";
import useChangeWardInfo, { NewWardInfo } from "@hooks/mutation/usePutChangeWardInfo";

type Tab = "계정 정보 수정" | "비밀번호 강제 변경";

const defaultValues: EditWard = {
  wardname: "",
  id: "",
  managerName: "",
  managerEmail: "",
};

const defaultValuesPW: NewPassword = {
  password: "",
  confirmPassword: "",
};

interface EditWardInfoModalProps extends CMModalProps {
  wardData: WardListType | undefined;
}

export default function EditWardInfoModal({ onClose, wardData, ...props }: EditWardInfoModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("계정 정보 수정");
  const [isWardNameChange, setIsWardNameChange] = useState<boolean>(false);

  const [isInfoModalOpen, openInfoModal, closeInfoModal] = useBooleanState(false);
  const [isSaveModalOpen, openSaveModal, closeSaveModal] = useBooleanState(false);

  const [isWardNameChecked, setIsWardNameChecked] = useRecoilState(wardNameCheckState);
  const [selectWardList, setSelectWardList] = useRecoilState(wardListState);

  const { mutate: changePassword } = useChangePassword();
  const { mutate: changeWardInfo } = useChangeWardInfo();

  /** 병동 계정 정보 수정 로직 */
  const form = useForm<EditWard>({
    defaultValues,
    mode: "onChange",
  });

  const { handleSubmit, reset, watch } = form;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "wardname") {
        setIsWardNameChange(value.wardname !== wardData?.wardName);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, wardData?.wardName]);

  const onSubmit: SubmitHandler<EditWard> = data => {
    const newWardData: NewWardInfo = {
      wardId: wardData?.wardId as number,
      wardName: data.wardname,
      managerName: data.managerName,
      managerEmail: data.managerEmail,
    };
    console.log(newWardData);
    changeWardInfo(newWardData, {
      onSuccess: res => {
        console.log(res);
        toast.success("변경 내용이 저장되었습니다.");
        setIsWardNameChecked(false);
        onClose();
        openSaveModal();
      },
      onError: error => {
        toast.error("계정 정보 변경에 실패했습니다.");
        console.error(error);
      },
    });
  };

  /** 병동 계정 비밀번호 강제 변경 로직 */

  const changePWform = useForm<NewPassword>({
    defaultValues: defaultValuesPW,
    mode: "onChange",
  });

  const { handleSubmit: handleSubmitChangePW, reset: changePWformReset } = changePWform;

  const onSubmitChangePW: SubmitHandler<NewPassword> = data => {
    console.log(data);
    const newPasswordRequest = {
      userIds: selectWardList.length === 0 ? [wardData?.wardId as number] : selectWardList,
      newPassword: data.confirmPassword,
      accountType: "WARD",
    };
    onClose();
    changePassword(newPasswordRequest, {
      onSuccess: () => {
        setActiveTab("계정 정보 수정");
        reset();
        setSelectWardList([]);
        openInfoModal();
      },
      onError: error => {
        toast.error(error.message);
      },
    });
  };

  const handleClear = () => {
    onClose();
    reset();
    changePWformReset();
    setActiveTab("계정 정보 수정");
  };

  if (!wardData) {
    return;
  }

  return (
    <>
      {/* 바말번호 변경 완료 안내 모달 */}
      <InfoModal
        modalType="successChangePW"
        open={isInfoModalOpen}
        onClose={closeInfoModal}
        isAdmin={true}
      />

      {/* 바말번호 변경 요청 성공 안내 모달 */}
      <InfoModal
        modalType="successChangeInfo"
        open={isSaveModalOpen}
        onClose={closeSaveModal}
        isAdmin={true}
      />

      <CMModal
        onClose={handleClear}
        maxWidth="md"
        title={"병동 계정 정보 수정하기"}
        footer={
          <>
            <ModalActionButton
              color="secondary"
              onClick={handleClear}
              sx={{
                "&:hover": {
                  backgroundColor: "#5DB8BE3c !important",
                },
              }}
            >
              취소
            </ModalActionButton>
            <ModalActionButton
              color="info"
              onClick={
                activeTab === "계정 정보 수정"
                  ? handleSubmit(onSubmit)
                  : handleSubmitChangePW(onSubmitChangePW)
              }
              disabled={isWardNameChange && !isWardNameChecked}
            >
              변경
            </ModalActionButton>
          </>
        }
        {...props}
      >
        <X
          style={{ position: "absolute", right: "24px", top: "28px", cursor: "pointer" }}
          onClick={handleClear}
        />
        <TabMenuContainer>
          <TabMenu
            isActive={activeTab === "계정 정보 수정"}
            onClick={() => setActiveTab("계정 정보 수정")}
          >
            계정 정보 수정
          </TabMenu>
          <TabMenu
            isActive={activeTab === "비밀번호 강제 변경"}
            onClick={() => setActiveTab("비밀번호 강제 변경")}
          >
            비밀번호 강제 변경
          </TabMenu>
        </TabMenuContainer>
        <FieldContainer>
          <SwitchCase
            value={activeTab}
            caseBy={{
              ["계정 정보 수정"]: (
                <Stack gap={"24px"}>
                  {editWardFields.map(field => (
                    <EditWardInfoField
                      key={field.name}
                      field={field}
                      form={form}
                      wardData={wardData}
                    />
                  ))}
                </Stack>
              ),
              ["비밀번호 강제 변경"]: (
                <Stack gap={"24px"}>
                  <Typography variant="h2" sx={{ marginBottom: "9px", textAlign: "center" }}>
                    새로운 비밀번호를 입력해주세요.
                  </Typography>
                  {editPWfields.map(field => (
                    <NewPasswordField key={field.name} field={field} form={changePWform} />
                  ))}
                  <Typography variant="h4" sx={{ textAlign: "start", color: "#878787" }}>
                    ・ 영문(대소문자)또는 숫자 조합의 4~20자
                  </Typography>
                  <Typography variant="h4" sx={{ textAlign: "center", color: "#878787" }}>
                    강제변경하기
                  </Typography>
                </Stack>
              ),
            }}
          />
        </FieldContainer>
      </CMModal>
    </>
  );
}

/** utils */

const editWardFields: EditWardField[] = [
  { name: "wardname", label: "병동", placeholder: "병동명을 입력하세요" },
  { name: "id", label: "아이디", placeholder: "아이디를 입력하세요" },
  { name: "managerName", label: "담당자 이름", placeholder: "담당자 이름을 입력하세요" },
  { name: "managerEmail", label: "담당자 이메일", placeholder: "담당자 이메일을 입력하세요" },
];

const editPWfields: NewPassWordField[] = [
  { name: "password", label: "신규 비밀번호", placeholder: "비밀번호를 입력해주세요." },
  {
    name: "confirmPassword",
    label: "신규 비밀번호 확인",
    placeholder: "비밀번호를 재입력해주세요.",
  },
];

/** styles */

const TabMenuContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  margin-top: 40px;
`;

const TabMenu = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  width: 50%;
  text-align: center;
  font-size: 16px;
  padding-bottom: 6px;
  border-bottom: ${props => (props.isActive ? "2px solid #5DB8BE" : "1px solid #5E5F65")};
  font-weight: ${props => (props.isActive ? "600" : "400")};
  color: ${props => (props.isActive ? "#5DB8BE" : "#5E5F65")};
`;

const FieldContainer = styled.div`
  width: 60%;
  margin: 40px auto;
`;
