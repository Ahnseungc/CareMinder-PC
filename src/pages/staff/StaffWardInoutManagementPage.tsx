import { Box, Button, Stack, Typography, styled } from "@mui/material";
// import {SvgIcon } from "@mui/material";
import { AdminTable } from "@components/admin";
import CSwitch from "@components/common/atom/C-Switch";
import CButton from "@components/common/atom/C-Button";
import CSearchBox from "@components/common/atom/C-SearchBox";
// import { ReactComponent as ArrayIcon } from "@assets/array.svg";
import PaginationComponent from "@components/common/pagination";
import { motion, AnimatePresence } from "framer-motion";
import useGetWardTabletRequests from "@/hooks/queries/useGetStaffsTablet";
import useDischargePatients from "@hooks/mutation/usePatientsDischarge";
import { WardTabletType } from "@models/ward-tablet";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ComBoxLayout } from "@components/admin/admininout/adminTable";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { ReactComponent as StaffCancelIcon } from "@assets/staff-cancel-icon.svg";

const StaffWardInoutManagementPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const token = Cookies.get("accessTokenStaff") as string;
  const [isMyArea, setIsMyArea] = useState<boolean>(false);
  //@ts-ignore
  const [currentPage, setCurrentPage] = useState<number>(0);

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1);
  };
  //@ts-ignore
  const { data: getTablet, refetch } = useGetWardTabletRequests({
    token: token,
    patientName: searchValue,
    myArea: isMyArea,
    page: currentPage,
  });

  //@ts-ignore
  const { mutate } = useDischargePatients();
  const [selected, setSelected] = useState<
    Array<{
      name: string;
      id: number;
    }>
  >([]);

  const onChangeMyArea = () => {
    setIsMyArea(prev => !prev);
    setCurrentPage(0);
  };

  const onChangeSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(
        getTablet?.data.map(tablet => ({ name: tablet.patientName, id: tablet.tabletId })),
      );
    } else {
      setSelected([]);
    }
  };

  const onChangeSelected = (tabletId: number, patientName: string) => {
    setSelected(prev => {
      if (prev.some(item => item.id === tabletId)) {
        return prev.filter(item => item.id !== tabletId);
      } else {
        return [...prev, { name: patientName, id: tabletId }];
      }
    });
  };
  const defaultValuesUpdate: WardTabletType = {
    areaId: 0,
    tabletId: 0,
    areaName: "",
    tabletName: "",
    serialNumber: "",
    patientId: 0,
    patientName: "",
  };

  const formDischarge = useForm<WardTabletType>({
    defaultValues: defaultValuesUpdate,
    mode: "onChange",
  });

  const { handleSubmit: handleDischarge } = formDischarge;

  const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
    setCurrentPage(0);
  };

  const onDischarge: SubmitHandler<WardTabletType> = () => {
    mutate(
      { tabletIds: selected.map(item => item.id) },
      {
        onSuccess: () => {
          toast.success("퇴원 처리가 완료 되었습니다.");
          refetch();
          setSelected([]);
        },
        onError: error => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Container>
      <Title variant="h1">환자 관리</Title>
      {/* <AdminInoutSubTitleContainer>
          <AdminInoutSubTitleLeftContainer>
            <Subtitle variant="h2">내 구역 테블릿 리스트</Subtitle>
            <div>
              <CSwitch onChange={onChangeMyArea} />
            </div>
          </AdminInoutSubTitleLeftContainer>
          <AdminInoutSubTitleRightContainer>
            <SearchLayout>
              <CSearchBox
                value={searchValue}
                onChange={onChangeSearchValue}
                placeholder={"환자 이름을 검색해 주세요."}
                borderColor={"#ECECEC"}
              />
            </SearchLayout>
            <ButtonLayout>
              <CButton buttontype={"primarySpaure"} onClick={handleDischarge(onDischarge)}>
                퇴원 처리
              </CButton>
            </ButtonLayout>
          </AdminInoutSubTitleRightContainer>
        </AdminInoutSubTitleContainer> */}

      <AnimatePresence mode="wait">
        {selected.length > 0 ? (
          <motion.div
            key="selected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <SelectedActionBox>
              <div style={{ display: "flex", alignItems: "center", paddingLeft: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <Button onClick={() => setSelected([])}>
                    <StaffCancelIcon />
                  </Button>
                  <Text>{selected.length}항목 선택됨</Text>
                </div>
                <div style={{ display: "flex", marginLeft: 60, gap: 24 }}>
                  <ComBoxLayout width={"192px"}>
                    <CComboBox
                      placeholder={"구역"}
                      options={[]}
                      value={"테스트"}
                      onChange={() => null}
                    />
                  </ComBoxLayout>
                  <ComBoxLayout width={"160px"}>
                    <CComboBox
                      placeholder={"구역"}
                      options={[]}
                      value={"테스트"}
                      onChange={() => null}
                    />
                  </ComBoxLayout>
                  <CButton buttontype={"impactRed"}>환자 퇴원 처리</CButton>
                </div>
              </div>
            </SelectedActionBox>
          </motion.div>
        ) : (
          <motion.div
            key="nan-selected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <NanSelectedActionBox>
              <SearchLayout>
                <CSearchBox
                  value={searchValue}
                  onChange={onChangeSearchValue}
                  placeholder={"환자 이름을 검색해 주세요."}
                  borderColor={"#ECECEC"}
                />
              </SearchLayout>

              <ButtonLayout>
                <CButton buttontype={"primarySpaure"} onClick={handleDischarge(onDischarge)}>
                  설정
                </CButton>
              </ButtonLayout>
            </NanSelectedActionBox>
          </motion.div>
        )}
      </AnimatePresence>

      <TableLayout>
        <AdminTable
          getTablet={getTablet?.data}
          onChangeSelected={onChangeSelected}
          onCHangeSelectAll={onChangeSelectAll}
          selected={selected}
        />
      </TableLayout>
      <FooterLayout>
        <div>
          <PaginationComponent
            totalPage={getTablet?.totalPages}
            onChange={(e, page) => handleChangePage(e, page)}
          />
        </div>
      </FooterLayout>
    </Container>
  );
};

export default StaffWardInoutManagementPage;

/** styles */

const Container = styled(Stack)({
  height: "100%",
});

const TableLayout = styled(Box)({
  marginTop: "40.5px",
});

const FooterLayout = styled(Box)({
  paddingTop: "61.27px",
  // paddingBottom: "48.73px",
  display: "flex",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  letterSpacing: "-3%",
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "24px",
  fontSize: "16px",
  letterSpacing: "-3%",
}));

const SelectedActionBox = styled(Box)(({ theme }) => ({
  width: "100%",
  borderRadius: 100,
  paddingTop: 12,
  paddingBottom: 8,
  borderColor: theme.palette.secondary.main,
  borderWidth: 2,
  borderStyle: "solid",
  display: "flex",
  alignItems: "center",
  marginTop: 23.5,
}));

const NanSelectedActionBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  paddingTop: 12,
  paddingBottom: 8,
  marginTop: 23.5,
  borderColor: "white",
  borderWidth: 2,
  borderStyle: "solid",
  alignItems: "center",
  justifyContent: "space-between",
}));

const SearchLayout = styled(Box)({
  width: "373px",
});
const ButtonLayout = styled(Box)({
  width: "148px",
});
