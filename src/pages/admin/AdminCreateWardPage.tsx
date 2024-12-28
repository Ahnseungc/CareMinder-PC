import { Box, IconButton, InputBase, Paper, Stack, styled, Typography } from "@mui/material";
import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as UnLock } from "@/assets/completedRequests/Interface essential/Unlock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { useBooleanState } from "@toss/react";
import CreateWardModal from "@components/admin/adminModal/CreateWardModal";
import useLockAccount from "@hooks/mutation/useLockAccount";
import useUnLockAccount from "@hooks/mutation/useUnLockAccount";
import { useEffect, useRef, useState } from "react";
import WardAccountSettingsTable from "@components/signin/admin/AdminWardManage/WardAccountSettingsTable";
import { useRecoilState, useRecoilValue } from "recoil";
import wardEditingState from "@libraries/recoil/wardEdit";
import AreaManageModal from "@components/settings/modal/AreaManageModal";
import wardListState from "@libraries/recoil/wardList";
import InfoModal from "@components/settings/modal/InfoModal";
import DeleteWarning from "@components/settings/areaManage/DeleteWarning";

export default function AdminCreateWardPage() {
  const [isClear, setIsClear] = useState<boolean>(false);
  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState(false);

  const [open, openCreateModal, closeCreateModal] = useBooleanState(false);
  const [isAreaManageModalOpen, openAreaManageModal, closeAreaManageModal] = useBooleanState(false);
  const [isOpenCheckLockModal, openCheckLockModal, closeCheckLockModal] = useBooleanState();
  const [isOpenSuccessLockModal, openSuccessLockModal, closeSuccessLockModal] = useBooleanState();

  const [isEditing, setIsEditing] = useRecoilState(wardEditingState);
  const selectedWardList = useRecoilValue(wardListState);

  const editContainerRef = useRef<HTMLDivElement>(null);
  const settingRef = useRef<HTMLDivElement>(null);

  const { mutate: lockAccount } = useLockAccount();
  const { mutate: unLockAccount } = useUnLockAccount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingRef.current && !settingRef.current.contains(event.target as Node)) {
        setIsSetting(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (editContainerRef.current) {
        const rect = editContainerRef.current.getBoundingClientRect();
        const initialPosition = editContainerRef.current.offsetTop;
        setIsSticky(rect.top <= 70 && window.scrollY > initialPosition);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClear = () => {
    setIsEditing([]);
    setIsClear(true);
    setIsSticky(false);
  };

  const handleInfoModal = (modalType: string, wardId: number[]) => {
    const lockData = {
      userIds: wardId,
      accountType: "WARD",
    };
    switch (modalType) {
      case "edit":
        return;
      case "lock":
        unLockAccount(lockData);
        break;
      case "unlock":
        openCheckLockModal();
        // lockAccount(lockData);
        break;
      case "delete":
        // setIsModalType("checkDeleteStaff");
        // openInfoModal();
        break;
    }
  };

  const handleLock = () => {
    console.log(selectedWardList);
    lockAccount(
      {
        userIds: selectedWardList,
        accountType: "WARD",
      },
      {
        onSuccess: () => {
          closeCheckLockModal();
          openSuccessLockModal();
        },
      },
    );
  };

  const handleAllLock = () => {
    console.log(selectedWardList);
    const lockData = {
      userIds: selectedWardList,
      accountType: "WARD",
    };
    lockAccount(lockData, {
      onSuccess: () => {
        openSuccessLockModal();
        closeCheckLockModal();
      },
    });
    setIsClear(true);
  };

  const handleAllUnLock = () => {
    const lockData = {
      userIds: selectedWardList,
      accountType: "WARD",
    };
    unLockAccount(lockData);
    setIsClear(true);
  };

  return (
    <>
      {/* 병동 계정 생성 모달 */}
      <CreateWardModal open={open} onClose={closeCreateModal} />

      {/* 구역 관리 하기 모달 */}
      <AreaManageModal
        open={isAreaManageModalOpen}
        onClose={closeAreaManageModal}
        title="병동/구역 관리하기"
        isAdmin={true}
      />

      {/* 계정 잠금 경고 모달 */}
      <InfoModal
        open={isOpenCheckLockModal}
        onClose={closeCheckLockModal}
        modalType="checkDelete"
        leftText="취소"
        rightText="잠금"
        userType="ADMIN"
        onConfirm={selectedWardList.length === 1 ? handleLock : handleAllLock}
        message={<DeleteWarning isLock={true} />}
      />

      {/* 계정 잠금 처리 확인 모달 */}
      <InfoModal
        open={isOpenSuccessLockModal}
        onClose={closeSuccessLockModal}
        modalType="successAccountLock"
        userType="ADMIN"
      />

      <Container>
        <HeadContainer>
          <div>
            <Title variant="h1">병동 계정 관리</Title>
          </div>
          {isEditing.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 400,
                  border: "1px solid #ECECEC",
                  borderRadius: "6px",
                  boxShadow: "none",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="검색할 내용을 입력해주세요."
                  inputProps={{ "aria-label": "검색할 내용을 입력해주세요." }}
                />
                <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                  <Search />
                </IconButton>
              </Paper>
              <div ref={settingRef} style={{ position: "relative" }}>
                <SettingButton isClick={isSetting} onClick={() => setIsSetting(prev => !prev)}>
                  <span>설정</span>
                  <span style={{ position: "absolute", right: "10px" }}>
                    <DownArrow style={{ transform: isSetting ? "rotate(180deg)" : "none" }} />
                  </span>
                </SettingButton>
                {isSetting && (
                  <SettingDropdown>
                    <div
                      style={{ padding: "10px", textAlign: "center" }}
                      onClick={() => {
                        openCreateModal();
                        setIsSetting(false);
                      }}
                    >
                      병동 계정 생성하기
                    </div>
                    <div
                      style={{ padding: "10px", textAlign: "center" }}
                      onClick={() => {
                        openAreaManageModal();
                        setIsSetting(false);
                      }}
                    >
                      병동/구역 관리하기
                    </div>
                  </SettingDropdown>
                )}
              </div>
            </div>
          ) : (
            <EditContainer
              ref={editContainerRef}
              style={{
                position: isSticky ? "fixed" : "relative",
                top: isSticky ? "70px" : "30px",
                zIndex: isSticky ? 10 : "auto",
                width: isSticky ? "calc(100% - 200px)" : "100%",
              }}
            >
              <X style={{ cursor: "pointer" }} onClick={handleClear} />
              <EditMenu sx={{ marginRight: "60px", textDecoration: "none" }}>
                {isEditing.length}개 항목 선택됨
              </EditMenu>
              <div style={{ color: "#21262B", display: "flex", gap: "20px", cursor: "pointer" }}>
                <span>
                  <Edit onClick={() => null} />
                </span>
                <Lock onClick={openCheckLockModal} />
                <UnLock onClick={handleAllUnLock} />
                <Delete />
              </div>
            </EditContainer>
          )}
        </HeadContainer>
        <BodyContainer>
          <WardAccountSettingsTable
            onManage={handleInfoModal}
            isClear={isClear}
            setIsClear={setIsClear}
          />
        </BodyContainer>
      </Container>
    </>
  );
}
const Container = styled(Stack)({
  height: "100%",
  padding: "31.6px 0",
});

const HeadContainer = styled(Stack)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "start",

  marginBottom: "48px",
});

const EditContainer = styled(Box)({
  position: "sticky",
  minWidth: "827px",
  width: "100%",

  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "20px",

  height: "60px",
  padding: "15px 12px",
  marginBottom: "23px",

  border: "2px solid #5DB8BE",
  borderRadius: "100px",

  backgroundColor: "#FFFFFF",
  zIndex: 10,
});

const EditMenu = styled(Typography)({
  textDecoration: "underline",
});

const BodyContainer = styled(Box)({
  marginBottom: "32px",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

interface SettingButtonProps {
  isClick?: boolean;
}

const SettingButton = styled(Box, {
  shouldForwardProp: prop => prop !== "isClick",
})<SettingButtonProps>(({ isClick }) => ({
  "position": "relative",
  "display": "flex",
  "justifyContent": "center",
  "alignItems": "center",
  "cursor": "pointer",
  "width": "148px",
  "height": "36px",
  "border": "1px solid #5DB8BE",
  "borderRadius": isClick ? "5px 5px 0 0" : "5px",
  "color": "#5DB8BE",
  "fontWeight": 700,
  "fontSize": "16px",
  "backgroundColor": "#FFFFFF",
  "zIndex": 21,
  "&:hover": {
    backgroundColor: "#5DB8BE33",
  },
}));

const SettingDropdown = styled(Box)({
  "position": "absolute",
  "right": 0,
  "zIndex": "9999",
  "width": "148px",
  "backgroundColor": "#FFFFFF",
  "border": "1px solid #5DB8BE",
  "borderTop": "none",
  "borderBottomLeftRadius": "5px",
  "borderBottomRightRadius": "5px",
  "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
  "& > div": {
    "cursor": "pointer",
    "&:hover": {
      backgroundColor: "#5DB8BE33",
    },
  },
});
