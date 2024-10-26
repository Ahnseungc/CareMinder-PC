import { ReactComponent as CompletedRequests } from "@assets/menuIcons/completedRequests.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";
import { UserType } from "@models/user";
import { SwitchCase } from "@toss/react";
import { useRecoilValue } from "recoil";
import { userState } from "@libraries/recoil";

export default function CompletedRequestsMenu() {
  const user = useRecoilValue(userState);
  return (
    <SwitchCase
      value={user?.type as UserType}
      caseBy={{
        WARD: (
          <MenuLayout
            routePath={RoutePath.StaffCompletedRequests}
            pageName={`완료 요청\n히스토리`}
            icon={CompletedRequests}
          />
        ),
        STAFF: (
          <MenuLayout
            routePath={RoutePath.StaffCompletedRequests}
            pageName={`완료 요청\n히스토리`}
            icon={CompletedRequests}
          />
        ),
      }}
    />
  );
}
