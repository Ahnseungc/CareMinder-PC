import { Box, styled } from "@mui/system";
import StaffAccountSettingsTable from "@components/settings/StaffAccountSettingsTable";
import { Typography } from "@mui/material";
import { useBooleanState } from "@toss/react";
import { useEffect, useRef, useState } from "react";
import InfoModal, { ModalType } from "@components/settings/modal/InfoModal";
import TOSModal from "@components/settings/modal/TOSModal";
import { useRecoilState } from "recoil";
import { editingState, staffListState } from "@libraries/recoil";

import { ReactComponent as X } from "@/assets/x-Icon.svg";
// import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Lock } from "@/assets/completedRequests/Interface essential/Lock.svg";
import { ReactComponent as UnLock } from "@/assets/completedRequests/Interface essential/Unlock.svg";
import { ReactComponent as Delete } from "@/assets/completedRequests/accountDelete.svg";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";

import PasswordChangeModal from "@components/settings/modal/PasswordChangeModal";
import useLockAccount from "@hooks/mutation/useLockAccount";
import useUnLockAccount from "@hooks/mutation/useUnLockAccount";
import { useGetAreaList } from "@hooks/queries/useGetAreaList";
import CreateStaffModal from "@components/settings/modal/CreateStaffModal";
import AreaManageModal from "./modal/AreaManageModal";

// import { CComboBox } from "@components/common/atom/C-ComboBox";
// import { OPTIONS } from "@components/settings/const/index";
// import { toast } from "react-toastify";
// import useChangeStaffRole from "@hooks/mutation/useChangeRole";
// import useChangeStaffArea from "@hooks/mutation/useChangeArea";

interface SettingButtonProps {
  isClick?: boolean;
}

export const StaffAccount = () => {
  const [isTOSModalOpen, openTOSModal, closeTOSModal] = useBooleanState(false);
  const [isCreateStaffModalOpen, openCreateStaffModal, closeCreateStaffModal] =
    useBooleanState(false);
  const [isInfoModalOpen, openInfoModal, closeInfoModal] = useBooleanState(false);
  const [isPWChangeModalOpen, openPWChangeModal, closePWChangeModal] = useBooleanState(false);
  const [isAreaManageModalOpen, openAreaManageModal, closeAreaManageModal] = useBooleanState(false);

  const [isClear, setIsClear] = useState<boolean>(false);
  const [isModalType, setIsModalType] = useState<ModalType>("checkDeleteStaff");
  const [_, setArea] = useState<string[]>([""]);
  const [isSetting, setIsSetting] = useState<boolean>(false);

  const [isEditing, setIsEditing] = useRecoilState(editingState);
  const selectStaffList = useRecoilState(staffListState);

  const { data: areaList } = useGetAreaList();

  const { mutate: lockAccount } = useLockAccount();
  const { mutate: unLockAccount } = useUnLockAccount();
  // const { mutate: changeStaffRole } = useChangeStaffRole();
  // const { mutate: changeStaffArea } = useChangeStaffArea();

  const [isSticky, setIsSticky] = useState(false);
  const editContainerRef = useRef<HTMLDivElement>(null);
  const settingRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (areaList) {
      setArea(areaList.map(item => item.name));
    }
  }, [areaList]);

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
    };
    switch (modalType) {
      case "edit":
        return;
      case "lock":
        unLockAccount(lockData);
        break;
      case "unlock":
        lockAccount(lockData);
        break;
      case "delete":
        setIsModalType("checkDeleteStaff");
        openInfoModal();
        break;
    }
  };

  // const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   const staffRole = OPTIONS.find(item => item.value === value)?.role as string;

  //   changeStaffRole(
  //     {
  //       userIds: selectStaffList[0],
  //       staffRole: staffRole,
  //     },
  //     {
  //       onSuccess: () => {
  //         setIsClear(true);
  //         toast.success("직업 변경이 완료되었습니다");
  //       },
  //       onError: () => {
  //         toast.error("직업 변경을 실패했습니다");
  //       },
  //     },
  //   );
  // };

  // const handleChangeArea = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   const areaId = areaList?.find(item => item.name === value)?.id as number;
  //   console.log(areaId);
  //   changeStaffArea(
  //     {
  //       userIds: selectStaffList[0],
  //       areaId: areaId,
  //     },
  //     {
  //       onSuccess: () => {
  //         setIsClear(true);
  //         toast.success("구역 변경이 완료되었습니다");
  //       },
  //       onError: () => {
  //         toast.error("구역 변경을 실패했습니다");
  //       },
  //     },
  //   );
  // };

  const handleAllLock = () => {
    const lockData = {
      userIds: selectStaffList[0],
    };
    lockAccount(lockData);
    setIsClear(true);
  };

  const handleAllUnLock = () => {
    const lockData = {
      userIds: selectStaffList[0],
    };
    unLockAccount(lockData);
    setIsClear(true);
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
        onConfirm={() => null}
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

      <BodyTitleContainer>
        {isEditing.length !== 0 ? (
          <EditContainer
            ref={editContainerRef}
            style={{
              position: isSticky ? "fixed" : "relative",
              top: isSticky ? "70px" : "auto",
              zIndex: isSticky ? 10 : "auto",
              width: isSticky ? "calc(100% - 200px)" : "100%",
            }}
          >
            <X style={{ cursor: "pointer" }} onClick={handleClear} />
            <EditMenu sx={{ marginRight: "60px", textDecoration: "none" }}>
              {isEditing.length}개 항목 선택됨
            </EditMenu>
            {/* <div style={{ width: "138px", height: "36px" }}>
              <CComboBox
                placeholder={"직업"}
                options={OPTIONS.map(option => option.value)}
                value={""}
                onChange={handleChangeRole}
              />
            </div>
            <div style={{ width: "224px", height: "36px" }}>
              <CComboBox
                placeholder={"구역"}
                options={area}
                value={""}
                onChange={handleChangeArea}
              />
            </div> */}
            <div style={{ color: "#21262B", display: "flex", gap: "20px", cursor: "pointer" }}>
              <span
                style={
                  {
                    // color: selectStaffList[0].length === 1 ? "#C4C5CC" : "",
                    // cursor: selectStaffList[0].length === 1 ? "not-allowed" : "pointer",
                  }
                }
              >
                <Edit
                  onClick={() => {
                    openPWChangeModal();
                    // if (selectStaffList[0].length !== 1) {
                    //   openPWChangeModal();
                    // }
                  }}
                />
              </span>
              <Lock onClick={handleAllLock} />
              <UnLock onClick={handleAllUnLock} />
              <Delete />
            </div>
          </EditContainer>
        ) : (
          <>
            {/* <Paper
              component="form"
              sx={{
                position: "absolute",
                left: 0,
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
            </Paper> */}
            <div>
              <Title variant="h1">스태프 계정 수정</Title>
            </div>
            <StaffButtonContainer>
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
                )}
              </div>
            </StaffButtonContainer>
          </>
        )}
      </BodyTitleContainer>
      <>
        <StaffAccountSettingsTable
          onManage={handleInfoModal}
          isClear={isClear}
          setIsClear={setIsClear}
        />
      </>
    </>
  );
};

/** styles */

const BodyTitleContainer = styled(Box)({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const StaffButtonContainer = styled(Box)({
  position: "absolute",
  right: 0,
  display: "flex",
  gap: "20px",
  width: "146px",
  zIndex: 10,
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const EditContainer = styled(Box)(({ theme }) => ({
  position: "sticky",
  minWidth: "827px",
  width: "100%",

  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: "20px",

  height: "60px",
  padding: "15px 12px",

  border: "2px solid #5D6DBE",
  borderRadius: "100px",

  color: theme.palette.text.dark,
  backgroundColor: "#FFFFFF",
  zIndex: 10,
}));

const EditMenu = styled(Typography)({
  textDecoration: "underline",
});

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
  "border": "1px solid #5D6DBE",
  "borderRadius": isClick ? "5px 5px 0 0" : "5px",
  "color": "#5D6DBE",
  "fontWeight": 700,
  "fontSize": "16px",
  "backgroundColor": "#FFFFFF",
  "zIndex": 21,
  "&:hover": {
    backgroundColor: "#F5F6FF",
  },
}));

const SettingDropdown = styled(Box)({
  "position": "absolute",
  "top": "100%",
  "right": 0,
  "width": "148px",
  "backgroundColor": "#FFFFFF",
  "border": "1px solid #5D6DBE",
  "borderTop": "none",
  "borderBottomLeftRadius": "5px",
  "borderBottomRightRadius": "5px",
  "boxShadow": "0 4px 6px rgba(0, 0, 0, 0.1)",
  "& > div": {
    "cursor": "pointer",
    "&:hover": {
      backgroundColor: "#F5F6FF",
    },
  },
});
