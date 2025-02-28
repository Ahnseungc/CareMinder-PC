import { UserType } from "@models/user";
import { styled, Typography } from "@mui/material";
import { SwitchCase } from "@toss/react";
import { useTranslation } from "react-i18next";

type UserTypeProps = {
  type: UserType;
};

export default function UserTypeTag({ type }: UserTypeProps) {
  const { t } = useTranslation();

  return (
    <Container variant="h1">
      <SwitchCase
        value={type}
        caseBy={{
          ADMIN: <>{t("어드민")}</>,
          WARD: <>{t("병동")}</>,
          STAFF: <>{t("스태프")}</>,
        }}
      />
    </Container>
  );
}

const Container = styled(Typography)(({ theme }) => ({
  marginTop: "60px",
  marginBottom: "30px",
  color: theme.palette.primary.main,
}));
