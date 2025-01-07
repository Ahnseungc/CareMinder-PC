import { Box, styled } from "@mui/system";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as DownArrow } from "@assets/downarrow-middle-icon.svg";
import { ReactComponent as Leave } from "@/assets/Leave.svg";
import { ReactComponent as Alert } from "@/assets/Info_Mode.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";
import TabletManagementTable from "@components/settings/TabletManagementTable";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import tabletEditingState from "@libraries/recoil/settings/tabletEdit";
import TabletSleepModeModal from "./modal/TabletSleepModeModal";
import { useBooleanState } from "@toss/react";
import InfoModal from "./modal/InfoModal";
import TabletLogoutWarning from "./TabletLogoutWarning";
import EditTableInfoModal from "./modal/EditTabletInfoModal";

//태블릿 병상 관리

interface SettingButtonProps {
  isClick?: boolean;
}

export const TabletManagement = () => {
  const settingRef = useRef<HTMLDivElement>(null);
  const editContainerRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useRecoilState(tabletEditingState);

  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isClear, setIsClear] = useState<boolean>(false);

  const [isModalOpen, openModalOpen, closeModalOpen] = useBooleanState();
  const [isLogoutModalOpen, openLogoutModal, closeLogoutModal] = useBooleanState();
  const [isTabletEditModalOpen, openTabletEditModal, closeTabletEditModal] = useBooleanState();

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
        // console.log(rect.top);
        const initialPosition = editContainerRef.current.offsetTop;
        // console.log("초기 위치:", initialPosition, "스크롤위치:", window.scrollY);

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

  return (
    <>
      {/* 수면 모드 설정 모달 */}
      <TabletSleepModeModal open={isModalOpen} onClose={closeModalOpen} />

      {/* 태블릿 로그아웃 설정 모달 */}
      <InfoModal
        open={isLogoutModalOpen}
        onClose={closeLogoutModal}
        modalType="checkDelete"
        leftText="취소"
        rightText="중단"
        userType={"WARD"}
        onConfirm={() => null}
        message={<TabletLogoutWarning />}
      />

      {/* 태블릿 정보 변경 설정 모달 */}

      <EditTableInfoModal
        open={isTabletEditModalOpen}
        onClose={closeTabletEditModal}
        tabletData={null}
      />

      <BodyTitleContainer>
        {isEditing.length !== 0 ? (
          <EditContainer ref={editContainerRef} isSticky={isSticky}>
            <X style={{ cursor: "pointer" }} onClick={handleClear} />
            <EditMenuText>{isEditing.length}개 항목 선택됨</EditMenuText>
            <EditMenuBox>
              <Edit onClick={openTabletEditModal} />
              <Leave onClick={openLogoutModal} />
            </EditMenuBox>
          </EditContainer>
        ) : (
          <TextContainer>
            <SearchBarContainer>
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
            </SearchBarContainer>
            <MainTitleContainer>
              <Title variant="h1">태블릿 병상 관리</Title>
            </MainTitleContainer>
            <ModeInfoText>
              현재 <span>전체가능</span> 모드입니다. 4시간 후 강제종료 모드로 전환됩니다.
            </ModeInfoText>

            <StaffButtonContainer>
              <SettingBox ref={settingRef}>
                <SettingButton isClick={isSetting} onClick={() => setIsSetting(prev => !prev)}>
                  <span>설정</span>
                  <DownArrowSpan>
                    <DownArrow style={{ transform: isSetting ? "rotate(180deg)" : "none" }} />
                  </DownArrowSpan>
                </SettingButton>
                {isSetting && (
                  <SettingDropdown>
                    <div
                      onClick={() => {
                        setIsSetting(false);
                        openModalOpen();
                      }}
                    >
                      수면 모드 설정하기
                    </div>
                  </SettingDropdown>
                )}
                <ModeInfoContainer>
                  <ModeInfoHideBox>
                    <Alert />
                  </ModeInfoHideBox>
                  <ModeInfoHideContent>
                    현재 <span>&nbsp;전체가능&nbsp;</span> 모드입니다. 4시간 후 강제종료 모드로
                    전환됩니다.
                  </ModeInfoHideContent>
                </ModeInfoContainer>
              </SettingBox>
            </StaffButtonContainer>
          </TextContainer>
        )}
      </BodyTitleContainer>
      <TabletManagementTable isClear={isClear} setIsClear={setIsClear} />
    </>
  );
};

const BodyTitleContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "60px 0 40px 0",
});

const EditContainer = styled(Box, {
  shouldForwardProp: prop => prop !== "isSticky",
})<{ isSticky: boolean }>(({ theme, isSticky }) => ({
  position: isSticky ? "fixed" : "relative",
  top: isSticky ? "70px" : "auto",
  minWidth: "827px",
  width: isSticky ? "calc(100% - 200px)" : "100%",
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

const TextContainer = styled(Box)({
  width: "100%",
  height: "60px",
});

const SearchBarContainer = styled(Box)({
  position: "absolute",
  left: 130,
});

const EditMenuText = styled(Typography)({
  textDecoration: "none",
  marginRight: "60px",
});

const EditMenuBox = styled(Box)({
  color: "#21262B",
  display: "flex",
  gap: "20px",
  cursor: "pointer",
});

const MainTitleContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const SettingBox = styled(Box)({
  position: "relative",
});

const DownArrowSpan = styled(Typography)({
  position: "absolute",
  right: "10px",
});

const ModeInfoContainer = styled(Box)({
  position: "absolute",
  left: "-250px",
  top: "18px",
});

const ModeInfoText = styled(Typography)`
  position: absolute;
  top: 260px;
  right: 240px;
  font-size: 16px;
  font-weight: 500;
  color: #7c7c7c;

  & span {
    color: #04b300;
  }

  @media (max-width: 1500px) {
    font-size: 12px;
  }

  @media (max-width: 1300px) {
    display: none;
  }
`;

const ModeInfoHideBox = styled(Box)`
  display: flex;
  align-items: center;
  visibility: hidden;
  position: absolute;
  top: -10px;
  right: -230px;
  & :hover {
    cursor: pointer;
  }
  @media (max-width: 1300px) {
    visibility: visible;
  }

  &:hover + div {
    display: flex;
  }
`;

const ModeInfoHideContent = styled(Box)`
  position: absolute;
  top: 15px;
  right: -300px;
  z-index: 9999;

  display: none;
  justify-content: center;
  align-items: center;

  width: 320px;
  padding: 10px;

  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  font-size: 12px;
  font-weight: 500;
  color: #7c7c7c;
  & span {
    color: #04b300;
  }
`;

const StaffButtonContainer = styled(Box)`
  position: absolute;
  top: 250px;
  right: 80px;
  display: flex;
  gap: 20px;
  width: 146px;
  z-index: 10;
`;

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
    "padding": "10px",
    "textAlign": "center",
    "&:hover": {
      backgroundColor: "#F5F6FF",
    },
  },
});
