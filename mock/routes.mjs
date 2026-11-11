// 화면별 목 응답. 환자·의료진·병동 이름은 모두 가상 데이터.
const AREAS = [
  { areaId: 1, areaName: "A구역" },
  { areaId: 2, areaName: "B구역" },
  { areaId: 3, areaName: "C구역" },
];
const PATIENTS = ["김영희", "이철수", "박순자", "최민호", "정말순", "강동원", "윤정숙", "임재범", "한미숙", "오승철", "서옥자", "신동욱"];
const STAFFS = [
  { staffId: 1, name: "김간호", staffRole: "NURSE" },
  { staffId: 2, name: "이조무", staffRole: "NURSE_ASSISTANT" },
  { staffId: 3, name: "박의사", staffRole: "DOCTOR" },
  { staffId: 4, name: "최직원", staffRole: "WORKER" },
];
const REQUESTS = [
  ["수액이 다 들어간 것 같아요. 확인 부탁드려요", "NURSE"],
  ["진통제 시간 됐는지 궁금합니다", "NURSE"],
  ["화장실 가는 걸 도와주세요", "NURSE_ASSISTANT"],
  ["침대 높이 좀 낮춰 주세요", "NURSE_ASSISTANT"],
  ["담당 선생님 회진 언제 오시나요?", "DOCTOR"],
  ["수술 부위가 계속 아파요", "DOCTOR"],
  ["병실이 너무 추워요", "WORKER"],
  ["TV 리모컨이 안 돼요", "WORKER"],
  ["물 좀 가져다 주실 수 있나요?", "NURSE_ASSISTANT"],
  ["어지럽고 속이 메스꺼워요", "NURSE"],
];

const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();
const tablet = (i) => ({ tabletId: 100 + i, tabletName: `7${String((i % 6) + 1).padStart(2, "0")}호-${(i % 2) + 1}`, serialNumber: `CM-TB-${1000 + i}` });
const patient = (i) => ({ patientId: 200 + i, patientName: PATIENTS[i % PATIENTS.length] });

const request = (i, status) => ({
  patientRequestId: 500 + i,
  requestStatus: status,
  content: REQUESTS[i % REQUESTS.length][0],
  aiRole: REQUESTS[i % REQUESTS.length][1],
  areaSimple: AREAS[i % AREAS.length],
  tabletSimple: tablet(i),
  patientSimple: patient(i),
  staffSimple: STAFFS[i % STAFFS.length],
  createdAt: minutesAgo(i * 7 + 2),
  unreadCount: status === "IN_PROGRESS" && i % 2 === 0 ? (i % 3) + 1 : 0,
  isNew: i < 2,
});

const pending = Array.from({ length: 7 }, (_, i) => request(i, "PENDING"));
const inProgress = Array.from({ length: 5 }, (_, i) => request(i + 7, "IN_PROGRESS"));
const completed = Array.from({ length: 10 }, (_, i) => request(i + 2, "COMPLETED"));

const groups = (list) =>
  Object.values(
    list.reduce((acc, r) => {
      const key = r.patientSimple.patientId;
      acc[key] ??= { tabletSimple: r.tabletSimple, patientSimple: r.patientSimple, patientRequests: [] };
      acc[key].patientRequests.push(r);
      return acc;
    }, {})
  );

const tablets = PATIENTS.map((patientName, i) => ({
  ...tablet(i),
  areaId: AREAS[i % AREAS.length].areaId,
  areaName: AREAS[i % AREAS.length].areaName,
  patientId: 200 + i,
  patientName,
  createdAt: minutesAgo(60 * 24 * (i * 2 + 1)),
}));

const WARDS = ["7병동", "8병동", "9병동", "중환자실", "응급실", "소아병동", "산부인과병동", "재활병동"];

export const routes = {
  // 병동 · 의료진 공통
  "/ward-patient-requests/pending": { data: pending },
  "/ward-patient-requests/in-progress": { data: inProgress },
  "/staff-patient-requests/pending": { data: pending },
  "/staff-patient-requests/in-progress": { data: inProgress },
  "/staff-patient-requests/in-progress/patient-group": { data: groups(inProgress) },
  "/staff-patient-requests/completed": { data: completed },
  "/staff-patient-requests/completed/patient-group": { data: groups(completed) },
  "/staffs/patient-list": { data: tablets.slice(0, 10), totalPages: 2, totalElements: tablets.length },
  "/areas": AREAS.map((a) => ({ id: a.areaId, wardId: 1, name: a.areaName, memo: "" })),
  "/notices/list-by-web": {
    data: [
      ["12월 병동 감염관리 교육 안내", "김간호"],
      ["면회 시간 변경 안내 (평일 18~20시)", "박의사"],
      ["낙상 예방 체크리스트 업데이트", "이조무"],
      ["연말 병동 대청소 일정", "최직원"],
    ].map(([title, staffName], i) => ({
      noticeId: 40 - i,
      staffId: i + 1,
      title,
      content: `${title} 내용입니다.`,
      fileUrl: "",
      staffName,
      staffPhoneNumber: "010-0000-0000",
      createdAt: minutesAgo(60 * 24 * (i + 1)),
      lastModifiedAt: minutesAgo(60 * 24 * (i + 1)),
      receivers: [patient(i), patient(i + 1)].map((p) => ({ patientId: String(p.patientId), patientName: p.patientName })),
    })),
  },

  // 관리자
  "/admins/ward-list": {
    data: WARDS.map((wardName, i) => ({
      wardId: i + 1,
      wardName,
      loginId: `ward${String(i + 1).padStart(2, "0")}`,
      managerName: STAFFS[i % STAFFS.length].name,
      managerPhoneNumber: "010-0000-0000",
      managerEmail: `ward${i + 1}@careminder.example`,
      userStatusInfo: { accountLocked: i === 5, isLogIn: i % 3 !== 2, timeSinceLogout: i % 3 === 2 ? "2시간 전" : null },
    })),
    page: 0,
    size: 20,
    totalElements: WARDS.length,
    totalPages: 1,
  },
  "/admins/ward-area-list": WARDS.map((wardName, i) => ({
    wardId: i + 1,
    wardName,
    areas: AREAS.map((a) => ({ ...a, memo: "" })),
  })),
};
