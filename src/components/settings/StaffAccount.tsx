import styled from "@emotion/styled";
import StaffAccountSettingsTable from "@components/settings/StaffAccountSettingsTable";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";
import { useEffect, useRef, useState } from "react";
import InfoModal, { ModalType } from "@components/settings/modal/InfoModal";
import TOSModal from "@components/settings/modal/TOSModal";
import { useRecoilState } from "recoil";
import { editingState, staffListState } from "@libraries/recoil";

import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as UnLock } from "@/assets/completedRequests/Interface essential/Unlock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";
import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";

import PasswordChangeModal from "@components/settings/modal/PasswordChangeModal";
import useLockAccount from "@hooks/mutation/useLockAccount";
import useUnLockAccount from "@hooks/mutation/useUnLockAccount";
import CreateStaffModal from "@components/settings/modal/CreateStaffModal";
import AreaManageModal from "./modal/AreaManageModal";
import DeleteWarning from "./areaManage/DeleteWarning";
import useDeleteStaff from "@hooks/mutation/useDeleteStaff";
import { AnimatePresence, motion } from "framer-motion";

export const StaffAccount = () => {
  const [isTOSModalOpen, openTOSModal, closeTOSModal] = useBooleanState(false);
  const [isCreateStaffModalOpen, openCreateStaffModal, closeCreateStaffModal] =
    useBooleanState(false);
  const [isInfoModalOpen, openInfoModal, closeInfoModal] = useBooleanState(false);
  const [isPWChangeModalOpen, openPWChangeModal, closePWChangeModal] = useBooleanState(false);
  const [isAreaManageModalOpen, openAreaManageModal, closeAreaManageModal] = useBooleanState(false);
  const [isOpenCheckLockModal, openCheckLockModal, closeCheckLockModal] = useBooleanState(false);

  const [isClear, setIsClear] = useState<boolean>(false);
  const [isModalType, setIsModalType] = useState<ModalType>("checkDeleteStaff");
  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const [isEditing, setIsEditing] = useRecoilState(editingState);
  const selectStaffList = useRecoilState(staffListState);

  const { mutate: lockAccount } = useLockAccount();
  const { mutate: unLockAccount } = useUnLockAccount();
  const { mutate: deleteStaff } = useDeleteStaff();

  const [isSticky, setIsSticky] = useState(false);
  const editContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (editContainerRef.current) {
        const rect = editContainerRef.current.getBoundingClientRect();
        const initialPosition = editContainerRef.current.offsetTop;
        setIsSticky(rect.top <= 70 && window.scrollY > initialPosition - 70);
        if (initialPosition === 70 && window.scrollY < 155) {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (window.scrollY > 190) {
      setIsSticky(true);
    }
    if (isEditing.length === 0) {
      setIsSticky(false);
    }
  }, [isEditing]);

  const handleClear = () => {
    setIsEditing([]);
    setIsClear(true);
    setIsSticky(false);
  };

  const handleTOS = () => {
    closeTOSModal();
    openCreateStaffModal();
  };

  const handleInfoModal = (modalType: string, staffId: number[]) => {
    const lockData = {
      userIds: staffId,
      accountType: "STAFF",
    };
    switch (modalType) {
      case "edit":
        return;
      case "lock":
        unLockAccount(lockData);
        break;
      case "unlock":
        openCheckLockModal();
        break;
      case "delete":
        setIsModalType("checkDeleteStaff");
        openInfoModal();
        break;
    }
  };

  const handleLock = () => {
    lockAccount(
      { userIds: selectStaffList[0], accountType: "STAFF" },
      { onSuccess: () => closeCheckLockModal() },
    );
  };

  const handleAllLock = () => {
    const lockData = {
      userIds: selectStaffList[0],
      accountType: "STAFF",
    };
    lockAccount(lockData, {
      onSuccess: () => closeCheckLockModal(),
    });
    setIsClear(true);
  };

  const handleAllUnLock = () => {
    const lockData = {
      userIds: selectStaffList[0],
      accountType: "STAFF",
    };
    unLockAccount(lockData);
    setIsClear(true);
  };

  const handleDeleteStaff = () => {
    console.log(selectStaffList[0]);
    deleteStaff(
      { userIds: selectStaffList[0], accountType: "STAFF" },
      { onSuccess: () => closeInfoModal() },
    );
  };

  return (
    <>
      {/* 약관 동의 모달 */}
      <TOSModal open={isTOSModalOpen} onClose={closeTOSModal} onConfirm={handleTOS} />

      {/* 스태프 계정 생성 모달 */}
      <CreateStaffModal open={isCreateStaffModalOpen} onClose={closeCreateStaffModal} />

      {/* 구역 관리 하기 모달 */}
      <AreaManageModal open={isAreaManageModalOpen} onClose={closeAreaManageModal} />

      {/* 계정 관리 등 정보 모달 */}
      <InfoModal
        open={isInfoModalOpen}
        onClose={closeInfoModal}
        modalType={isModalType}
        onConfirm={() => {
          if (isModalType === "checkDeleteStaff") {
            handleDeleteStaff();
          }
        }}
      />

      {/* 비밀번호 편집 모달 */}
      <PasswordChangeModal
        open={isPWChangeModalOpen}
        onClose={() => {
          closePWChangeModal();
          setIsClear(true);
        }}
        isMultiEdit={selectStaffList[0].length === 1 ? false : true}
      />

      {/* 계정 잠금 경고 모달 */}
      <InfoModal
        open={isOpenCheckLockModal}
        onClose={closeCheckLockModal}
        modalType="checkDelete"
        leftText="취소"
        rightText="잠금"
        userType="WARD"
        onConfirm={selectStaffList[0].length === 1 ? handleLock : handleAllLock}
        message={<DeleteWarning isLock={true} />}
      />

      <BodyTitleContainer>
        <AnimatePresence mode="wait">
          {isEditing.length !== 0 ? (
            <EditContainer
              key="edit-container"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              ref={editContainerRef}
              isSticky={isSticky}
            >
              <X style={{ cursor: "pointer" }} onClick={handleClear} />
              <EditMenuText>{isEditing.length}개 항목 선택됨</EditMenuText>
              <EditMenuBox>
                <Edit
                  onClick={() => {
                    openPWChangeModal();
                  }}
                />
                <Lock onClick={openCheckLockModal} />
                <UnLock onClick={handleAllUnLock} />
                <Delete onClick={openInfoModal} />
              </EditMenuBox>
            </EditContainer>
          ) : (
            <TextContainer
              key="text-container"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <SearchBarContainer>
                <Paper
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 300,
                    border: "1px solid #ECECEC",
                    borderRadius: "6px",
                    boxShadow: "none",
                  }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="검색할 내용을 입력해주세요."
                    inputProps={{ "aria-label": "검색할 내용을 입력해주세요." }}
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        console.log(searchValue);
                      }
                    }}
                  />
                  <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                    <Search />
                  </IconButton>
                </Paper>
              </SearchBarContainer>

              <MainTitleContainer>
                <Title variant="h1">스태프 계정 수정</Title>
              </MainTitleContainer>

              <StaffButtonContainer>
                <SettingButton isClick={isSetting} onClick={() => setIsSetting(prev => !prev)}>
                  <span>설정</span>
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isSetting ? "180deg" : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ position: "absolute", right: "10px" }}
                  >
                    <DownArrow />
                  </motion.span>
                </SettingButton>
                <SettingDropdown
                  initial={{ opacity: 0, translateY: "-10px" }}
                  animate={{ opacity: isSetting ? 1 : 0, translateY: isSetting ? 0 : -10 }}
                >
                  <div
                    style={{ padding: "10px", textAlign: "center" }}
                    onClick={() => {
                      setIsSetting(false);
                      openAreaManageModal();
                    }}
                  >
                    구역 관리하기
                  </div>
                  <div
                    style={{ padding: "10px", textAlign: "center" }}
                    onClick={() => {
                      setIsSetting(false);
                      openTOSModal();
                    }}
                  >
                    스태프 계정 생성하기
                  </div>
                </SettingDropdown>
              </StaffButtonContainer>
            </TextContainer>
          )}
        </AnimatePresence>
      </BodyTitleContainer>
      <StaffAccountSettingsTable
        onManage={handleInfoModal}
        isClear={isClear}
        setIsClear={setIsClear}
      />
    </>
  );
};

/** styles */

interface SettingButtonProps {
  isClick?: boolean;
}

const BodyTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60px 0 40px 0;
`;

const TextContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 60px;
`;

const SearchBarContainer = styled.div`
  position: absolute;
  top: -5px;
`;

const MainTitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StaffButtonContainer = styled.div`
  position: absolute;
  top: -5px;
  right: 0;
  width: 146px;
  z-index: 10;
`;

const Title = styled(Typography)`
  color: #000000;
  text-transform: uppercase;
  line-height: 24px;
  letter-spacing: -3%;
`;

const EditContainer = styled(motion.div)<{ isSticky: boolean }>`
  position: ${props => (props.isSticky ? "fixed" : "relative")};
  top: ${props => (props.isSticky ? "70px" : "auto")};
  min-width: 827px;
  width: ${props => (props.isSticky ? "calc(100% - 200px)" : "100%")};
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  height: 60px;
  padding: 15px 12px;
  border: 2px solid #5d6dbe;
  border-radius: 100px;
  color: #000000;
  background-color: #ffffff;
  z-index: 10;
`;

const EditMenuText = styled(Typography)`
  text-decoration: none;
  margin-right: 30px;
`;

const EditMenuBox = styled.div`
  color: #21262b;
  display: flex;
  gap: 20px;
  cursor: pointer;
`;

const SettingButton = styled.div<SettingButtonProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 148px;
  height: 36px;
  border: 1px solid #5d6dbe;
  border-radius: ${props => (props.isClick ? "5px 5px 0 0" : "5px")};
  color: #5d6dbe;
  font-weight: 700;
  font-size: 16px;
  background-color: #ffffff;
  z-index: 21;

  &:hover {
    background-color: #f5f6ff;
  }
`;

const SettingDropdown = styled(motion.div)`
  position: absolute;

  width: 148px;
  background-color: #ffffff;
  border: 1px solid #5d6dbe;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  & > div {
    cursor: pointer;
    &:hover {
      background-color: #f5f6ff;
    }
  }
`;
