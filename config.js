/* =========================================================
   구미 호반써밋 엘리트시티 방문예약 사이트 - 공통 설정
   index.html, admin.html 둘 다 이 파일을 불러와 사용합니다.
   ========================================================= */

const CONFIG = {
  // 배포 후 GAS 웹앱 URL로 교체하세요 (Code.gs 배포 가이드 참고)
  API_URL: "YOUR_GAS_WEB_APP_URL",

  SITE_NAME: "호반써밋 엘리트시티",
  LOCATION: "단지내 111동 앞 커뮤니티 CONFERENCE ROOM (BOOK CAFE 옆)",
  CONTACT: "", // 문의 전화번호 - 추후 입력

  // 실제 방문 가능 일자 (현장 방문일)
  VISIT_DATES: ["2026-11-12", "2026-11-13", "2026-11-14"],

  // 운영 시간 / 점심시간(제외) / 슬롯 간격(분)
  OPEN_TIME: "09:30",
  CLOSE_TIME: "15:30",
  LUNCH_START: "12:00",
  LUNCH_END: "13:00",
  SLOT_MINUTES: 30,

  // 슬롯(타임슬롯) 하나당 최대 예약 팀 수
  MAX_TEAMS_PER_SLOT: 2,

  // 예약 신청 자체가 가능한 기간 (방문일과는 별개)
  BOOKING_OPEN: "2026-11-03T00:00:00+09:00",
  BOOKING_CLOSE: "2026-11-11T23:59:59+09:00",
};

/**
 * 운영시간/점심시간/슬롯간격을 바탕으로 하루치 타임슬롯 배열을 생성합니다.
 * 반환 예: ["09:30-10:00", "10:00-10:30", ... , "15:00-15:30"]
 */
function buildDaySlots(cfg) {
  const toMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const toTime = (min) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const open = toMin(cfg.OPEN_TIME);
  const close = toMin(cfg.CLOSE_TIME);
  const lunchStart = toMin(cfg.LUNCH_START);
  const lunchEnd = toMin(cfg.LUNCH_END);
  const step = cfg.SLOT_MINUTES;

  const slots = [];
  for (let start = open; start + step <= close; start += step) {
    const end = start + step;
    // 점심시간과 겹치는 슬롯은 제외
    const overlapsLunch = start < lunchEnd && end > lunchStart;
    if (overlapsLunch) continue;
    slots.push(`${toTime(start)}-${toTime(end)}`);
  }
  return slots;
}

// Node 환경(테스트)과 브라우저 환경 둘 다에서 쓸 수 있도록 export
if (typeof module !== "undefined") {
  module.exports = { CONFIG, buildDaySlots };
}
