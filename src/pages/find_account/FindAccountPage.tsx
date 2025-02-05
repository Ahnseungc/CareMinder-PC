import CButton from "@components/common/atom/C-Button";
import FindAccountField from "@components/FindAccount/FindAccountField";
import verifyPhoneState from "@libraries/recoil/verifyPhone";
import { Box, Stack, styled, Typography } from "@mui/material";
import { SwitchCase } from "@toss/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import HelpSection from "@components/FindAccount/HelpSection";
import { useSearchParams } from "react-router-dom";
import FindIdModal from "@components/FindAccount/Modal/findIdModal";
import FindInputPwModal from "@components/FindAccount/Modal/findInputPwModal";
import FindPwSecond from "@components/FindAccount/Modal/findPwSecondModal";
import { SEVER_URL } from "@constants/baseUrl";
import axios from "axios";

type FindAccountType = "아이디 찾기" | "비밀번호 찾기";
type FindModalType = "IdModal" | "PwInputModal" | "PwSecondModal" | undefined;
type Account = "어드민" | "병동" | "스태프";

export default function FindAccountPage() {
  const [activeTab, setActiveTab] = useState<FindAccountType>("아이디 찾기");
  const [isOpenModal, setIsOpenModal] = useState<FindModalType>(undefined);
  const [findPWLevel, setFindPWLevel] = useState<1 | 2>(1);
  const [resId, setResId] = useState("");
  const [type, setType] = useState<Account>();

  const verifyPhone = useRecoilValue(verifyPhoneState);

  const [searchParams] = useSearchParams();
  const userType = searchParams.get("type");

  const onCloseModal = () => {
    setIsOpenModal(undefined);
  };

  useEffect(() => {
    switch (userType) {
      case "ADMIN":
        setType("어드민");
        break;
      case "WARD":
        setType("병동");
        break;
      case "STAFF":
        setType("스태프");
        break;
    }
  }, [userType]);

  const form = useForm<FindAccount>({
    defaultValues: {
      name: "",
      id: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const { handleSubmit } = form;

  /** api 생성 후  */
  const onSubmit: SubmitHandler<FindAccount> = async data => {
    console.log("데이터");
    console.log(data);
    if (activeTab === "아이디 찾기") {
      try {
        const res = await axios.post(`${SEVER_URL}/users/find-login-id`, {
          name: data.name,
          phoneNumber: data.phoneNumber,
          accountType: userType,
        });
        setResId(res);
        setIsOpenModal("IdModal");
      } catch (error) {
        console.log(error);
      }
    }
    if (activeTab === "비밀번호 찾기") {
      try {
        const res = await axios.post(`${SEVER_URL}/users/find-login-id`, {
          name: data.name,
          loginId: data.id,
          phoneNumber: data.phoneNumber,
          accountType: userType,
        });
        setResId(res);
        setIsOpenModal("IdModal");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onCheckId: SubmitHandler<FindAccount> = async data => {
    console.log(data);

    try {
      const res = await axios.post(`${SEVER_URL}/users/check-login-id`, {
        loginId: data.id,
        accountType: userType,
      });

      form.setError("id", {
        type: "required",
        message: "존재하지 않는 아이디입니다. 다시 확인해주세요.",
      });
    } catch (err: any) {
      if (err.status === 409) {
        setFindPWLevel(2);
      }
    }
  };

  return (
    <Container>
      <Title variant="h1">careminder</Title>
      <Typography variant="h1" sx={{ marginBottom: "30px" }}>
        {type} 계정 찾기
      </Typography>
      <TabContainer style={{ display: "flex", gap: "20px" }}>
        <Tab onClick={() => setActiveTab("아이디 찾기")} isActive={activeTab === "아이디 찾기"}>
          아이디 찾기
        </Tab>
        <Tab onClick={() => setActiveTab("비밀번호 찾기")} isActive={activeTab === "비밀번호 찾기"}>
          비밀번호 찾기
        </Tab>
      </TabContainer>
      <ContentLayout>
        <Stack gap={"24px"} sx={{ marginTop: "20px" }}>
          <SwitchCase
            value={activeTab}
            caseBy={{
              "아이디 찾기": (
                <>
                  {findAccountField.map(field => (
                    <FindAccountField key={field.name} field={field} form={form} type={"id"} />
                  ))}
                </>
              ),
              "비밀번호 찾기": (
                <>
                  {findPWLevel === 1 ? (
                    <FindAccountField
                      key={findPWLevelOne.name}
                      field={findPWLevelOne}
                      form={form}
                      type={"password"}
                    />
                  ) : (
                    <>
                      {findAccountField.map(field => (
                        <FindAccountField
                          key={field.name}
                          field={field}
                          form={form}
                          type={"password"}
                        />
                      ))}
                    </>
                  )}
                </>
              ),
            }}
          />
        </Stack>
      </ContentLayout>
      <CButtonContainer>
        {activeTab === "비밀번호 찾기" && findPWLevel === 1 ? (
          <CButton buttontype="primarySpaureWhite" onClick={handleSubmit(onCheckId)}>
            완료
          </CButton>
        ) : (
          <CButton
            buttontype="primarySpaureWhite"
            onClick={handleSubmit(onSubmit)}
            disabled={!verifyPhone}
          >
            찾기
          </CButton>
        )}
      </CButtonContainer>
      <HelpSection />
      {isOpenModal === "IdModal" && (
        <FindIdModal onClose={onCloseModal} setActiveTab={setActiveTab} type={type!} id={resId} />
      )}
      {isOpenModal === "PwInputModal" && (
        <FindInputPwModal
          onClose={onCloseModal}
          setActiveTab={setActiveTab}
          type={type!}
          id={"careminder"}
        />
      )}
      {isOpenModal === "PwSecondModal" && <FindPwSecond onClose={onCloseModal} type={type!} />}
    </Container>
  );
}

/** utils */

export type FindAccount = {
  name: string;
  id: string;
  phoneNumber: string;
};

export type FindAccountFieldType = {
  name: keyof FindAccount;
  label: string;
  placeholder: string;
};

const findAccountField: FindAccountFieldType[] = [
  { name: "name", label: "이름", placeholder: "이름을 입력해주세요." },
  // { name: "id", label: "아이디", placeholder: "아이디를 입력해주세요." },
  { name: "phoneNumber", label: "전화번호", placeholder: "010-0000-0000" },
];

const findPWLevelOne = { name: "id", label: "아이디", placeholder: "아이디를 입력해주세요." };

interface TabProps {
  isActive?: boolean;
}

/** styles */

const Container = styled(Stack)({
  alignItems: "center",
  height: "100%",
  justifyContent: "center",
  marginTop: "50px",
});

const TabContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "304px",
  gap: "20px",
  color: theme.palette.primary.dark,
  backgroundColor: theme.palette.success.main,
  fontSize: "16px",
  fontWeight: 500,
  padding: "4px",
  borderRadius: "100px",
}));

const Tab = styled(Box, {
  shouldForwardProp: prop => prop !== "isActive",
})<TabProps>(({ theme, isActive }) => ({
  cursor: "pointer",
  width: "50%",
  textAlign: "center",
  borderRadius: "100px",
  padding: "6px 16.5px",
  backgroundColor: isActive ? theme.palette.primary.contrastText : theme.palette.success.main,
  color: isActive ? theme.palette.primary.dark : theme.palette.text.primary,
  transition: "all 0.2s ease-in-out",
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  textTransform: "uppercase",
  lineHeight: "102px",
  letterSpacing: "0.2em",
  fontSize: "52px",
  fontWeight: 700,
}));

const ContentLayout = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "10px",
  padding: "24px 30px",
  alignItems: "center",
});

const CButtonContainer = styled(Box)({
  width: "420px",
  height: "50px",
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
});
