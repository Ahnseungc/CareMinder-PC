import { Box, Button, Stack, Typography, styled } from "@mui/material";
import { AdminTable } from "@components/admin";
import CButton from "@components/common/atom/C-Button";
import CSearchBox from "@components/common/atom/C-SearchBox";
import PaginationComponent from "@components/common/pagination";
import { motion, AnimatePresence } from "framer-motion";

import useDischargePatients from "@hooks/mutation/usePatientsDischarge";
import { WardTabletType } from "@models/ward-tablet";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ComBoxLayout } from "@components/admin/admininout/adminTable";
import { ReactComponent as StaffCancelIcon } from "@assets/staff-cancel-icon.svg";
import { ReactComponent as Pencil } from "@/assets/pencil2.svg";
import { ReactComponent as MemoIcon } from "@assets/memo-icon.svg";
import { Value } from "@components/common/atom/Calendar/C-Calendar";
import { debounce } from "lodash";
import DischargeModal from "@components/admin/admininout/modal/dischargeModal";
import DischargeSuccessModal from "@components/admin/admininout/modal/dischargeSuccessModal";
import { useGetStaffAreaList } from "@hooks/queries/useGetAreaList";
import MemoModal from "@components/admin/admininout/modal/memo-modal";
import EditModal from "@components/admin/admininout/modal/edit-modal";
import useGetMenagePatientList from "@hooks/mutation/useGetMenagePatientList";
import { useTranslation } from "react-i18next";

export type SelectedItem = {
  name: string;
  id: number;
  areaId: number;
  tabletName: string;
  admissionDate: string;
};

export type FilterData = {
  areaFilter: null | number[];
  patientNameFilter: null | string;
  patientNameSort: null | "ASC" | "DESC";
  tabletNameSort: null | "ASC" | "DESC";
  admissionDateSort: null | "ASC" | "DESC";
};

const StaffWardInoutManagementPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");

  //@ts-ignore
  const [isMyArea, setIsMyArea] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  //@ts-ignore
  const [disChargeDate, setDisChargeDate] = useState<Value>(new Date());
  const [isModal, setIsModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [isMemoModal, setIsMemoModal] = useState(false);
  const [selected, setSelected] = useState<Array<SelectedItem>>([]);
  const [getPatientFilterData, setGetPatientFilterData] = useState<FilterData>({
    areaFilter: null,
    patientNameFilter: null,
    patientNameSort: null,
    tabletNameSort: null,
    admissionDateSort: null,
  });
  const [getTablet, setGetTablet] = useState<undefined | any>(undefined);

  const handleChangePage = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page - 1);
  }, []);

  const { mutate: getPatientList } = useGetMenagePatientList();

  useEffect(() => {
    getPatientList(
      {
        page: currentPage,
        object: getPatientFilterData,
      },
      {
        onSuccess: data => {
          setGetTablet(data.data);
        },
      },
    );
  }, [getPatientFilterData, currentPage]);

  const { mutate } = useDischargePatients();

  const onChangeSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(
        getTablet?.data.map((tablet: any) => ({
          name: tablet.patientName,
          id: tablet.tabletId,
          areaName: tablet.areaName,
          tabletName: tablet.tabletName,
          admissionDate: tablet.createdAt,
        })),
      );
    } else {
      setSelected([]);
    }
  };

  const onChangeSelected = useCallback(
    (
      tabletId: number,
      patientName: string,
      areaId: number,
      tabletName: string,
      createdAt: string,
    ) => {
      setSelected(prev => {
        if (prev.some(item => item.id === tabletId)) {
          return prev.filter(item => item.id !== tabletId);
        } else {
          return [
            ...prev,
            {
              name: patientName,
              id: tabletId,
              areaId: areaId,
              tabletName: tabletName,
              admissionDate: createdAt,
            },
          ];
        }
      });
      // setSelected([{ name: patientName, id: tabletId, areaId: areaId, tabletName: tabletName }]);
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

  const onChangeSearchValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
    debounceSearchValue(value);
    setCurrentPage(0);
  };

  const debounceSearchValue = useCallback(
    debounce((value: string) => {
      setGetPatientFilterData(prev => ({ ...prev, patientNameFilter: value }));
    }, 200),
    [searchValue],
  );

  const formDischarge = useForm<WardTabletType>({
    defaultValues: defaultValuesUpdate,
    mode: "onChange",
  });

  const refetch = () => {
    getPatientList(
      {
        page: currentPage,
        object: getPatientFilterData,
      },
      {
        onSuccess: data => {
          setGetTablet(data.data);
        },
      },
    );
  };

  const { handleSubmit: handleDischarge } = formDischarge;

  const updateDischarge: SubmitHandler<WardTabletType> = () => {
    mutate(
      { tabletIds: selectSingle?.length !== 0 ? selectSingle : selected?.map(item => item.id) },
      {
        onSuccess: () => {
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

  const { data: areaList } = useGetStaffAreaList();

  const onDisCharge = handleDischarge(updateDischarge);

  const [selectSingle, setSelectSingle] = useState<Array<number>>([]);

  const handleModal = () => {
    setIsModal(prev => !prev);
  };

  const handleMemoModal = () => {
    setIsMemoModal(prev => !prev);
  };

  const handleDischargeSingle = (tabletId: number) => {
    setSelectSingle([tabletId]);
    handleModal();
  };

  const handleEditPatient = () => {
    setIsEditModal(true);
  };

  useEffect(() => {
    setSelectSingle([]);
  }, [selected]);

  const { t } = useTranslation();

  return (
    <>
      {isMemoModal && (
        <MemoModal
          modalTitle={"환자 메모 보기"}
          onClose={() => {
            setIsMemoModal(false), setSelected([]);
          }}
          open={isMemoModal}
          selectList={selected}
        />
      )}
      {isModal && (
        <DischargeModal
          modalTitle={t("주의")}
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

      {isEditModal && (
        <EditModal
          onClose={() => {
            isEditModal && setIsEditModal(false);
            setSelected([]);
          }}
          selectList={selected}
          open={isEditModal}
          areaList={areaList}
          refetch={refetch}
        />
      )}

      <Container>
        <Title variant="h1">{t("환자 관리")}</Title>
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
                    <Text>
                      {selected?.length} {t("항목 선택됨")}
                    </Text>
                  </div>
                  <div style={{ display: "flex", marginLeft: 60, gap: 24 }}>
                    <ComBoxLayout width={"30px"}>
                      <MemoIcon style={{ cursor: "pointer" }} onClick={handleMemoModal} />
                    </ComBoxLayout>
                    <ComBoxLayout width={"30px"}>
                      <Pencil style={{ cursor: "pointer" }} onClick={handleEditPatient} />
                    </ComBoxLayout>

                    <CButton buttontype={"impactRed"} onClick={handleModal}>
                      {t("환자 퇴원 처리")}
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
                    placeholder={t("검색할 내용을 입력해 주세요.")}
                    borderColor={"#ECECEC"}
                  />
                </SearchLayout>
              </NanSelectedActionBox>
            </motion.div>
          )}
        </AnimatePresence>

        <TableLayout>
          {getTablet !== undefined && (
            <AdminTable
              getTablet={getTablet?.data}
              onChangeSelected={onChangeSelected}
              onChangeSelectAll={onChangeSelectAll}
              onDisCharge={handleDischargeSingle}
              selected={selected}
              handleMemoModal={handleMemoModal}
              handleEditPatient={handleEditPatient}
              getPatientFilterData={getPatientFilterData}
              setGetPatientFilterData={setGetPatientFilterData}
            />
          )}
        </TableLayout>
        <FooterLayout>
          <div>
            <PaginationComponent
              customColor={"#30B4FF"}
              totalPage={getTablet?.totalPages}
              onChange={(e, page) => handleChangePage(e, page)}
              page={currentPage + 1}
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
