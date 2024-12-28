import { CMModal, CMModalProps, ModalActionButton } from "@components/common";
import styled from "@emotion/styled";
import useWardCheck from "@hooks/mutation/useWardCheck";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useRef, useState } from "react";
import InfoModal from "./InfoModal";
import { useBooleanState } from "@toss/react";
import { useSetRecoilState } from "recoil";
import { settingsLoginState } from "@libraries/recoil";
import { useNavigate } from "react-router-dom";

export default function SettingsModal({ onClose, ...props }: CMModalProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, openModal, closeModal] = useBooleanState();
  const setIsModalState = useSetRecoilState(settingsLoginState);
  const navigate = useNavigate();

  const { mutate: wardCheck } = useWardCheck();

  const handleCheck = () => {
    if (!inputRef.current) {
      return;
    }
    const password = inputRef.current.value;
    wardCheck(
      { password: password, accountType: "WARD" },
      {
        onSuccess: () => {
          setIsModalState(false);
          onClose();
        },
        onError: error => {
          //@ts-ignore
          if (error.response.data === "비밀번호가 일치하지 않습니다.") {
            openModal();
          }
        },
      },
    );
  };

  const handleModalClose = () => {
    navigate(-1); // 인증 실패 상태에서 닫을 때만 이전 페이지로
    onClose();
  };

  return (
    <>
      <InfoModal
        open={isOpen}
        onClose={closeModal}
        modalType="valueError"
        message="비밀번호가 틀렸습니다"
      />
      <CMModal
        maxWidth="xs"
        onClose={handleModalClose}
        title={"병동 설정 비밀번호 확인"}
        footer={<ModalActionButton onClick={handleCheck}>확인</ModalActionButton>}
        {...props}
      >
        <Container>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            병동 설정 페이지는 보안이 필요한 관리자 전용 기능입니다.
            <br />
            계정 비밀번호를 입력하여 본인 인증을 진행해 주세요.
          </Typography>
          <PasswordInputContainer>
            <PasswordInput ref={inputRef} type={showPassword ? "text" : "password"} />
            <IconContainer onClick={() => setShowPassword(show => !show)}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconContainer>
          </PasswordInputContainer>
        </Container>
      </CMModal>
    </>
  );
}

/** styles */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PasswordInputContainer = styled.div`
  position: relative;
`;

const PasswordInput = styled.input`
  outline: none;
  border: 1px solid #ececec;
  height: 40px;
  width: 300px;
  border-radius: 6px;
  padding: 2px 10px;
  margin-top: 10px;
  letter-spacing: 4px;
  font-size: 16px;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 18px;
  right: 10px;
  cursor: pointer;
`;
