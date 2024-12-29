import { Box, Button, Stack, Typography, styled } from "@mui/material";
import { AdminTable } from "@components/admin";
import CButton from "@components/common/atom/C-Button";
import CSearchBox from "@components/common/atom/C-SearchBox";
import PaginationComponent from "@components/common/pagination";
import { motion, AnimatePresence } from "framer-motion";
import useGetWardTabletRequests from "@/hooks/queries/useGetStaffsTablet";
import useDischargePatients from "@hooks/mutation/usePatientsDischarge";
import { WardTabletType } from "@models/ward-tablet";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { ComBoxLayout } from "@components/admin/admininout/adminTable";
import { CComboBox } from "@components/common/atom/C-ComboBox";
import { ReactComponent as StaffCancelIcon } from "@assets/staff-cancel-icon.svg";
// import { ReactComponent as DrowDownIcon } from "@assets/dropdown-bottom.svg";
// import { ReactComponent as CalendarIcon } from "@assets/calendar/calendar-icon.svg";
// import CCalendar, { Value } from "@components/common/atom/Calendar/C-Calendar";
import { Value } from "@components/common/atom/Calendar/C-Calendar";
// import { formatDateYYYYMMDD } from "@utils/getDateform";
import { debounce } from "lodash";
import DischargeModal from "@components/admin/admininout/modal/dischargeModal";
import DischargeSuccessModal from "@components/admin/admininout/modal/dischargeSuccessModal";

type SelectedItem = {
  name: string;
  id: number;
};

const StaffWardInoutManagementPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const token = Cookies.get("accessTokenStaff") as string;
  //@ts-ignore
  const [isMyArea, setIsMyArea] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isAcitve, setIsActive] = useState(false);
  //@ts-ignore
  const [disChargeDate, setDisChargeDate] = useState<Value>(new Date());
  const [debounceValue, setDebounceValue] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const handleChangePage = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1);
  }, []);

  const {
    data: getTablet,
    refetch,
    isLoading,
  } = useGetWardTabletRequests({
    token: token,
    patientName: debounceValue,
    myArea: isMyArea,
    page: currentPage,
  });

  useEffect(() => {
    setSelected([]);
  }, [currentPage]);

  const { mutate } = useDischargePatients();
  const [selected, setSelected] = useState<Array<SelectedItem>>([]);

  const onChangeSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setSelected(
          getTablet?.data.map((tablet: any) => ({ name: tablet.patientName, id: tablet.tabletId })),
        );
      } else {
        setSelected([]);
      }
    },
    [selected],
  );

  const onChangeSelected = useCallback(
    (tabletId: number, patientName: string) => {
      setSelected(prev => {
        if (prev.some(item => item.id === tabletId)) {
          return prev.filter(item => item.id !== tabletId);
        } else {
          return [...prev, { name: patientName, id: tabletId }];
        }
      });
    },
    [selected],
  );
  const defaultValuesUpdate: WardTabletType = {
    areaId: 0,
    tabletId: 0,
    areaName: "",
    tabletName: "",
    serialNumber: "",
    patientId: 0,
    patientName: "",
    createdAt: "",
  };
  //@ts-ignore
  const handleActive = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsActive(prev => !prev);
    },
    [isAcitve],
  );

  const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
    debounceSearchValue(value);
    setCurrentPage(0);
  };

  const debounceSearchValue = useCallback(
    debounce((value: string) => {
      setDebounceValue(value);
    }, 200),
    [searchValue],
  );

  const formDischarge = useForm<WardTabletType>({
    defaultValues: defaultValuesUpdate,
    mode: "onChange",
  });

  useEffect(() => {
    isAcitve && setIsActive(false);
  }, [disChargeDate]);

  useEffect(() => {
    selected?.length === 0 && isAcitve && setIsActive(false);
  }, [selected]);

  const { handleSubmit: handleDischarge } = formDischarge;

  const updateDischarge: SubmitHandler<WardTabletType> = () => {
    mutate(
      { tabletIds: selectSingle.length !== 0 ? selectSingle : selected.map(item => item.id) },
      {
        onSuccess: () => {
          // toast.success("퇴원 처리가 완료 되었습니다.");
          setIsSuccessModal(true);
          refetch();
          setSelected([]);
          handleModal();
        },
        onError: error => {
          toast.error(error.message);
        },
      },
    );
  };

  const onDisCharge = handleDischarge(updateDischarge);

  const [selectSingle, setSelectSingle] = useState<Array<number>>([]);

  const handleModal = () => {
    setIsModal(prev => !prev);
  };

  const handleDischargeSingle = (tabletId: number) => {
    setSelectSingle([tabletId]);
    handleModal();
  };

  useEffect(() => {
    setSelectSingle([]);
  }, [selected]);

  return (
    <>
      {isModal && (
        <DischargeModal
          modalTitle={"주의"}
          subTitle={"테스트"}
          onClose={handleModal}
          open={isModal}
          onDisCharge={onDisCharge}
        />
      )}
      {isSuccessModal && (
        <DischargeSuccessModal
          modalTitle={" "}
          onClose={() => setIsSuccessModal(false)}
          open={isSuccessModal}
        />
      )}
      {isSuccessModal}
      <Container>
        <Title variant="h1">환자 관리</Title>
        <AnimatePresence mode="wait">
          {selected?.length > 0 ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SelectedActionBox>
                <div style={{ display: "flex", alignItems: "center", paddingLeft: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <Button onClick={() => setSelected([])}>
                      <StaffCancelIcon />
                    </Button>
                    <Text>{selected?.length}항목 선택됨</Text>
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
                    {/* <ComBoxLayout width={"160px"}>
                      <CalendarSelect onClick={handleActive}>
                        {disChargeDate !== new Date() ? (
                          <Text
                            sx={{
                              fontSize: 14,
                              lineHeight: 20,
                              fontWeight: 400,
                              letterSpacing: "-3%",
                              opacity: 1,
                            }}
                          >
                            {formatDateYYYYMMDD(disChargeDate as Date)}
                          </Text>
                        ) : (
                          <Text
                            sx={{
                              fontSize: 14,
                              lineHeight: 20,
                              fontWeight: 400,
                              letterSpacing: "-3%",
                              opacity: 0.3,
                            }}
                          >
                            예상 퇴원 날짜
                          </Text>
                        )}
                        <CalendarIcon />
                        {isAcitve && (
                          <CCalendar value={disChargeDate} setState={setDisChargeDate} />
                        )}
                      </CalendarSelect>
                    </ComBoxLayout> */}
                    <CButton buttontype={"impactRed"} onClick={handleModal}>
                      환자 퇴원 처리
                    </CButton>
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
                    placeholder={"검색할 내용을 입력해 주세요."}
                    borderColor={"#ECECEC"}
                  />
                </SearchLayout>
                {/* <ButtonLayout>
                  <CButton
                    buttontype={"primarySecond"}
                    onClick={handleActive}
                    icon={<DrowDownIcon />}
                  >
                    설정
                  </CButton>
                </ButtonLayout> */}
              </NanSelectedActionBox>
            </motion.div>
          )}
        </AnimatePresence>

        <TableLayout>
          <AdminTable
            isLoading={isLoading}
            getTablet={getTablet?.data}
            onChangeSelected={onChangeSelected}
            onChangeSelectAll={onChangeSelectAll}
            onDisCharge={handleDischargeSingle}
            selected={selected}
          />
        </TableLayout>
        <FooterLayout>
          <div>
            <PaginationComponent
              customColor={"#30B4FF"}
              totalPage={getTablet?.totalPages}
              onChange={(e, page) => handleChangePage(e, page)}
            />
          </div>
        </FooterLayout>
      </Container>
    </>
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
  marginBottom: 7,
  borderColor: theme.palette.secondary.main,
  borderWidth: 2,
  borderStyle: "solid",
  display: "flex",
  alignItems: "center",
  marginTop: 23.5,
}));

//@ts-ignore
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
//@ts-ignore
const ButtonLayout = styled(Box)({
  width: "148px",
});

//@ts-ignore
const CalendarSelect = styled(Button)(({ theme }) => ({
  width: "100%",
  height: "100%",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 24,
  position: "relative",
}));
