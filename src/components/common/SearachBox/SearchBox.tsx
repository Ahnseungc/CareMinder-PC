import { Box, Input, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "./const/useDebounce";
import { ListBoxProps, SearchInputProps } from "@models/search";

import { ReactComponent as Search } from "@/assets/serachIcons/search.svg";
import { ReactComponent as User } from "@/assets/serachIcons/user.svg";
import { ReactComponent as DownArrow } from "@/assets/serachIcons/DownArrow.svg";
import { ReactComponent as UpArrow } from "@/assets/serachIcons/UpArrow.svg";

//staff
import { ReactComponent as UserStaff } from "@/assets/serachIcons/user-staff.svg";
import { ReactComponent as UserSearch } from "@/assets/serachIcons/search-staff.svg";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { modalState, userState } from "@libraries/recoil";
import { StaffSimpleListType, useGetStaffSimpleList } from "@hooks/queries/useGetStaffSimpleList";
import autoCompleteIdState from "@libraries/recoil/autoCompleteId";

export default function SearchBox() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);

  const [nurses, setNurses] = useState<StaffSimpleListType[]>([]);
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query, 1000);

  const [selectedNurse, setSelectedNurse] = useState<string>("");
  const user = useRecoilValue(userState);
  const setIsModalOpen = useSetRecoilState(modalState);
  const setAutoCompleteId = useSetRecoilState(autoCompleteIdState);

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: staffList } = useGetStaffSimpleList();

  useEffect(() => {
    if (staffList?.data) {
      setNurses(staffList.data);
    }
  }, [staffList]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (!staffList?.data) {
      return;
    }

    if (searchQuery === "") {
      setNurses(staffList.data);
      return;
    }

    const filteredNurses = staffList.data.filter(nurse =>
      nurse.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setNurses(filteredNurses);
  };

  const toggleList = () => {
    if (!isOpen && staffList?.data) {
      setNurses(staffList.data);
    }
    setIsOpen(prev => !prev);
  };

  const selectNurse = (nurseName: string) => {
    setSelectedNurse(nurseName);
    setIsOpen(false);
    setQuery("");
    setIsModalOpen(true);
    setAutoCompleteId(nurses.find(nurse => nurse.name === nurseName)?.loginId as string);
  };

  const fetchNurses = async (query: string): Promise<StaffSimpleListType[]> => {
    return nurses.filter(nurse => nurse.name.includes(query));
  };

  useEffect(() => {
    const searchNurses = async () => {
      if (!staffList?.data) {
        return;
      }
      setSearching(true);
      if (debouncedQuery) {
        // console.log(debouncedQuery);
        const fetchedNurses = await fetchNurses(debouncedQuery);
        setNurses(fetchedNurses);
      } else {
        setNurses(staffList.data);
      }
      setSearching(false);
    };

    searchNurses();
  }, [debouncedQuery, staffList]);

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  return (
    <>
      <SearchInputWrapper>
        <SearchInput
          ref={inputRef}
          type="search"
          value={query}
          onChange={searchHandler}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsOpen(false);
            }, 200);
          }}
          placeholder="스태프 선택"
          disableUnderline={true}
          startAdornment={
            <ListBox onClick={toggleList} isEmpty={selectedNurse}>
              {user?.type === "WARD" ? (
                <User style={{ marginBottom: "2px" }} />
              ) : (
                <UserStaff style={{ marginBottom: "2px" }} />
              )}
              {selectedNurse === "" ? null : (
                <>
                  {" "}
                  <span>{selectedNurse}</span>
                  {isOpen ? <UpArrow /> : <DownArrow />}
                </>
              )}
            </ListBox>
          }
          endAdornment={
            user?.type === "WARD" ? (
              <Search style={{ cursor: "pointer" }} />
            ) : (
              <UserSearch style={{ cursor: "pointer" }} />
            )
          }
          isOpen={isOpen}
        />
        {isOpen && (
          <StaffList>
            {searching ? (
              <span>검색중..</span>
            ) : (
              <>
                {nurses.length === 0 ? (
                  <NoSearchStaff>검색 결과 없음</NoSearchStaff>
                ) : (
                  nurses.map((nurse, index) => (
                    <Staff
                      key={index}
                      onMouseDown={() => {
                        selectNurse(nurse.name);
                        setIsModalOpen(true);
                      }}
                    >
                      {nurse.name}
                    </Staff>
                  ))
                )}
              </>
            )}
          </StaffList>
        )}
      </SearchInputWrapper>
    </>
  );
}

const SearchInputWrapper = styled(Box)({
  position: "absolute",
  right: "-20px",
  top: "-4px",
});

const SearchInput = styled(Input, {
  shouldForwardProp: prop => prop !== "isOpen",
})<SearchInputProps>(({ theme, isOpen }) => ({
  position: "relative",
  width: "373px",
  minHeight: "36px",
  border: "none",
  borderRadius: "20px",
  padding: isOpen ? "7.9px 15px 178px 15px" : "7.9px 15px",
  transition: "padding 0.3s ease-in-out",
  backgroundColor: theme.palette.background.paper,
}));

const ListBox = styled(Box, {
  shouldForwardProp: prop => prop !== "isEmpty",
})<ListBoxProps>(({ isEmpty }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: isEmpty !== "" ? "220px" : "30px",
  cursor: "pointer",
}));

const StaffList = styled(Box)(({ theme }) => ({
  "display": "flex",
  "flexDirection": "column",
  "gap": "10px",
  "position": "absolute",
  "top": "40px",
  "width": "320px",
  "height": "160px",
  "marginLeft": "36px",
  "overflowY": "auto",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.background.default,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.primary.main,
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: theme.palette.primary.light,
  },
  "opacity": 0,
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "animation": "fadeIn 0.6s ease-in-out forwards",
}));

const Staff = styled(Box)(({ theme }) => ({
  "cursor": "pointer",
  "width": "86px",
  "height": "20px",
  ":hover": {
    color: theme.palette.text.secondary,
  },
}));

const NoSearchStaff = styled(Box)({
  width: "86px",
  height: "20px",
});
