import styled from "@emotion/styled";
import { IconButton, InputBase, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useBooleanState } from "@toss/react";
import { AnimatePresence, motion } from "framer-motion";

import { ReactComponent as X } from "@/assets/x-Icon.svg";
import { ReactComponent as Edit } from "@/assets/accountEdit.svg";
import { ReactComponent as Search } from "@/assets/serachIcons/search-gray.svg";

import TabletManagementTable from "@components/settings/TabletManagementTable";
import tabletEditingState from "@libraries/recoil/settings/tabletEdit";
import InfoModal from "./modal/InfoModal";
import EditTableInfoModal from "./modal/EditTabletInfoModal";
import TabletLogoutWarning from "./TabletLogoutWarning";
import palette from "@styles/palette";
import useDebounce from "@utils/useDebounce";

//태블릿 병상 관리

export const TabletManagement = () => {
  const editContainerRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useRecoilState(tabletEditingState);

  const [isSticky, setIsSticky] = useState(false);
  const [isClear, setIsClear] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const [isLogoutModalOpen, openLogoutModal, closeLogoutModal] = useBooleanState();
  const [isTabletEditModalOpen, openTabletEditModal, closeTabletEditModal] = useBooleanState();

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

  return (
    <>
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
                <Edit onClick={openTabletEditModal} />
                <LogoutButton onClick={openLogoutModal}>환자로그아웃</LogoutButton>
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
                    placeholder="환자 이름을 검색해주세요."
                    inputProps={{ "aria-label": "환자 이름을 검색해주세요." }}
                    value={searchValue}
                    onChange={e => {
                      setSearchValue(e.target.value);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
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
                <Title variant="h1">태블릿 병상 관리</Title>
              </MainTitleContainer>
            </TextContainer>
          )}
        </AnimatePresence>
      </BodyTitleContainer>
      <TabletManagementTable
        isClear={isClear}
        setIsClear={setIsClear}
        searchValue={debouncedSearchValue}
      />
    </>
  );
};

/** styles */

export interface StyledContainerProps {
  isSticky?: boolean;
}

const BodyTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 60px 0 40px 0;
  position: relative;
  min-height: 60px;
`;

const TextContainer = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 60px;
`;

const SearchBarContainer = styled.div`
  position: absolute;
  top: -5;
  left: 0;
`;

export const EditContainer = styled(motion.div)<StyledContainerProps>`
  position: ${props => (props.isSticky ? "fixed" : "absolute")};
  top: ${props => (props.isSticky ? "70px" : "0")};
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
  margin-right: 60px;
`;

const EditMenuBox = styled.div`
  color: ${palette.primary.main};
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
`;

const LogoutButton = styled.div`
  padding: 8px 20px;
  border-radius: 100px;
  background-color: ${palette.primary.main};
  color: ${palette.secondary.contrastText};
  font-weight: 700;
  &:hover {
    opacity: 0.9;
    transition: ease-in 0.2s;
  }
`;

const MainTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Typography)`
  color: #000000;
  text-transform: uppercase;
  line-height: 24px;
  letter-spacing: -3%;
`;
