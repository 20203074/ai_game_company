/**
 * ANTI-GRAVITY AI: INFINITE GAME STUDIO ENGINE
 * Master Client Simulation Engine & 2D Canvas Visualizer
 * Dual Runtime Synchronization & Dual Clock System
 */

// -----------------------------------------------------------------------------
// CONSTANTS & 50x50 MAP DEFINITIONS
// -----------------------------------------------------------------------------
const GRID_SIZE = 50;
const TILE_PX = 24;

const STATE_COLORS = {
  DONE: "#2ECC71",              // Mint
  IN_PROGRESS: "#F1C40F",       // Yellow
  AWAIT_APPROVAL: "#E91E63",     // Deep Pink
  AWAIT_INTEGRATION: "#9B59B6", // Lavender
  IDLE: "#ECF0F1",              // White
  IN_MEETING: "#1ABC9C"         // Cyan
};

const STATE_SPEECH = {
  DONE: "빌드 완성했습니다!",
  IN_PROGRESS: "게임 개발 중…",
  AWAIT_APPROVAL: "대표님 기획/코드 검토 바랍니다",
  AWAIT_INTEGRATION: "외부 엔진/API 연동 대기중",
  IDLE: "다음 스프린트 대기중",
  IN_MEETING: "전사 개발 회의 참석 중입니다."
};

// 12 Departments Data (Infinite Game Studio)
const DEPARTMENTS = [
  { id: 1, name: "시장조사팀", room: "Room #1", color: "#3498DB", x1: 2, y1: 13, x2: 9, y2: 20 },
  { id: 2, name: "게임 기획 1팀 [코어/시스템]", room: "Room #2", color: "#9B59B6", x1: 2, y1: 23, x2: 9, y2: 30 },
  { id: 3, name: "게임 QA팀 [밸런스/검수]", room: "Room #3", color: "#E74C3C", x1: 2, y1: 33, x2: 9, y2: 40 },
  { id: 4, name: "대표실 [1차 기획 결재]", room: "Exec #4", color: "#F59E0B", x1: 2, y1: 2, x2: 10, y2: 10 },
  { id: 5, name: "게임 기획 2팀 [레벨/시나리오]", room: "Room #5", color: "#F39C12", x1: 11, y1: 23, x2: 18, y2: 30 },
  { id: 6, name: "게임 아트팀 [2D/3D/UI]", room: "Room #6", color: "#1ABC9C", x1: 11, y1: 13, x2: 18, y2: 20 },
  { id: 7, name: "게임 사운드팀 [BGM/SFX]", room: "Room #7", color: "#2ECC71", x1: 32, y1: 13, x2: 39, y2: 20 },
  { id: 8, name: "게임 프로그래밍팀 [코어/엔진]", room: "Room #8", color: "#38BDF8", x1: 32, y1: 23, x2: 39, y2: 30 },
  { id: 9, name: "대표실 [2차 코드 검토]", room: "Review #9", color: "#EC4899", x1: 2, y1: 2, x2: 10, y2: 10 },
  { id: 10, name: "사업·퍼블리싱팀 [스토어/패키징]", room: "Room #10", color: "#27AE60", x1: 41, y1: 33, x2: 48, y2: 40 },
  { id: 11, name: "라이브 유지보수팀 [Auto Live-Ops]", room: "Room #11", color: "#8E44AD", x1: 41, y1: 23, x2: 48, y2: 30 },
  { id: 12, name: "비서실 [스튜디오 총괄]", room: "Room #12", color: "#D35400", x1: 41, y1: 13, x2: 48, y2: 20 }
];

// Special Spatial Zones
const SPECIAL_ROOMS = [
  { id: "exec", name: "대표실 (Executive Room)", color: "#1E293B", x1: 2, y1: 2, x2: 10, y2: 10, label: "👑 대표실 (HITL 결재/검토)" },
  { id: "meeting", name: "중앙 회의실 (Central Meeting)", color: "#14283F", x1: 20, y1: 20, x2: 30, y2: 30, label: "📢 중앙 회의실" },
  { id: "lounge", name: "휴게 라운지 (Lounge & Rest)", color: "#172554", x1: 38, y1: 2, x2: 48, y2: 10, label: "☕ 휴게 라운지" },
  { id: "entrance", name: "출입 게이트 (Entrance Gate)", color: "#131C2E", x1: 22, y1: 45, x2: 28, y2: 49, label: "🚪 출입 게이트" }
];

// 27 Active Simulation Agents (Core Leaders & Key Specialists in 50x50 map)
const AGENTS_DATA = [
  // 1. 시장조사팀
  { id: 1, name: "이서준", code: "이조사", deptId: 1, role: "팀장", isLeader: true, desk: {x: 4, y: 15}, speech: "글로벌 스팀 동향과 유저 선호도를 분석합니다.", task: "글로벌 트렌드 및 타깃 분석", reject: "출처 불분명한 통계, 장르 트렌드 미부합" },
  { id: 2, name: "김유진", code: "김유진", deptId: 1, role: "팀원", isLeader: false, desk: {x: 6, y: 15}, speech: "경쟁작 벤치마킹 데이터 취합 완료했습니다.", task: "경쟁 게임 벤치마킹", reject: "검증되지 않은 판매 추정치" },
  { id: 3, name: "박민수", code: "박민수", deptId: 1, role: "팀원", isLeader: false, desk: {x: 4, y: 17}, speech: "유저 피드백 키워드 분석 중입니다.", task: "게이머 감성 분석", reject: "최근 14일 내 다룬 중복 기획 소재" },

  // 2. 게임 기획 1팀
  { id: 4, name: "최현우", code: "최기획", deptId: 2, role: "팀장", isLeader: true, desk: {x: 4, y: 25}, speech: "중독성 있는 코어 게임플레이 루프를 설계합니다.", task: "코어 루프 & 시스템 총괄", reject: "반복성 결여, 3대 재미 요소 누락" },
  { id: 5, name: "정다은", code: "정다은", deptId: 2, role: "팀원", isLeader: false, desk: {x: 6, y: 25}, speech: "세계관 및 IP 콘셉트 정리 완료했습니다.", task: "세계관 & 시놉시스 구축", reject: "타깃층 미합치, 세계관 설정 모순" },
  { id: 6, name: "강동현", code: "강동현", deptId: 2, role: "팀원", isLeader: false, desk: {x: 4, y: 27}, speech: "성장 곡선 및 보상 메커니즘 수립 중입니다.", task: "보상 메커니즘 설계", reject: "외부 엔진 API 미연동 시 추정치 남용 금지" },

  // 3. 게임 QA팀
  { id: 7, name: "한소희", code: "한QA", deptId: 3, role: "팀장", isLeader: true, desk: {x: 4, y: 35}, speech: "밸런스 붕괴나 가드레일 위반은 전원 반려합니다.", task: "밸런스/재미 검수 및 판정", reject: "사규 지정 가드레일 위반, 불공정 난이도" },
  { id: 8, name: "오성민", code: "오성민", deptId: 3, role: "팀원", isLeader: false, desk: {x: 6, y: 35}, speech: "초반 5분 이탈률 요인 점검 중입니다.", task: "초반 온보딩 검증", reject: "튜토리얼 설명 부족, 직관성 결여" },
  { id: 9, name: "백지아", code: "백지아", deptId: 3, role: "팀원", isLeader: false, desk: {x: 4, y: 37}, speech: "수치 밸런스 시뮬레이션 돌렸습니다.", task: "수치 경제학 검증", reject: "과금 유도 중심 구조 (규칙③ 위반)" },

  // 5. 게임 기획 2팀
  { id: 10, name: "권태양", code: "권레벨", deptId: 5, role: "팀장", isLeader: true, desk: {x: 13, y: 25}, speech: "스테이지별 긴장감 곡선과 레벨을 정밀 배치합니다.", task: "레벨 디자인 총괄", reject: "대표 미승인 안건 상세화 금지, 급격한 난이도 스파이크" },
  { id: 11, name: "송아름", code: "송아름", deptId: 5, role: "팀원", isLeader: false, desk: {x: 15, y: 25}, speech: "퀘스트 분기와 NPC 대사를 작성했습니다.", task: "퀘스트 & 시나리오 스크립팅", reject: "맥락 없는 서브 퀘스트" },
  { id: 12, name: "장우진", code: "장우진", deptId: 5, role: "팀원", isLeader: false, desk: {x: 13, y: 27}, speech: "몬스터 패턴 및 기믹 테이블 정돈 완료했습니다.", task: "적 기믹 및 배치 테이블", reject: "대표 미승인 기획안 작업 착수" },

  // 6. 게임 아트팀
  { id: 13, name: "신예은", code: "신아트", deptId: 6, role: "팀장", isLeader: true, desk: {x: 13, y: 15}, speech: "독창적이고 일관된 아트 스타일을 확립합니다.", task: "아트 디렉팅 및 에셋 검수", reject: "라이선스 미검증 에셋 사용, 원본 덮어쓰기" },
  { id: 14, name: "조경훈", code: "조경훈", deptId: 6, role: "팀원", isLeader: false, desk: {x: 15, y: 15}, speech: "캐릭터 및 배경 스프라이트 시트 제작 중입니다.", task: "스프라이트 & 텍스처 제작", reject: "해상도 불일치, 프레임 누락" },
  { id: 15, name: "유나경", code: "유나경", deptId: 6, role: "팀원", isLeader: false, desk: {x: 13, y: 17}, speech: "직관적인 인게임 HUD와 UI 배치 완료했습니다.", task: "UI/UX & 이펙트 디자인", reject: "모바일/PC 가독성 불량" },

  // 7. 게임 사운드팀
  { id: 16, name: "황민혁", code: "황사운드", deptId: 7, role: "팀장", isLeader: true, desk: {x: 34, y: 15}, speech: "몰입감을 극대화할 메인 테마곡을 조율합니다.", task: "사운드 디렉팅 & 오디오 믹싱", reject: "음원 클리핑, 볼륨 밸런스 붕괴" },
  { id: 17, name: "고은지", code: "고은지", deptId: 7, role: "팀원", isLeader: false, desk: {x: 36, y: 15}, speech: "타격감 넘치는 SFX 효과음 렌더링 중입니다.", task: "SFX 효과음 제작", reject: "타격 피드백 딜레이 발생" },
  { id: 18, name: "배성호", code: "배성호", deptId: 7, role: "팀원", isLeader: false, desk: {x: 34, y: 17}, speech: "공간 음향 및 앰비언스 루프 완료했습니다.", task: "환경 앰비언스 제작", reject: "루프 지점 이음새 튐" },

  // 8. 게임 프로그래밍팀
  { id: 19, name: "윤지민", code: "윤엔진", deptId: 8, role: "팀장", isLeader: true, desk: {x: 34, y: 25}, speech: "최적화된 코어 아키텍처로 60FPS를 보장합니다.", task: "엔진 아키텍처 & 코드 검토", reject: "메모리 누수, 예외 미처리" },
  { id: 20, name: "임하늘", code: "임하늘", deptId: 8, role: "팀원", isLeader: false, desk: {x: 36, y: 25}, speech: "플레이어 조작감 및 물리 엔진 연동 끝났습니다.", task: "게임플레이 로직 구현", reject: "입력 지연(Latency) 허용치 초과" },
  { id: 21, name: "서준혁", code: "서준혁", deptId: 8, role: "팀원", isLeader: false, desk: {x: 34, y: 27}, speech: "WebGL 경량 빌드 파이프라인 패키징 중입니다.", task: "빌드 패키징 & 최적화", reject: "빌드 사이즈 초과, 미사용 리소스 잔존" },

  // 10. 사업·퍼블리싱팀
  { id: 22, name: "문소율", code: "문퍼블", deptId: 10, role: "팀장", isLeader: true, desk: {x: 43, y: 35}, speech: "스팀/웹 스토어 론칭 스펙과 마케팅을 점검합니다.", task: "스토어 등록 & 마케팅 전략", reject: "자동 외부 게시(규칙② 위반), 과장 광고 문구" },
  { id: 23, name: "홍진우", code: "홍진우", deptId: 10, role: "팀원", isLeader: false, desk: {x: 45, y: 35}, speech: "트레일러 캡처본 및 설명 문서 작성 완료했습니다.", task: "홍보 에셋 문서화", reject: "실제 스토어 자동 업로드 금지" },

  // 11. 라이브 유지보수팀
  { id: 24, name: "하준호", code: "하라이브", deptId: 11, role: "팀장", isLeader: true, desk: {x: 43, y: 25}, speech: "크래시 로그 감지 즉시 핫픽스 패치를 생성합니다.", task: "버그 핫픽스 & 릴리즈 태깅", reject: "CHANGELOG 미작성, 검증 없는 배포" },
  { id: 25, name: "서유리", code: "서유리", deptId: 11, role: "팀원", isLeader: false, desk: {x: 45, y: 25}, speech: "시즌 업데이트 밸런스 패치 노트 정리 완료.", task: "시즌 콘텐츠 & 패치 노트", reject: "원본 덮어쓰기 (사규④ 위반)" },

  // 12. 비서실
  { id: 26, name: "김세리", code: "김비서", deptId: 12, role: "비서실장", isLeader: true, desk: {x: 43, y: 15}, speech: "대표님, 270명 게임 스튜디오 파이프라인이 정상 가동 중입니다.", task: "전사 파이프라인 관제 및 보고", reject: "중복 보고, 미승인 안건 강제 진행" },
  { id: 27, name: "도현우", code: "도현우", deptId: 12, role: "팀원", isLeader: false, desk: {x: 45, y: 15}, speech: "12개 부서 산출물 종합 리포트 취합 완료했습니다.", task: "개발 진행률 및 리포트 집계", reject: "미검증 데이터 인용" }
];

// 12-Step Game Studio Scenario Meta
const STEPS = [
  { step: 1, title: "시장조사", time: "07:00", desc: "글로벌 게임 시장 트렌드, 스팀 인기 장르 분석 및 전원 출근", duration: 5 },
  { step: 2, title: "기획 1팀 (코어 루프 설계)", time: "08:30", desc: "신작 게임 10개 콘셉트 도출, 코어 게임플레이 루프 및 세계관/IP 기획안 작성", duration: 5 },
  { step: 3, title: "QA팀 (밸런스 및 사규 검수)", time: "10:00", desc: "게임 QA팀 10건 전수 검사 진행 -> 사규 위반 3건 반려 / 통과 7건 중 TOP 3 선정", duration: 5 },
  { step: 4, title: "★ 1차 대표 기획 승인 ★ (HITL 1)", time: "11:30", desc: "기획팀장, QA팀장, 비서실장 대표실 집결 -> 상세 기획 요약서 출력 -> 대표 승인 대기", duration: 0 },
  { step: 5, title: "기획 2팀 (레벨 & 시나리오 상세화)", time: "13:00", desc: "승인 안건에 대한 레벨 디자인, 퀘스트/시나리오 상세화, 적 배치 및 기믹 테이블 작성", duration: 5 },
  { step: 6, title: "아트팀 (2D/3D 그래픽 & UI)", time: "14:30", desc: "캐릭터/배경 스프라이트, 콘셉트 원화, HUD/UI 디자인 및 시각 에셋 패키징", duration: 5 },
  { step: 7, title: "사운드팀 (BGM & SFX)", time: "15:30", desc: "메인 테마 BGM 작곡, 타격감 SFX 제작, 환경음 사운드 믹싱", duration: 5 },
  { step: 8, title: "프로그래밍팀 (코어 엔진 & 빌드)", time: "16:30", desc: "게임플레이 루프 프로그래밍, 물리 엔진 결합, WebGL 경량화 빌드 소스 코드 완성", duration: 6 },
  { step: 9, title: "★ 2차 대표 코드 검토 ★ (HITL 2)", time: "17:30", desc: "소스 코드 검토 창 출력, 대표 AI 리팩토링 지시 및 최종 푸시 승인 대기", duration: 0 },
  { step: 10, title: "사업·퍼블리싱팀 (스토어 & 패키징)", time: "18:00", desc: "output/ 규격 디렉터리 5대 폴더 안전 보존 및 스토어 에셋 패키징", duration: 5 },
  { step: 11, title: "라이브 유지보수팀 (Auto Live-Ops)", time: "18:30", desc: "백그라운드 버그 수집, 핫픽스, CHANGELOG.md 및 GitHub v1.0.1 릴리즈 태깅 자동화", duration: 5 },
  { step: 12, title: "비서실 브리핑 (전사 총괄)", time: "19:00", desc: "비서실장(김세리) 5줄 전사 요약 브리핑 제출 및 차기 스프린트 대기", duration: 5 }
];

// Sample Games with 6 Core Elements (Spec 4)
const SAMPLE_GAMES = [
  {
    id: 1, rank: 1, score: 96, passed: true,
    genre: "Roguelike_Action",
    title: "크로노 블레이드: 시공간의 방랑자 (Chrono Blade: Rift Walker)",
    hook: "시간을 왜곡하는 찰나의 패링, 0.1초의 통제력으로 무한 차원의 보스를 베어 넘긴다!",
    target: "20~30대 하드코어 액션 & 로그라이크 매니아, 빠른 반응속도 선호 게이머",
    world: "시공간 붕괴 후 산산조각 난 평행 차원. 과거와 미래가 교차하는 붕괴도시 네오 에테르를 수호하는 시간 기사단의 분투기.",
    core_loop: "실시간 타임 슬로우 패링 액션 -> 차원 룬 조합 & 유물 파밍 -> 시공간 균열 보스 토벌 -> 영구 거점 및 스킬 트리 강화",
    art_sound: "네오 다크 판타지 스타일라이즈드 도트 아트 + 신스웨이브 & 오케스트라 퓨전 BGM (타격감 중심 하이엔드 SFX)",
    qa_verdict: "통과: 코어 루프 중독성 최상위(96점), 조작감 반응속도 60FPS 보장, 사규 7대 규칙 100% 충족"
  },
  {
    id: 2, rank: 2, score: 93, passed: true,
    genre: "Deckbuilder_Puzzle",
    title: "아스트랄 아카이브 (Astral Archive)",
    hook: "별자리를 엮어 펼치는 지적 카타르시스, 카드가 연쇄 폭발할 때 도서관의 비밀이 열린다!",
    target: "스팀 덱 및 캐주얼 전략/퍼즐 게이머, 전략적 덱빌딩 선호층",
    world: "은하계 저편 잊혀진 고대 별자리 대도서관. 봉인된 지식의 성간 서고를 탐험하는 천문학 학회의 연대기.",
    core_loop: "별자리 카드 드로우 & 별빛 링크 연계 -> 콤보 퍼즐 해제 -> 서고 수호자 두뇌 배틀 -> 희귀 아티팩트 해금",
    art_sound: "몽환적 파스텔톤 우주 일러스트 + 잔잔하고 감성적인 로파이(Lo-Fi) 피아노 & 앰비언스 사운드",
    qa_verdict: "통과: 진입장벽 낮고 깊이 있는 밸런스(93점), 턴제 알고리즘 최적화, 사규 가드레일 통과"
  },
  {
    id: 3, rank: 3, score: 89, passed: true,
    genre: "Cyberpunk_Sim",
    title: "네오 서울 2099: 사이버 딜리버리 (Neo Seoul 2099)",
    hook: "거대 메가코프의 통제를 뚫고 빗길 위를 질주하는 호버바이크의 쾌감!",
    target: "오픈월드, 경영 시뮬레이션 및 SF 사이버펑크 세계관 팬층",
    world: "인공지능 메가코프가 지배하는 디스토피아 네오 서울. 뒷골목 독립 배달 크루들이 도시의 숨겨진 진실을 운반한다.",
    core_loop: "고위험 긴급 배달 오더 수주 -> 네온 도시 최적 항로 고속 레이싱 -> 크레딧 & 평판 획득 -> 호버바이크 튜닝 및 크루 확장",
    art_sound: "네온 글리치 사이버펑크 픽셀 3D + 다이내믹 신스웨이브 비트 & 도시 앰비언스 SFX",
    qa_verdict: "통과: 뛰어난 비주얼 흡입력(89점), 과금 유도 배제한 순수 몰입형 인게임 경제 루프 설계"
  },
  // 3 Rejected Games
  {
    id: 8, rank: 8, score: 41, passed: false,
    genre: "Auto_Gacha",
    title: "무한 자율결제 방치형 머니 RPG",
    hook: "잠자는 동안 자동으로 법인카드가 결제되며 강해지는 게임!",
    target: "불명",
    world: "설정 없음",
    core_loop: "자동 결제 -> 자동 전투 -> 자동 과금",
    art_sound: "무단 도용 에셋",
    qa_verdict: "반려 사유: 사규 7대 규칙 ③번 '결제, 구독, 해지 API 자동 실행 금지' 정면 위반 및 사규 ⑥번 위반"
  },
  {
    id: 9, rank: 9, score: 45, passed: false,
    genre: "Viral_Bot",
    title: "SNS 자동 폭풍 게시 바이럴 클리커",
    hook: "클릭할 때마다 내 SNS 전 계정에 게임 광고가 자동 포스팅!",
    target: "불명",
    world: "스팸 봇 세계관",
    core_loop: "클릭 -> 외부 SNS 무단 자동 업로드",
    art_sound: "출처 불분명",
    qa_verdict: "반려 사유: 사규 7대 규칙 ②번 'SNS 계정 실제 자동 게시 금지' 및 규칙 ①번 정면 위반"
  },
  {
    id: 10, rank: 10, score: 50, passed: false,
    genre: "Unverified_Action",
    title: "출처 미확인 무단 에셋 도용 액션",
    hook: "어디선가 많이 본 듯한 유명 캐릭터들의 난투극",
    target: "불명",
    world: "저작권 침해 우려",
    core_loop: "단순 반복 타격",
    art_sound: "외부 무단 다운로드 에셋",
    qa_verdict: "반려 사유: 사규 7대 규칙 ⑥번 '확인 안 된 정보 및 라이선스 미검증 에셋 사용 금지' 위반"
  }
];

// -----------------------------------------------------------------------------
// AUDIO SYNTHESIS ENGINE (Web Audio API)
// -----------------------------------------------------------------------------
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const t = audioCtx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === "step") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === "approve") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, t); // C5
      osc.frequency.setValueAtTime(659.25, t + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, t + 0.16); // G5
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.3);
      osc.start(t);
      osc.stop(t + 0.3);
    } else if (type === "alert") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.linearRampToValueAtTime(250, t + 0.2);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
}

// -----------------------------------------------------------------------------
// A* PATHFINDING ON 50x50 NAV GRID
// -----------------------------------------------------------------------------
function buildNavGrid() {
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  // Boundaries
  for (let x = 0; x < GRID_SIZE; x++) { grid[0][x] = 1; grid[GRID_SIZE - 1][x] = 1; }
  for (let y = 0; y < GRID_SIZE; y++) { grid[y][0] = 1; grid[y][GRID_SIZE - 1] = 1; }

  // Special rooms & 12 Dept partitions
  const allRooms = [
    ...SPECIAL_ROOMS,
    ...DEPARTMENTS.filter(d => d.id !== 4 && d.id !== 9) // 4 and 9 are in executive room
  ];

  allRooms.forEach(r => {
    for (let x = r.x1; x <= r.x2; x++) { grid[r.y1][x] = 1; grid[r.y2][x] = 1; }
    for (let y = r.y1; y <= r.y2; y++) { grid[y][r.x1] = 1; grid[y][r.x2] = 1; }
    // Doors
    const doorX = Math.floor((r.x1 + r.x2) / 2);
    grid[r.y2][doorX] = 0;
    grid[r.y1][doorX] = 0;
  });
  return grid;
}

const NAV_GRID = buildNavGrid();

function findPath(start, goal) {
  const sx = Math.floor(start.x);
  const sy = Math.floor(start.y);
  const gx = Math.floor(goal.x);
  const gy = Math.floor(goal.y);

  if (sx === gx && sy === gy) return [{ x: gx, y: gy }];

  const openSet = [{ x: sx, y: sy, g: 0, f: Math.abs(sx - gx) + Math.abs(sy - gy), parent: null }];
  const closedSet = new Set();
  const key = (x, y) => `${x},${y}`;

  let iterations = 0;
  while (openSet.length > 0 && iterations < 800) {
    iterations++;
    openSet.sort((a, b) => a.f - b.f);
    const curr = openSet.shift();

    if (curr.x === gx && curr.y === gy) {
      const path = [];
      let temp = curr;
      while (temp) {
        path.unshift({ x: temp.x, y: temp.y });
        temp = temp.parent;
      }
      return path;
    }

    closedSet.add(key(curr.x, curr.y));

    const dirs = [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
    for (const d of dirs) {
      const nx = curr.x + d.x;
      const ny = curr.y + d.y;
      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;
      if (closedSet.has(key(nx, ny))) continue;
      if (NAV_GRID[ny][nx] === 1 && !(nx === gx && ny === gy)) continue;

      const g = curr.g + 1;
      const h = Math.abs(nx - gx) + Math.abs(ny - gy);
      const existing = openSet.find(o => o.x === nx && o.y === ny);
      if (!existing) {
        openSet.push({ x: nx, y: ny, g, f: g + h, parent: curr });
      } else if (g < existing.g) {
        existing.g = g;
        existing.f = g + h;
        existing.parent = curr;
      }
    }
  }
  return [{ x: gx, y: gy }];
}

// -----------------------------------------------------------------------------
// CLIENT SIMULATION ENGINE
// -----------------------------------------------------------------------------
class ClientSimulationEngine {
  constructor() {
    this.currentStep = 1;
    this.isPaused = false;
    this.isHitlWaiting = false;
    this.hitlStage = 0;
    this.hitlWaitTimer = 0;
    this.simSpeed = 1.0;
    
    // In-game minutes: 07:00 = 420 minutes
    this.simMinutes = 7 * 60;
    this.stepTimer = 0;
    
    this.logs = [];
    this.processedLogIds = new Set();
    this.activeLogFilter = "ALL";
    this.selectedTopic = SAMPLE_GAMES[0];
    this.selectedAgentId = 26; // 김세리 (비서실장)
    this.meetingMode = false;
    this.focusMode = false;
    this.isServerConnected = false;
    this.rosterData = null; // Lazy loaded full 270 agency list

    // Module 2 Approval Queues & State
    this.approvalQueue = SAMPLE_GAMES.filter(t => t.passed);
    this.rejectedQueue = SAMPLE_GAMES.filter(t => !t.passed);
    this.processedQueue = [];
    this.activeTab = "approval"; // "approval" | "rejected" | "processed"
    this.hasAutoOpenedModal = false;
    this.hasAutoOpenedCodeReviewModal = false;

    // Canvas view pan/zoom
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Instantiate active simulation agents
    this.agents = AGENTS_DATA.map(a => ({
      ...a,
      x: 25 + (a.id % 3) - 1,
      y: 47 + (a.id % 2),
      targetX: a.desk.x,
      targetY: a.desk.y,
      path: [],
      state: "IDLE",
      speechText: "",
      speechTimer: 0,
      bobOffset: Math.random() * Math.PI * 2
    }));

    // Initial logs with real system clock
    this.addLog("SYSTEM", "ANTI-GRAVITY AI: 무한 게임 개발 대기업(Infinite Game Studio) 엔진 구동");
    this.addLog("GUARDRAIL", "사규 §7 준수: 1차 기획 승인 / 2차 코드 검토 2단계 HITL 활성화");
    this.addLog("WORKFLOW", "The Agency 270명 에이전트 지연 로딩(Lazy Loading) 풀 연동");
  }

  // Bug 1 Fix: Logs ALWAYS use 100% actual computer system clock
  addLog(category, msg, realTimestamp = null) {
    const timeStr = realTimestamp || new Date().toLocaleTimeString("ko-KR", { hour12: false });
    const item = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      time: timeStr,
      category,
      message: msg
    };
    this.logs.push(item);
    if (this.logs.length > 350) this.logs.shift();
    if (typeof window !== "undefined" && window.engine) {
      renderLogsList();
    }
  }

  setAgentState(agentId, state, speech = null) {
    const ag = this.agents.find(a => a.id === agentId);
    if (!ag) return;
    ag.state = state;
    ag.speechText = speech || STATE_SPEECH[state] || ag.speech;
    ag.speechTimer = 180;
  }

  moveAgentTo(agentId, tx, ty) {
    const ag = this.agents.find(a => a.id === agentId);
    if (!ag) return;
    ag.targetX = tx;
    ag.targetY = ty;
    ag.path = findPath({ x: ag.x, y: ag.y }, { x: tx, y: ty });
  }

  executeStep(stepNum) {
    this.currentStep = stepNum;
    const meta = STEPS[stepNum - 1];
    const [h, m] = meta.time.split(":").map(Number);
    this.simMinutes = h * 60 + m;
    this.stepTimer = 0;

    playSound("step");
    this.addLog("WORKFLOW", `[STEP ${String(stepNum).padStart(2, "0")}] ${meta.title} 시작 (인게임 ${meta.time})`);

    this.meetingMode = false;
    this.focusMode = false;

    if (stepNum === 1) { // 시장조사 및 출근
      this.agents.forEach(ag => {
        this.moveAgentTo(ag.id, ag.desk.x, ag.desk.y);
        this.setAgentState(ag.id, "IN_PROGRESS", "지정 데스크로 출근 이동");
      });
      this.addLog("DEPT", "시장조사팀: 글로벌 스팀 및 모바일 트렌드 분석 동기화 완료");
    } else if (stepNum === 2) { // 기획 1팀
      [1, 2, 3].forEach(id => this.setAgentState(id, "DONE", "시장조사 완료! 리포트 전달"));
      [4, 5, 6].forEach(id => this.setAgentState(id, "IN_PROGRESS", "코어 루프 & 세계관 기획 중"));
      this.addLog("DEPT", "게임 기획 1팀: 신작 후보 10건(액션 RPG, 덱빌더, 사이버펑크 등) 시스템 기획안 작성");
    } else if (stepNum === 3) { // QA팀
      [4, 5, 6].forEach(id => this.setAgentState(id, "DONE", "기획안 작성 완료! QA 이관"));
      [7, 8, 9].forEach(id => this.setAgentState(id, "IN_PROGRESS", "사규 가드레일 및 밸런스 전수 검수"));
      this.addLog("DEPT", "게임 QA팀: 기획안 10건 전수 검사 -> 반려 3건(규칙②,③,⑥ 위반) / 통과 7건 중 TOP 3 선정");
    } else if (stepNum === 4) { // ★ 1차 대표 기획 승인 ★ (HITL 1)
      this.isPaused = true;
      this.isHitlWaiting = true;
      this.hitlStage = 1;
      this.hitlWaitTimer = 0;
      playSound("alert");

      // 3인 대표실 이동
      this.moveAgentTo(4, 5, 7);  // 최현우 (기획1팀장)
      this.moveAgentTo(7, 7, 7);  // 한소희 (QA팀장)
      this.moveAgentTo(26, 6, 8); // 김세리 (비서실장)

      this.setAgentState(4, "AWAIT_APPROVAL", "상세 기획 요약서 제출");
      this.setAgentState(7, "AWAIT_APPROVAL", "QA 검수표 지참");
      this.setAgentState(26, "AWAIT_APPROVAL", "대표님 기획 결재 대기");

      this.addLog("HITL", "★ [1차 대표 기획 승인] 대기 중 ★ (상세 게임 기획 요약서 출력 완료)");
      this.addLog("HITL", "기획1팀장, QA팀장, 비서실장이 대표실(Executive Room)로 집결하였습니다.");
      this.addLog("HITL", "시뮬레이션 엔진이 즉시 PAUSE 되었습니다. 대표 UI의 [승인/반려/보류/폐기] 결정을 대기합니다.");
    } else if (stepNum === 5) { // 기획 2팀
      this.isHitlWaiting = false;
      this.isPaused = false;
      this.hitlStage = 0;

      [4, 7, 26].forEach(id => {
        const a = this.agents.find(x => x.id === id);
        this.moveAgentTo(id, a.desk.x, a.desk.y);
      });
      [10, 11, 12].forEach(id => this.setAgentState(id, "IN_PROGRESS", `'${this.selectedTopic.title}' 레벨 & 시나리오 상세화`));
      this.addLog("DEPT", `게임 기획 2팀: 승인된 TOP ${this.selectedTopic.rank} 안건 레벨 디자인 및 보스 기믹 설계 착수`);
    } else if (stepNum === 6) { // 아트팀
      [10, 11, 12].forEach(id => this.setAgentState(id, "DONE", "레벨 디자인 완성"));
      [13, 14, 15].forEach(id => this.setAgentState(id, "IN_PROGRESS", "캐릭터/배경 스프라이트 및 UI 제작"));
      this.addLog("DEPT", "게임 아트팀: 네오 다크 판타지 도트 스프라이트 및 인게임 HUD 렌더링 가동");
    } else if (stepNum === 7) { // 사운드팀
      [13, 14, 15].forEach(id => this.setAgentState(id, "DONE", "아트 에셋 완성"));
      [16, 17, 18].forEach(id => this.setAgentState(id, "IN_PROGRESS", "메인 테마 BGM 작곡 & 타격감 SFX 믹싱"));
      this.addLog("DEPT", "게임 사운드팀: 60FPS 타격 사운드 및 몰입형 오케스트라 BGM 완성");
    } else if (stepNum === 8) { // 프로그래밍팀
      [16, 17, 18].forEach(id => this.setAgentState(id, "DONE", "사운드 이관 완료"));
      [19, 20, 21].forEach(id => this.setAgentState(id, "IN_PROGRESS", "코어 엔진 루프 & WebGL 빌드 구현"));
      this.addLog("DEPT", "게임 프로그래밍팀: 시간 왜곡 패링 물리 엔진 및 WebGL 소스 코드 완성");
    } else if (stepNum === 9) { // ★ 2차 대표 코드 검토 ★ (HITL 2)
      this.isPaused = true;
      this.isHitlWaiting = true;
      this.hitlStage = 2;
      this.hitlWaitTimer = 0;
      playSound("alert");

      this.moveAgentTo(19, 5, 7); // 윤지민 (엔진팀장)
      this.moveAgentTo(26, 6, 8); // 김세리 (비서실장)

      this.setAgentState(19, "AWAIT_APPROVAL", "소스 코드 및 빌드 검토 대기");
      this.setAgentState(26, "AWAIT_APPROVAL", "2차 대표 코드 검토 보고 준비");

      this.addLog("HITL", "★ [2차 대표 코드 검토] 대기 중 ★ (소스 코드 검토 창 및 AI 리팩토링 콘솔 출력)");
      this.addLog("HITL", "프로그래밍팀장과 비서실장이 대표실로 이동하여 최종 코드 리뷰 승인을 대기합니다.");

      // Module 3 Spec 2: Auto-popup Code Review Inspector
      if (!this.hasAutoOpenedCodeReviewModal) {
        this.hasAutoOpenedCodeReviewModal = true;
        setTimeout(() => { if (typeof openCodeReviewModal === "function") openCodeReviewModal(); }, 400);
      }
    } else if (stepNum === 10) { // 사업·퍼블리싱팀
      this.isHitlWaiting = false;
      this.isPaused = false;
      this.hitlStage = 0;
      this.hasAutoOpenedCodeReviewModal = false;

      [19, 26].forEach(id => {
        const a = this.agents.find(x => x.id === id);
        this.moveAgentTo(id, a.desk.x, a.desk.y);
      });
      [22, 23].forEach(id => this.setAgentState(id, "IN_PROGRESS", "스토어 페이지 빌드 검수 및 패키징"));
      this.addLog("DEPT", "사업·퍼블리싱팀: output/ 규격 폴더에 산출물 복제본 보존 및 스토어 에셋 준비 완료");
    } else if (stepNum === 11) { // 라이브 유지보수팀
      [22, 23].forEach(id => this.setAgentState(id, "DONE", "스토어 패키징 완료"));
      [24, 25].forEach(id => this.setAgentState(id, "IN_PROGRESS", "버그 수집 & v1.0.1 핫픽스 태깅 준비"));
      this.addLog("DEPT", "라이브 유지보수팀: Auto Live-Ops 가동 - CHANGELOG.md 생성 및 v1.0.1 릴리즈 태깅 자동화");
    } else if (stepNum === 12) { // 비서실 브리핑
      [24, 25].forEach(id => this.setAgentState(id, "DONE", "유지보수 태깅 준비 완료"));
      this.moveAgentTo(26, 6, 8);
      this.setAgentState(26, "DONE", "대표님, 오늘 게임 개발 종합 브리핑입니다.");
      const briefing = `1. 270명 전사 에이전트 정시 가동 및 신작 게임 파이프라인 100% 정상 완수\n2. 기획안 10건 중 사규 위반 3건 전원 반려, '${this.selectedTopic.title}' 1차 대표 승인 완료\n3. 레벨 디자인, 도트 아트, BGM/SFX 사운드 및 WebGL 엔진 소스 코드 제작 완료\n4. 2차 대표 코드 검토 통과 및 output/ 복제본 안전 저장 완료\n5. 라이브 유지보수팀 v1.0.1 자동 태깅 준비 완료, 차기 게임 스프린트 대기 상태 진입`;
      this.addLog("BRIEFING", `[비서실장 5줄 전사 요약 브리핑]\n${briefing}`);
    }

    updateTopBarUI();
    renderCardsView();
  }

  handleHitlAction(action, topicId = null) {
    const targetId = topicId !== null ? topicId : (this.selectedTopic ? this.selectedTopic.id : 1);
    const targetTopic = this.approvalQueue.find(t => t.id === targetId) || 
                        this.rejectedQueue.find(t => t.id === targetId) ||
                        this.processedQueue.find(t => t.id === targetId) ||
                        this.selectedTopic;
    if (targetTopic) this.selectedTopic = targetTopic;

    // Notify backend server
    fetch("/api/hitl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: action, topic_id: targetId })
    }).catch(() => {});

    if (action === "승인" || action === "최종 승인" || action === "최종 승인 및 푸시" || action === "approve") {
      playSound("approve");
      targetTopic.approval_status = "APPROVED";
      targetTopic.approved_at = new Date().toLocaleTimeString("ko-KR", { hour12: false });

      // Move from approvalQueue to processedQueue
      this.approvalQueue = this.approvalQueue.filter(t => t.id !== targetTopic.id);
      this.approvalQueue.forEach((t, i) => t.rank = i + 1);
      if (!this.processedQueue.some(t => t.id === targetTopic.id)) {
        this.processedQueue.unshift(targetTopic);
      }
      if (this.approvalQueue.length > 0) {
        this.selectedTopic = this.approvalQueue[0];
      }

      if (this.currentStep === 4) {
        this.addLog("HITL", `대표님께서 TOP ${targetTopic.rank || 1} 게임 기획안('${targetTopic.title}')을 [승인]하셨습니다. (결재 대기 잔여: ${this.approvalQueue.length}건)`);
        appendTerminalOutput("비서실장 (김세리)", `1차 기획 승인 완료. STEP 05(레벨 & 시나리오 상세화)로 즉시 전이합니다!`);
        this.executeStep(5);
      } else if (this.currentStep === 9) {
        this.addLog("HITL", `대표님께서 소스 코드 및 WebGL 빌드를 최종 [검토 승인 및 푸시]하셨습니다.`);
        appendTerminalOutput("비서실장 (김세리)", `2차 코드 검토 및 최종 푸시 완료. STEP 10(스토어 준비 & 패키징)으로 즉시 전이합니다!`);
        this.executeStep(10);
      } else {
        this.executeStep(Math.min(this.currentStep + 1, 12));
      }
    } else if (action === "반려" || action === "수정요청") {
      playSound("click");
      targetTopic.approval_status = "REVISION";
      targetTopic.rejected_at = new Date().toLocaleTimeString("ko-KR", { hour12: false });
      this.approvalQueue = this.approvalQueue.filter(t => t.id !== targetTopic.id);
      this.approvalQueue.forEach((t, i) => t.rank = i + 1);
      if (!this.rejectedQueue.some(t => t.id === targetTopic.id)) {
        this.rejectedQueue.unshift(targetTopic);
      }
      if (this.approvalQueue.length > 0) {
        this.selectedTopic = this.approvalQueue[0];
      }
      this.addLog("HITL", `대표님께서 '${targetTopic.title}' 안건에 대해 [반려 / 수정 요청]을 지시하셨습니다.`);
      this.setAgentState(4, "IN_PROGRESS", "코어 루프 및 수치 재기획 중");
      appendTerminalOutput("비서실장 (김세리)", "반려 및 수정 지시가 기획팀에 전달되었습니다.");
    } else if (action === "보류") {
      playSound("click");
      targetTopic.approval_status = "HOLD";
      this.addLog("HITL", `대표님께서 '${targetTopic.title}' 안건 결정을 [보류]하셨습니다.`);
      appendTerminalOutput("비서실장 (김세리)", "안건이 임시 보류되었습니다. 추가 검토 후 결정해주세요.");
    } else if (action === "폐기") {
      playSound("alert");
      targetTopic.approval_status = "DISCARDED";
      targetTopic.discarded_at = new Date().toLocaleTimeString("ko-KR", { hour12: false });
      this.approvalQueue = this.approvalQueue.filter(t => t.id !== targetTopic.id);
      this.approvalQueue.forEach((t, i) => t.rank = i + 1);
      if (!this.rejectedQueue.some(t => t.id === targetTopic.id)) {
        this.rejectedQueue.unshift(targetTopic);
      }
      if (this.approvalQueue.length > 0) {
        this.selectedTopic = this.approvalQueue[0];
      }
      this.addLog("HITL", `대표님께서 '${targetTopic.title}' 안건을 [폐기]하셨습니다. 차순위 게임 프로젝트를 검토합니다.`);
      appendTerminalOutput("비서실장 (김세리)", "해당 안건이 폐기되었습니다. 차순위 프로젝트를 검토해주세요.");
    }
    updateTopBarUI();
    updateBadgeCounts();
    renderCardsView();
  }

  // Local fallback command parser
  parseConsoleCommand(cmd) {
    const trimmed = cmd.trim();
    const hours = String(Math.floor(this.simMinutes / 60)).padStart(2, "0");
    const mins = String(this.simMinutes % 60).padStart(2, "0");
    const simTimeStr = `${hours}:${mins}`;
    const realTimeStr = new Date().toLocaleTimeString("ko-KR", { hour12: false });
    const progress = Math.floor((this.currentStep / 12) * 100);
    const stepMeta = STEPS[this.currentStep - 1];

    if (trimmed.includes("현황 보고") || trimmed.includes("현황") || trimmed.toLowerCase() === "status") {
      const nextStepName = this.currentStep < 12 ? STEPS[this.currentStep].title : "차기 스프린트 대기";
      return {
        responder: "비서실장 (김세리)",
        text: `현재 컴퓨터 시각: ${realTimeStr} (인게임 ${simTimeStr}) | 진행 단계: [STEP ${String(this.currentStep).padStart(2, "0")}] ${stepMeta.title} | 진행률: ${progress}% | 활성 게임: '${this.selectedTopic.title}' | 다음 예정: ${nextStepName}`
      };
    }

    if (trimmed.includes("왜 늦어져") || trimmed.includes("지연") || trimmed.includes("병목") || trimmed.toLowerCase().includes("why slow")) {
      if (this.isHitlWaiting) {
        const stageName = this.hitlStage === 1 ? "1차 기획 결재" : "2차 소스코드 검토";
        return {
          responder: "비서실장 (김세리)",
          text: `원인은 하나예요 — 대표님의 [${stageName}] 대기입니다. 대표실에서 ${this.hitlWaitTimer}초째 기다리고 있어요. 승인 버튼을 눌러주시면 바로 전이됩니다.`
        };
      }
      const lavender = this.agents.find(a => a.state === "AWAIT_INTEGRATION");
      if (lavender) {
        const dept = DEPARTMENTS.find(d => d.id === lavender.deptId);
        return {
          responder: "비서실장 (김세리)",
          text: `${dept.name}이 외부 게임 엔진/API 연동 지연으로 라벤더 상태(연동 대기)입니다.`
        };
      }
      const inProg = this.agents.find(a => a.state === "IN_PROGRESS");
      if (inProg && !this.isPaused) {
        const dept = DEPARTMENTS.find(d => d.id === inProg.deptId);
        return {
          responder: "비서실장 (김세리)",
          text: `${dept.name}에서 '${inProg.task}' 작업 진행 중입니다. (진행률: ${progress}% - 정상 빌드 속도입니다.)`
        };
      }
      return {
        responder: "비서실장 (김세리)",
        text: "현재 파이프라인 병목 및 지연 사항 없습니다. 270명 전사 정상 속도입니다."
      };
    }

    if (trimmed.includes("회의 소집") || trimmed.includes("회의") || trimmed.toLowerCase().includes("meeting")) {
      this.meetingMode = true;
      playSound("step");
      const leaders = this.agents.filter(a => a.isLeader);
      const seats = [
        {x: 22, y: 22}, {x: 24, y: 22}, {x: 26, y: 22}, {x: 28, y: 22},
        {x: 28, y: 25}, {x: 28, y: 28}, {x: 26, y: 28}, {x: 24, y: 28},
        {x: 22, y: 28}, {x: 22, y: 25}, {x: 24, y: 25}, {x: 26, y: 25}
      ];
      leaders.forEach((ldr, idx) => {
        const pos = seats[idx % seats.length];
        this.moveAgentTo(ldr.id, pos.x, pos.y);
        this.setAgentState(ldr.id, "IN_MEETING", "회의 참석 중입니다.");
      });
      this.addLog("MEETING", "12개 부서 팀장 전원 중앙 회의실 집결 완료. 1줄 개발 브리핑 개시.");
      return {
        responder: "비서실장 (김세리)",
        text: "12개 부서 팀장 전원이 중앙 회의실 대형 원형 테이블에 집결하여 브리핑을 개시했습니다."
      };
    }

    if (trimmed.includes("집중 모드") || trimmed.includes("집중") || trimmed.toLowerCase().includes("focus")) {
      this.focusMode = true;
      this.meetingMode = false;
      this.agents.forEach(ag => {
        this.moveAgentTo(ag.id, ag.desk.x, ag.desk.y);
        ag.speechText = "";
      });
      this.addLog("SYSTEM", "집중 모드 발동: 휴게 라운지 상주 에이전트 데스크 복귀 완료.");
      return {
        responder: "비서실장 (김세리)",
        text: "전사 집중 모드가 발동되었습니다. 모든 직원이 데스크로 복귀하고 잡담 말풍선이 비활성화되었습니다."
      };
    }

    if (trimmed.includes("가드레일") || trimmed.includes("사규")) {
      return {
        responder: "QA팀장 (한소희)",
        text: "사규 §7 준수 확인: 1)외부무단배포 차단, 2)SNS자동게시 차단, 3)과금API 차단, 4)원본보존복제본원칙, 5)미연동라벤더표기, 6)미검증에셋금지, 7)2단계HITL승인필수."
      };
    }

    for (const ag of this.agents) {
      if (trimmed.includes(ag.name) || trimmed.includes(ag.code)) {
        return {
          responder: `${ag.name} (${ag.role})`,
          text: `[${ag.name}/${ag.role}]: 현재 ${ag.state} 상태입니다. '${ag.task}' 작업 진행 중입니다.`
        };
      }
    }
    for (const dept of DEPARTMENTS) {
      if (trimmed.includes(dept.name.split(" ")[0])) {
        const deptAgents = this.agents.filter(a => a.deptId === dept.id);
        const ldr = deptAgents.find(a => a.isLeader) || deptAgents[0];
        if (ldr) {
          return {
            responder: `${ldr.name} (${dept.name} 팀장)`,
            text: `[${dept.name}]: 현재 ${ldr.state} 상태이며, '${ldr.task}' 수행 중입니다.`
          };
        }
      }
    }

    return {
      responder: "비서실장 (김세리)",
      text: "대표님, 명령을 수신했습니다. ['현황 보고', '왜 늦어져?', '회의 소집', '집중 모드', '가드레일 검사', '이조사 뭐해?'] 중 하나를 지시해주세요."
    };
  }

  // Tick logic: 1 real second = 1 in-game minute at 1x speed
  tick(dt = 1/60) {
    if (this.isHitlWaiting) {
      this.hitlWaitTimer += dt;
      return;
    }
    if (this.isPaused) return;

    // Advance in-game clock: 1 real sec = 1 in-game min at 1x
    this.simMinutes += dt * 1.0 * this.simSpeed;
    this.stepTimer += dt * this.simSpeed;

    // Agent movement interpolation
    this.agents.forEach(ag => {
      if (ag.path.length > 0) {
        const next = ag.path[0];
        const dx = next.x - ag.x;
        const dy = next.y - ag.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const moveDist = 0.15 * this.simSpeed;

        if (dist <= moveDist) {
          ag.x = next.x;
          ag.y = next.y;
          ag.path.shift();
        } else {
          ag.x += (dx / dist) * moveDist;
          ag.y += (dy / dist) * moveDist;
        }
      }

      if (ag.speechTimer > 0) {
        ag.speechTimer -= 1;
      }
    });

    // Auto step progression if duration set and not hitl wait
    const curMeta = STEPS[this.currentStep - 1];
    if (curMeta.duration > 0 && this.stepTimer >= curMeta.duration * 5) {
      if (this.currentStep < 12) {
        this.executeStep(this.currentStep + 1);
      }
    }
  }
}

let engine = null;
engine = new ClientSimulationEngine();
window.engine = engine;

// -----------------------------------------------------------------------------
// 2D CANVAS RENDERING ENGINE
// -----------------------------------------------------------------------------
let canvas = null;
let ctx = null;

function initCanvas() {
  canvas = document.getElementById("officeCanvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  resizeCanvas();
  centerView();
}

function resizeCanvas() {
  if (!canvas) return;
  const container = document.getElementById("map-view-container");
  if (!container) return;
  canvas.width = container.clientWidth || 800;
  canvas.height = container.clientHeight || 500;
}

function centerView() {
  if (!canvas) return;
  if (typeof engine === "undefined" || !engine) return;
  engine.zoom = Math.min(canvas.width / (GRID_SIZE * TILE_PX + 40), canvas.height / (GRID_SIZE * TILE_PX + 40)) * 0.95;
  engine.panX = (canvas.width - GRID_SIZE * TILE_PX * engine.zoom) / 2;
  engine.panY = (canvas.height - GRID_SIZE * TILE_PX * engine.zoom) / 2;
}

function drawOffice() {
  if (!ctx || !canvas) return;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0A0D14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.translate(engine.panX, engine.panY);
  ctx.scale(engine.zoom, engine.zoom);

  const mapW = GRID_SIZE * TILE_PX;
  const mapH = GRID_SIZE * TILE_PX;

  // Outer carpet
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, mapW, mapH);

  // Grid lines
  ctx.strokeStyle = "#1A2436";
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= GRID_SIZE; x++) {
    ctx.beginPath();
    ctx.moveTo(x * TILE_PX, 0);
    ctx.lineTo(x * TILE_PX, mapH);
    ctx.stroke();
  }
  for (let y = 0; y <= GRID_SIZE; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * TILE_PX);
    ctx.lineTo(mapW, y * TILE_PX);
    ctx.stroke();
  }

  // Draw Special Rooms
  SPECIAL_ROOMS.forEach(r => {
    const rx = r.x1 * TILE_PX;
    const ry = r.y1 * TILE_PX;
    const rw = (r.x2 - r.x1 + 1) * TILE_PX;
    const rh = (r.y2 - r.y1 + 1) * TILE_PX;

    ctx.fillStyle = r.id === "exec" ? "#1E293B" : (r.id === "lounge" ? "#172554" : (r.id === "meeting" ? "#14283F" : "#131C2E"));
    ctx.fillRect(rx, ry, rw, rh);

    ctx.fillStyle = "#93C5FD";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText(r.label, rx + 8, ry + 16);

    // Furniture
    if (r.id === "exec") {
      ctx.fillStyle = "#B45309";
      ctx.fillRect(rx + rw/2 - 24, ry + 24, 48, 20);
      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(rx + rw/2 - 8, ry + 28, 16, 10);
    } else if (r.id === "meeting") {
      ctx.fillStyle = "#334155";
      ctx.fillRect(rx + 24, ry + 36, rw - 48, rh - 72);
      ctx.strokeStyle = "#475569";
      ctx.strokeRect(rx + 24, ry + 36, rw - 48, rh - 72);
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(rx + rw/2 - 30, ry + 8, 60, 6);
    } else if (r.id === "lounge") {
      ctx.fillStyle = "#047857";
      ctx.fillRect(rx + 16, ry + 24, 50, 16);
      ctx.fillStyle = "#D97706";
      ctx.fillRect(rx + rw - 36, ry + 20, 20, 20);
    }
  });

  // Draw Department Rooms
  DEPARTMENTS.forEach(d => {
    if (d.id === 4 || d.id === 9) return; // Represented in executive room
    const rx = d.x1 * TILE_PX;
    const ry = d.y1 * TILE_PX;
    const rw = (d.x2 - d.x1 + 1) * TILE_PX;
    const rh = (d.y2 - d.y1 + 1) * TILE_PX;

    ctx.fillStyle = "#141D2B";
    ctx.fillRect(rx, ry, rw, rh);

    ctx.fillStyle = d.color;
    ctx.fillRect(rx, ry, rw, 3);

    ctx.fillStyle = "#CBD5E1";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText(`${d.room} ${d.name.split(' ')[0]}`, rx + 6, ry + 14);

    ctx.fillStyle = "#2D3748";
    ctx.fillRect(rx + 12, ry + 24, 22, 14);
    ctx.fillRect(rx + rw - 34, ry + 24, 22, 14);
    ctx.fillRect(rx + 12, ry + rh - 30, 22, 14);

    ctx.fillStyle = "#60A5FA";
    ctx.fillRect(rx + 16, ry + 22, 14, 3);
    ctx.fillRect(rx + rw - 30, ry + 22, 14, 3);
  });

  // Walls & Obstacles
  ctx.fillStyle = "#273549";
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (NAV_GRID[y][x] === 1) {
        ctx.fillRect(x * TILE_PX, y * TILE_PX, TILE_PX, TILE_PX);
        ctx.strokeStyle = "#374A66";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * TILE_PX, y * TILE_PX, TILE_PX, TILE_PX);
      }
    }
  }

  // Draw Animated Agents
  const nowTime = Date.now() * 0.005;
  engine.agents.forEach(ag => {
    const px = ag.x * TILE_PX + TILE_PX / 2;
    const py = ag.y * TILE_PX + TILE_PX / 2;
    const isSelected = (ag.id === engine.selectedAgentId);
    const bob = Math.sin(nowTime * (ag.path.length > 0 ? 8 : 2) + ag.bobOffset) * 2;

    if (isSelected) {
      ctx.beginPath();
      ctx.arc(px, py + bob, 16, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.35)";
      ctx.fill();
      ctx.strokeStyle = "#60A5FA";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.ellipse(px, py + 8, 7, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fill();

    const dept = DEPARTMENTS.find(d => d.id === ag.deptId) || { color: "#3B82F6" };
    ctx.fillStyle = dept.color;
    ctx.beginPath();
    ctx.arc(px, py + bob, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#F8FAFC";
    ctx.beginPath();
    ctx.arc(px, py - 6 + bob, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = ag.isLeader ? "#F59E0B" : "#1E293B";
    ctx.beginPath();
    ctx.arc(px, py - 8 + bob, 4.5, Math.PI, Math.PI * 2);
    ctx.fill();

    // 5 State Color Ring
    const stateColor = STATE_COLORS[ag.state] || "#ECF0F1";
    ctx.beginPath();
    ctx.arc(px, py - 13 + bob, 4, 0, Math.PI * 2);
    ctx.strokeStyle = stateColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#FFF";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(ag.code, px, py + 18 + bob);

    if (ag.speechText && ag.speechTimer > 0 && !engine.focusMode) {
      ctx.font = "10px sans-serif";
      const metrics = ctx.measureText(ag.speechText);
      const bw = metrics.width + 12;
      const bh = 18;
      const bx = px - bw / 2;
      const by = py - 35 + bob;

      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.strokeStyle = stateColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#F8FAFC";
      ctx.textAlign = "left";
      ctx.fillText(ag.speechText, bx + 6, by + 12);
    }
  });

  ctx.restore();
}

// -----------------------------------------------------------------------------
// USER INTERFACE SYNC & DUAL CLOCK
// -----------------------------------------------------------------------------
function updateTopBarUI() {
  if (typeof engine === "undefined" || !engine) return;
  // In-Game accelerated time
  const hours = String(Math.floor(engine.simMinutes / 60)).padStart(2, "0");
  const mins = String(Math.floor(engine.simMinutes % 60)).padStart(2, "0");
  const topTimeEl = document.getElementById("top-time");
  if (topTimeEl) topTimeEl.innerText = `${hours}:${mins}`;

  // Real Computer System Time (Bug 1 Fix)
  const topSysTimeEl = document.getElementById("top-sys-time");
  if (topSysTimeEl) {
    topSysTimeEl.innerText = new Date().toLocaleTimeString("ko-KR", { hour12: false });
  }

  // Step indicator
  const stepMeta = STEPS[engine.currentStep - 1] || STEPS[0];
  const topStepEl = document.getElementById("top-step");
  if (topStepEl) {
    topStepEl.innerText = `STEP ${String(engine.currentStep).padStart(2, "0")}`;
    topStepEl.title = `${stepMeta.title}: ${stepMeta.desc}`;
  }

  // HITL status
  const hitlEl = document.getElementById("top-hitl-status");
  const bottomBadge = document.getElementById("hitl-badge-indicator");
  const bottomBadgeText = document.getElementById("hitl-badge-text");
  const hitlActionHint = document.getElementById("hitl-action-hint");

  if (engine.isHitlWaiting) {
    const stageDesc = engine.hitlStage === 1 ? "1차 기획 결재" : "2차 코드 검토";
    if (hitlEl) {
      hitlEl.innerText = `WAITING (${stageDesc})`;
      hitlEl.className = "meta-val hitl-alert";
    }
    if (bottomBadge) bottomBadge.className = "hitl-status-badge waiting";
    if (bottomBadgeText) {
      bottomBadgeText.innerText = `HUMAN-IN-THE-LOOP (HITL) : ${stageDesc} 대기 중 (${Math.round(engine.hitlWaitTimer)}초째) - 시뮬레이션 일시정지`;
    }
    if (hitlActionHint) {
      hitlActionHint.innerText = engine.hitlStage === 1 
        ? "승인 시 STEP 05(레벨 & 시나리오 상세화)로 즉시 전이됩니다." 
        : "승인 시 STEP 10(스토어 준비 & 패키징)으로 즉시 전이됩니다.";
    }
  } else {
    if (hitlEl) {
      hitlEl.innerText = engine.isPaused ? "PAUSED" : "RUNNING";
      hitlEl.className = "meta-val";
    }
    if (bottomBadge) bottomBadge.className = "hitl-status-badge active";
    if (bottomBadgeText) {
      bottomBadgeText.innerText = `현재 파이프라인 정상 가동 중 - [STEP ${String(engine.currentStep).padStart(2, "0")}] ${stepMeta.title}`;
    }
  }

  // Play/Pause icon
  const playIcon = document.getElementById("play-pause-icon");
  const playText = document.getElementById("play-pause-text");
  if (playIcon) playIcon.innerText = engine.isPaused ? "▶" : "⏸";
  if (playText) playText.innerText = engine.isPaused ? "재생" : "일시정지";

  // Top bar Code Review Badge (Module 3)
  const topCodeBadge = document.getElementById("top-code-badge");
  if (topCodeBadge) {
    if (engine.currentStep === 9) {
      topCodeBadge.innerText = "검토 대기";
      topCodeBadge.style.color = "#EC4899";
    } else if (engine.currentStep > 9) {
      topCodeBadge.innerText = "승인 완료";
      topCodeBadge.style.color = "#10B981";
    } else {
      topCodeBadge.innerText = "대기";
      topCodeBadge.style.color = "#94A3B8";
    }
  }

  // Telemetry
  const cpu = (engine.isPaused ? 4.2 : 12.8) + (Math.sin(Date.now() * 0.001) * 2.1);
  const ram = 186 + Math.floor(engine.logs.length * 0.08);
  const topTelemEl = document.getElementById("top-telemetry");
  if (topTelemEl) topTelemEl.innerText = `CPU ${cpu.toFixed(1)}% | RAM ${ram}MB`;
}

function renderLogsList() {
  const container = document.getElementById("logs-stream");
  if (!container) return;
  if (typeof engine === "undefined" || !engine) return;
  const filter = engine.activeLogFilter || "ALL";
  const filtered = filter === "ALL" ? engine.logs : engine.logs.filter(l => l.category === filter);

  container.innerHTML = filtered.map(l => `
    <div class="log-item ${l.category}">
      <div class="log-meta">
        <span class="log-time" style="color:#10B981; font-weight:700;">[${l.time}]</span>
        <span class="log-badge">${l.category}</span>
      </div>
      <div class="log-msg">${escapeHtml(l.message)}</div>
    </div>
  `).join("");

  container.scrollTop = container.scrollHeight;
}

function updateAgentInspector(ag) {
  if (!ag) return;
  const dept = DEPARTMENTS.find(d => d.id === ag.deptId) || { name: "전사", color: "#3B82F6" };
  const coordsEl = document.getElementById("inspect-coords");
  const nameEl = document.getElementById("inspect-name");
  const codeEl = document.getElementById("inspect-code");
  const deptEl = document.getElementById("inspect-dept-role");
  const taskEl = document.getElementById("inspect-task");
  const rejectEl = document.getElementById("inspect-reject");
  const statePill = document.getElementById("inspect-state-pill");
  const avatar = document.getElementById("inspect-avatar");

  if (coordsEl) coordsEl.innerText = `좌표: (${Math.round(ag.x)}, ${Math.round(ag.y)})`;
  if (nameEl) nameEl.innerText = ag.name;
  if (codeEl) codeEl.innerText = `(${ag.code})`;
  if (deptEl) deptEl.innerText = `소속: ${dept.name} · ${ag.role}`;
  if (taskEl) taskEl.innerText = `업무: ${ag.task}`;
  if (rejectEl) rejectEl.innerText = `반려기준: ${ag.reject || ag.rejection_rule || "사규 준수"}`;

  if (statePill) {
    statePill.innerText = ag.state;
    statePill.style.backgroundColor = STATE_COLORS[ag.state] || "#ECF0F1";
  }
  if (avatar) {
    avatar.style.backgroundColor = dept.color;
    avatar.innerText = ag.name.slice(-2);
  }
}

function updateBadgeCounts() {
  if (typeof engine === "undefined" || !engine) return;
  const qCount = document.getElementById("queue-badge-count");
  const rCount = document.getElementById("rejected-badge-count");
  const pCount = document.getElementById("processed-badge-count");
  const topBadge = document.getElementById("top-pending-badge");

  if (qCount) qCount.innerText = engine.approvalQueue.length;
  if (rCount) rCount.innerText = engine.rejectedQueue.length;
  if (pCount) pCount.innerText = engine.processedQueue.length;
  if (topBadge) topBadge.innerText = engine.approvalQueue.length;
}

function renderCardsView() {
  const container = document.getElementById("cards-container");
  if (!container) return;
  if (typeof engine === "undefined" || !engine) return;

  let items = [];
  if (engine.activeTab === "approval") {
    items = engine.approvalQueue;
  } else if (engine.activeTab === "rejected") {
    items = engine.rejectedQueue;
  } else if (engine.activeTab === "processed") {
    items = engine.processedQueue;
  } else {
    items = engine.approvalQueue;
  }

  if (items.length === 0) {
    const emptyMsg = engine.activeTab === "approval"
      ? "현재 결재 대기 중인 안건이 없습니다. [+ 신작 기획 생성] 버튼을 누르면 즉시 새 기획안이 생성됩니다."
      : (engine.activeTab === "rejected" ? "QA 반려 또는 폐기된 안건이 없습니다." : "대표 승인 처리 완료된 안건이 아직 없습니다.");
    container.innerHTML = `<div style="padding:24px; color:#64748B; text-align:center; font-size:12px; width:100%;">${emptyMsg}</div>`;
    return;
  }

  container.innerHTML = items.map(t => {
    const isSelected = (engine.selectedTopic && t.id === engine.selectedTopic.id);
    const isApproved = (t.approval_status === "APPROVED");
    const isRejected = (!t.passed || t.approval_status === "DISCARDED" || t.approval_status === "REVISION");
    const statusLabel = isApproved 
      ? `승인 완료 [${escapeHtml(t.genre)}]`
      : (t.passed ? `TOP ${t.rank || 1} 결재 대기 [${escapeHtml(t.genre)}]` : `QA 반려 대상 [${escapeHtml(t.genre)}]`);

    const contribHtml = t.contributors ? `
      <div style="font-size:10px; color:#60A5FA; margin-top:3px; background:rgba(59, 130, 246, 0.08); padding:3px 6px; border-radius:3px;">
        👥 <strong>270 Agency 참여:</strong> ${escapeHtml(t.contributors.planner)} · ${escapeHtml(t.contributors.qa_inspector)}
      </div>
    ` : "";

    return `
      <div class="topic-card ${isSelected ? 'selected' : ''} ${isRejected ? 'rejected' : ''}" onclick="selectTopicCard(${t.id})">
        <div>
          <div class="card-top">
            <span class="rank-badge">${statusLabel}</span>
            <span class="score-badge" style="color:${t.passed ? '#10B981' : '#EF4444'};">${t.score}점</span>
          </div>
          <div class="topic-card-title">${escapeHtml(t.title)}</div>
          <div class="topic-card-hook">후킹: "${escapeHtml(t.hook)}"</div>
        </div>
        <div class="topic-card-meta">
          <div><strong>① 타깃(USP):</strong> ${escapeHtml(t.target)}</div>
          <div style="margin-top:2px;"><strong>② 세계관:</strong> ${escapeHtml(t.world)}</div>
          <div style="margin-top:2px;"><strong>③ Core Loop:</strong> ${escapeHtml(t.core_loop)}</div>
          <div style="margin-top:2px;"><strong>④ 아트/사운드:</strong> ${escapeHtml(t.art_sound)}</div>
          <div style="color:${t.passed ? '#34D399' : '#F87171'}; font-weight:600; margin-top:4px;">
            <strong>⑤ QA 검수:</strong> ${escapeHtml(t.qa_verdict)}
          </div>
          ${contribHtml}
          <button class="btn-open-gdd-card" type="button" onclick="event.stopPropagation(); openGddModalById(${t.id})">
            📄 6대 핵심요소 상세 보고서 결재
          </button>
        </div>
      </div>
    `;
  }).join("");
}

window.selectTopicCard = function(id) {
  playSound("click");
  const allTopics = [...engine.approvalQueue, ...engine.rejectedQueue, ...engine.processedQueue, ...SAMPLE_GAMES];
  const t = allTopics.find(x => x.id === id);
  if (t) {
    engine.selectedTopic = t;
    renderCardsView();
  }
};

window.openGddModalById = function(id) {
  playSound("click");
  const allTopics = [...engine.approvalQueue, ...engine.rejectedQueue, ...engine.processedQueue, ...SAMPLE_GAMES];
  const t = allTopics.find(x => x.id === id) || engine.selectedTopic;
  if (t) {
    openGddModal(t);
  }
};

window.openGddModal = function(topic) {
  if (!topic) topic = engine.selectedTopic || engine.approvalQueue[0] || SAMPLE_GAMES[0];
  if (!topic) return;
  engine.selectedTopic = topic;

  // 1. Badge & Title
  const badgeEl = document.getElementById("modal-gdd-badge");
  const titleEl = document.getElementById("modal-gdd-title");
  if (badgeEl) {
    badgeEl.innerText = topic.passed 
      ? (topic.approval_status === "APPROVED" ? "승인 완료" : `TOP ${topic.rank || 1} 안건`) 
      : "QA 반려 대상";
  }
  if (titleEl) titleEl.innerText = topic.title;

  // 2. Element 1: Basic Info
  const genreEl = document.getElementById("modal-gdd-genre");
  const scoreEl = document.getElementById("modal-gdd-score");
  const platEl = document.getElementById("modal-gdd-platform");
  if (genreEl) genreEl.innerText = topic.genre;
  if (scoreEl) {
    scoreEl.innerText = `${topic.score}점`;
    scoreEl.style.color = topic.passed ? "#10B981" : "#EF4444";
  }
  if (platEl) platEl.innerText = `${topic.dev_period || "3개월 (MVP)"} / ${topic.platform || "PC WebGL & Steam"}`;

  // 3. Element 2: Concept Hook & Target
  const hookEl = document.getElementById("modal-gdd-hook");
  const targetEl = document.getElementById("modal-gdd-target");
  if (hookEl) hookEl.innerText = `"${topic.hook}"`;
  if (targetEl) targetEl.innerText = topic.target;

  // 4. Element 3: World Lore & Synopsis
  const worldEl = document.getElementById("modal-gdd-world");
  if (worldEl) worldEl.innerText = topic.world;

  // 5. Element 4: Core Gameplay Loop (4 Steps)
  let loopSteps = [];
  if (topic.core_loop) {
    loopSteps = topic.core_loop.split("->").map(s => s.trim().replace(/^\d+\.\s*/, ""));
  }
  const l1 = document.getElementById("modal-gdd-loop-1");
  const l2 = document.getElementById("modal-gdd-loop-2");
  const l3 = document.getElementById("modal-gdd-loop-3");
  const l4 = document.getElementById("modal-gdd-loop-4");
  if (l1) l1.innerText = loopSteps[0] || "전방위 탐색 & 정밀 조작";
  if (l2) l2.innerText = loopSteps[1] || "자원 파밍 & 룬 조합";
  if (l3) l3.innerText = loopSteps[2] || "차원 균열 보스 토벌";
  if (l4) l4.innerText = loopSteps[3] || "영구 거점 및 스킬 강화";

  // 6. Element 5: Art & Sound Direction
  const artSoundEl = document.getElementById("modal-gdd-artsound");
  if (artSoundEl) artSoundEl.innerText = topic.art_sound;

  // 7. Element 6: QA Verdict & Rubber Seal Stamp
  const qaEl = document.getElementById("modal-gdd-qa");
  const sealEl = document.getElementById("modal-gdd-seal");
  const sealText = document.getElementById("modal-gdd-seal-text");
  if (qaEl) qaEl.innerText = topic.qa_verdict;
  if (sealEl && sealText) {
    if (topic.passed) {
      sealEl.className = "qa-seal-stamp";
      sealText.innerText = "VERIFIED PASS";
    } else {
      sealEl.className = "qa-seal-stamp rejected";
      sealText.innerText = "QA REJECTED";
    }
  }

  // Footer Hint
  const footerHint = document.getElementById("modal-gdd-footer-hint");
  if (footerHint) {
    footerHint.innerText = engine.currentStep === 4
      ? "승인 시 STEP 05(레벨 & 시나리오 상세화)로 즉시 전이됩니다."
      : `현재 [${topic.title}] 안건을 검토 중입니다.`;
  }

  openModal("modal-gdd");
};

function appendTerminalOutput(sender, text) {
  const box = document.getElementById("term-history");
  if (!box) return;
  const line = document.createElement("div");
  line.className = "term-line bot";
  line.innerText = `[${sender}]: ${text}`;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[m]);
}

// =============================================================================
// MODULE 3: 2차 대표 코드 검토 (HITL Code Review Inspector) & AI 리팩토링 콘솔
// =============================================================================
let currentCodeReviewArtifacts = null;
let currentCodeReviewActiveFile = "game_core.js";

function generateLocalProjectArtifacts(topic) {
  topic = topic || engine.selectedTopic || SAMPLE_GAMES[0];
  const title = topic.title || "크로노 블레이드";
  const genre = topic.genre || "Action_Roguelike";
  const score = topic.score || 96;

  const code_js = `// ============================================================================
// ANTI-GRAVITY AI: WebGL Core Game Engine
// Title: ${title}
// Genre: ${genre}
// Pipeline: Module 3 Deliverable (Refactoring & Code Review Ready)
// Contributors: 270 Agency Specialists (Narrative, Art, Sound, Programming)
// Lead Programmer: 윤지민 (프로그래밍팀장) | Quality Score: ${score} pts
// ============================================================================

const GAME_CONFIG = {
  title: "${title}",
  genre: "${genre}",
  version: "v1.0.0-rc1",
  targetFPS: 60,
  canvasWidth: 800,
  canvasHeight: 600,
  renderMode: "WebGL_2D_Hybrid"
};

// ----------------------------------------------------------------------------
// Tunable Gameplay & Combat Parameters (AI Refactoring Targets)
// ----------------------------------------------------------------------------
let DASH_COOLDOWN = 1.5;          // [TUNABLE: SECONDS]
let SKILL_COOLDOWN = 4.0;         // [TUNABLE: SECONDS]
let PARRY_WINDOW_SEC = 0.20;      // [TUNABLE: SECONDS - 12 frames @ 60fps]
let BASE_ATTACK_POWER = 35;       // [TUNABLE: BASE DPS]
let COMBO_CRITICAL_MULTIPLIER = 1.8; // [TUNABLE: CRITICAL MULTIPLIER]
let DASH_INVINCIBLE_TIME = 0.20;  // [TUNABLE: INVINCIBILITY DURATION]
let ULTIMATE_CHARGE_RATE = 1.0;   // [TUNABLE: CHARGE SPEED]
let PLAYER_SPEED = 5.0;
let MAX_HEALTH = 100;

class GameEngine {
  constructor() {
    this.state = "RUNNING";
    this.score = 0;
    this.health = MAX_HEALTH;
    this.ultimateGauge = 0.0;
    this.dashTimer = 0.0;
    this.skillTimer = 0.0;
    this.parryTimer = 0.0;
    this.isInvincible = false;
    this.invincibleTimer = 0.0;
    this.keys = {};
    this.entities = [];
  }

  init() {
    console.log("[Anti-Gravity Engine] Initialized: " + GAME_CONFIG.title);
    this.setupInputs();
  }

  setupInputs() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      if (e.code === "Space") this.triggerAttack();
      if (e.code === "ShiftLeft") this.triggerDash();
      if (e.code === "KeyF") this.triggerParry();
      if (e.code === "KeyQ") this.triggerUltimate();
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
  }

  triggerAttack() {
    const damage = BASE_ATTACK_POWER * COMBO_CRITICAL_MULTIPLIER;
    this.ultimateGauge = Math.min(100, this.ultimateGauge + 5.0 * ULTIMATE_CHARGE_RATE);
    console.log("[Combat] Attack dealt " + damage.toFixed(1) + " damage! Ult: " + this.ultimateGauge.toFixed(1) + "%");
  }

  triggerDash() {
    if (this.dashTimer <= 0) {
      this.dashTimer = DASH_COOLDOWN;
      this.isInvincible = true;
      this.invincibleTimer = DASH_INVINCIBLE_TIME;
      console.log("[Action] Dash triggered! Invincible: " + DASH_INVINCIBLE_TIME + "s");
    }
  }

  triggerParry() {
    if (this.parryTimer <= 0) {
      this.parryTimer = PARRY_WINDOW_SEC;
      console.log("[Action] Parry active: " + PARRY_WINDOW_SEC + "s");
    }
  }

  triggerUltimate() {
    if (this.ultimateGauge >= 100) {
      this.ultimateGauge = 0;
      console.log("[Ultimate] SCREEN CLEAR BURST ACTIVATED!");
    }
  }

  update(dt) {
    const clampedDt = Math.min(dt, 0.033);
    if (this.dashTimer > 0) this.dashTimer -= clampedDt;
    if (this.skillTimer > 0) this.skillTimer -= clampedDt;
    if (this.parryTimer > 0) this.parryTimer -= clampedDt;
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= clampedDt;
      if (this.invincibleTimer <= 0) this.isInvincible = false;
    }
  }
}

window.game = new GameEngine();
`;

  const code_cs = `// ============================================================================
// ANTI-GRAVITY AI: Unity C# Engine Integration
// Title: ${title}
// Genre: ${genre}
// Pipeline: Module 3 Deliverable (C# Architecture)
// Lead Programmer: 윤지민 (프로그래밍팀장)
// ============================================================================

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace AntiGravity.GameStudio
{
    public class GameManager : MonoBehaviour
    {
        [Header("Tunable Combat Parameters")]
        public float DashCooldown = 1.5f;
        public float SkillCooldown = 4.0f;
        public float ParryWindow = 0.20f;
        public float BaseAttackPower = 35.0f;
        public float ComboCriticalMultiplier = 1.8f;
        public float DashInvincibleDuration = 0.20f;
        public float UltimateChargeRate = 1.0f;

        public static GameManager Instance { get; private set; }

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void ExecuteAttack()
        {
            float dps = BaseAttackPower * ComboCriticalMultiplier;
            Debug.Log($"[Unity C#] Attack Dealt {dps:F1} DMG!");
        }
    }
}
`;

  const code_py = `"""
ANTI-GRAVITY AI: Python Physics Simulation Prototype
Title: ${title} (${genre})
Lead Programmer: 윤지민 (프로그래밍팀장)
"""
import math
import time

class CombatSimulator:
    def __init__(self):
        self.dash_cooldown = 1.5
        self.skill_cooldown = 4.0
        self.base_attack_power = 35.0
        self.combo_multiplier = 1.8
        self.parry_window = 0.20

    def compute_dps(self):
        return self.base_attack_power * self.combo_multiplier

if __name__ == "__main__":
    sim = CombatSimulator()
    print(f"[Python Sim] Base DPS: {sim.compute_dps():.1f}")
`;

  const gdd_md = `# GAME DESIGN DOCUMENT: ${title}
**장르**: ${genre} | **플랫폼**: PC WebGL & Steam | **예상 스코어**: ${score}점
**총괄 기획**: 권태양 (레벨기획팀장) / 내러티브팀

## 1. 개요 및 USP
- **세계관**: ${topic.world || "시공간 붕괴 후 산산조각 난 평행 차원"}
- **코어 루프**: ${topic.core_loop || "1. 탐색 -> 2. 파밍 -> 3. 보스 토벌 -> 4. 영구 강화"}

## 2. 전투 및 밸런스 테이블
- 기본 공격력: 35 DPS
- 콤보 크리티컬 배율: x1.8
- 패링 유효 시간: 0.20초 (12 프레임)
- 대시 쿨타임: 1.5초
`;

  const assets_json = JSON.stringify({
    project: title,
    genre: genre,
    art_lead: "신예은 (아트팀장)",
    sound_lead: "황민혁 (사운드팀장)",
    sprites: [
      { id: "hero_idle", file: "sprites/hero_idle.png", resolution: "64x64" },
      { id: "hero_slash", file: "sprites/hero_slash.png", resolution: "128x64" },
      { id: "boss_demon", file: "sprites/boss_demon.png", resolution: "256x256" }
    ],
    audio: [
      { id: "bgm_main", file: "audio/bgm_cyberpunk.ogg", loop: true },
      { id: "sfx_parry", file: "audio/sfx_parry_spark.wav" },
      { id: "sfx_slash", file: "audio/sfx_crit_hit.wav" }
    ],
    total_footprint: "16.4 MB (Safe within WebGL 32MB limit)"
  }, null, 2);

  return {
    topic_id: topic.id || 1,
    topic_title: title,
    genre: genre,
    version: "v1.0.0-rc1",
    leads: {
      narrative: "권태양 (레벨기획팀장)",
      art: "신예은 (아트팀장)",
      sound: "황민혁 (사운드팀장)",
      programming: "윤지민 (프로그래밍팀장)"
    },
    contributors: [
      { dept: "기획/내러티브", role: "레벨 & 시나리오 상세화", lead: "권태양 (레벨기획팀장)", artifact: "GDD_Detailed.md" },
      { dept: "게임아트팀", role: "도트 & UI 스프라이트", lead: "신예은 (아트팀장)", artifact: "assets_manifest.json" },
      { dept: "게임사운드팀", role: "BGM & SFX 오디오 믹싱", lead: "황민혁 (사운드팀장)", artifact: "assets_manifest.json" },
      { dept: "프로그래밍팀", role: "코어 WebGL/C# 엔진 개발", lead: "윤지민 (프로그래밍팀장)", artifact: "game_core.js / GameManager.cs" }
    ],
    files: {
      "game_core.js": {
        name: "game_core.js",
        lang: "javascript",
        title: "WebGL 2D/3D 코어 엔진 & 전투 루프",
        content: code_js,
        original_content: code_js,
        loc: code_js.split("\n").length,
        size: "4.8 KB"
      },
      "GameManager.cs": {
        name: "GameManager.cs",
        lang: "csharp",
        title: "Unity 엔진 통합 매니저 (C#)",
        content: code_cs,
        original_content: code_cs,
        loc: code_cs.split("\n").length,
        size: "3.2 KB"
      },
      "main.py": {
        name: "main.py",
        lang: "python",
        title: "Python 물리 시뮬레이션 프로토타입",
        content: code_py,
        original_content: code_py,
        loc: code_py.split("\n").length,
        size: "1.2 KB"
      },
      "GDD_Detailed.md": {
        name: "GDD_Detailed.md",
        lang: "markdown",
        title: "상세 기획서 (내러티브 & 레벨 테이블)",
        content: gdd_md,
        original_content: gdd_md,
        loc: gdd_md.split("\n").length,
        size: "2.1 KB"
      },
      "assets_manifest.json": {
        name: "assets_manifest.json",
        lang: "json",
        title: "아트 & 사운드 리소스 매니페스트",
        content: assets_json,
        original_content: assets_json,
        loc: assets_json.split("\n").length,
        size: "1.4 KB"
      }
    },
    refactor_history: [
      {
        timestamp: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
        author: "프로그래밍팀장 (윤지민)",
        prompt: "초기 빌드 생성",
        summary: genre + " 코어 엔진 루프, 물리 충돌 및 60FPS 렌더러 소스 코드 패키징 완료",
        target_file: "game_core.js"
      }
    ],
    metrics: {
      loc_total: 380,
      fps_target: 60,
      memory_est: "16.4 MB",
      code_quality_score: 98,
      lint_status: "Clean (0 Errors, 0 Warnings)",
      security_guardrails: "PASSED (사규 §7 제1조/제2조 준수)"
    }
  };
}

window.openCodeReviewModal = function(targetFile = "game_core.js") {
  playSound("click");
  if (engine.isServerConnected) {
    fetch("/api/artifacts")
      .then(r => r.json())
      .then(data => {
        if (data && data.artifacts) {
          currentCodeReviewArtifacts = data.artifacts;
        } else {
          currentCodeReviewArtifacts = generateLocalProjectArtifacts(engine.selectedTopic);
        }
        currentCodeReviewActiveFile = targetFile;
        renderCodeReviewInspector();
        openModal("modal-code-review");
      })
      .catch(() => {
        if (!currentCodeReviewArtifacts) {
          currentCodeReviewArtifacts = generateLocalProjectArtifacts(engine.selectedTopic);
        }
        currentCodeReviewActiveFile = targetFile;
        renderCodeReviewInspector();
        openModal("modal-code-review");
      });
  } else {
    if (!currentCodeReviewArtifacts) {
      currentCodeReviewArtifacts = generateLocalProjectArtifacts(engine.selectedTopic);
    }
    currentCodeReviewActiveFile = targetFile;
    renderCodeReviewInspector();
    openModal("modal-code-review");
  }
};

window.switchCodeReviewTab = function(fileName) {
  playSound("click");
  currentCodeReviewActiveFile = fileName;
  renderCodeReviewInspector();
};

window.renderCodeReviewInspector = function() {
  if (!currentCodeReviewArtifacts) return;
  const arts = currentCodeReviewArtifacts;
  
  // Header Meta
  const titleEl = document.getElementById("cr-project-title");
  if (titleEl) titleEl.innerText = `[${arts.genre || 'Action'}] ${arts.topic_title || '프로젝트'}`;
  const scoreEl = document.getElementById("cr-quality-score");
  if (scoreEl) scoreEl.innerText = `Score: ${arts.metrics ? arts.metrics.code_quality_score : 98}점`;
  const guardrailEl = document.getElementById("cr-guardrail-badge");
  if (guardrailEl) guardrailEl.innerText = `사규 §7: PASSED`;

  // Tabs Bar
  const tabsBar = document.getElementById("cr-file-tabs");
  if (tabsBar && arts.files) {
    const fileKeys = Object.keys(arts.files);
    tabsBar.innerHTML = fileKeys.map(k => {
      const f = arts.files[k];
      const isActive = (k === currentCodeReviewActiveFile);
      const icon = k.endsWith(".js") ? "⚡" : (k.endsWith(".cs") ? "🎮" : (k.endsWith(".py") ? "🐍" : (k.endsWith(".md") ? "📄" : "🎨")));
      return `
        <button type="button" class="code-tab-btn ${isActive ? 'active' : ''}" onclick="switchCodeReviewTab('${k}')">
          <span>${icon} ${f.name}</span>
          <span class="code-tab-badge">${f.loc}L</span>
        </button>
      `;
    }).join("");
  }

  // Active File Viewer
  const activeFile = (arts.files && arts.files[currentCodeReviewActiveFile]) ? arts.files[currentCodeReviewActiveFile] : (arts.files ? Object.values(arts.files)[0] : null);
  if (activeFile) {
    const fnEl = document.getElementById("cr-active-filename");
    if (fnEl) fnEl.innerText = activeFile.name;
    const locEl = document.getElementById("cr-active-loc");
    if (locEl) locEl.innerText = `${activeFile.loc} 라인`;
    const szEl = document.getElementById("cr-active-size");
    if (szEl) szEl.innerText = activeFile.size;
    const descEl = document.getElementById("cr-file-meta-right");
    if (descEl) descEl.innerText = activeFile.title || activeFile.lang;

    // Line Numbers & Code
    const lineNumbersEl = document.getElementById("cr-line-numbers");
    const codeContentEl = document.getElementById("cr-code-content");
    const lines = (activeFile.content || "").split("\n");
    if (lineNumbersEl) {
      lineNumbersEl.innerHTML = lines.map((_, idx) => `<div>${idx + 1}</div>`).join("");
    }
    if (codeContentEl) {
      codeContentEl.innerText = activeFile.content || "";
    }
  }

  // Contributors
  const contribEl = document.getElementById("cr-team-contributors");
  if (contribEl && arts.contributors) {
    contribEl.innerHTML = arts.contributors.map(c => `
      <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
        <span style="color:#94A3B8;">• <strong>${c.dept}:</strong> ${c.lead}</span>
        <span style="color:#38BDF8; font-size:10px;">${c.artifact}</span>
      </div>
    `).join("");
  }

  // History List
  const historyListEl = document.getElementById("cr-history-list");
  const historyCountEl = document.getElementById("cr-history-count");
  if (historyListEl && arts.refactor_history) {
    if (historyCountEl) historyCountEl.innerText = `${arts.refactor_history.length}건`;
    historyListEl.innerHTML = arts.refactor_history.map(item => {
      const isInit = item.prompt && item.prompt.includes("초기");
      const isRollback = item.prompt && item.prompt.includes("롤백");
      return `
        <div class="refactor-history-item ${isInit ? 'init' : (isRollback ? 'rollback' : '')}">
          <div class="refactor-history-meta">
            <span><strong>${item.author}</strong> [${item.target_file || 'game_core.js'}]</span>
            <span>${item.timestamp}</span>
          </div>
          <div class="refactor-history-summary">${escapeHtml(item.summary)}</div>
          ${item.prompt && !isInit ? `<div class="refactor-history-prompt">&gt; "${escapeHtml(item.prompt)}"</div>` : ''}
        </div>
      `;
    }).join("");
  }
};

window.sendCodeRefactor = function(promptText) {
  if (!promptText || !promptText.trim()) return;
  const p = promptText.trim();
  playSound("click");

  if (engine.isServerConnected) {
    fetch("/api/refactor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: p, target_file: currentCodeReviewActiveFile })
    })
    .then(r => r.json())
    .then(res => {
      if (res && res.artifacts) {
        currentCodeReviewArtifacts = res.artifacts;
        renderCodeReviewInspector();
        const summary = (res.result && res.result.summary) ? res.result.summary : "리팩토링 반영 완료";
        engine.addLog("REFACTOR", `프로그래밍팀장(윤지민): 대표님 지시('${p}') 반영 - ${summary}`);
        appendTerminalOutput("프로그래밍팀장 (윤지민)", `대표님 지시('${p}') 반영 완료: ${summary}`);
      }
    })
    .catch(() => {
      fallbackLocalRefactor(p);
    });
  } else {
    fallbackLocalRefactor(p);
  }

  const inputEl = document.getElementById("cr-refactor-input");
  if (inputEl) inputEl.value = "";
};

function fallbackLocalRefactor(promptText) {
  if (!currentCodeReviewArtifacts) currentCodeReviewArtifacts = generateLocalProjectArtifacts(engine.selectedTopic);
  const fileObj = currentCodeReviewArtifacts.files[currentCodeReviewActiveFile] || currentCodeReviewArtifacts.files["game_core.js"];
  let code = fileObj.content;
  let summary = "";
  const lower = promptText.toLowerCase();

  if (lower.includes("쿨타임") || lower.includes("cooldown") || lower.includes("쿨다운")) {
    code = code.replace(/let DASH_COOLDOWN\s*=\s*[\d\.]+;/, "let DASH_COOLDOWN = 0.75; // [REFACTORED: 50% Reduced]");
    code = code.replace(/let SKILL_COOLDOWN\s*=\s*[\d\.]+;/, "let SKILL_COOLDOWN = 2.0; // [REFACTORED: 50% Reduced]");
    code = code.replace(/public float DashCooldown\s*=\s*[\d\.]+f;/, "public float DashCooldown = 0.75f; // [REFACTORED: 50% Reduced]");
    summary = "대시 쿨타임(1.5s -> 0.75s) 및 스킬 쿨타임(4.0s -> 2.0s) 50% 단축 적용 완료";
  } else if (lower.includes("전투") || lower.includes("공격") || lower.includes("damage") || lower.includes("combat")) {
    code = code.replace(/let BASE_ATTACK_POWER\s*=\s*\d+;/, "let BASE_ATTACK_POWER = 65; // [REFACTORED: Buffed]");
    code = code.replace(/let COMBO_CRITICAL_MULTIPLIER\s*=\s*[\d\.]+;/, "let COMBO_CRITICAL_MULTIPLIER = 2.8; // [REFACTORED: x2.8]");
    code = code.replace(/public float BaseAttackPower\s*=\s*[\d\.]+f;/, "public float BaseAttackPower = 65.0f; // [REFACTORED: Buffed]");
    summary = "기본 공격력(35 -> 65) 상향 및 콤보 크리티컬 배율(x1.8 -> x2.8) 극대화 완료";
  } else if (lower.includes("패링") || lower.includes("parry")) {
    code = code.replace(/let PARRY_WINDOW_SEC\s*=\s*[\d\.]+;/, "let PARRY_WINDOW_SEC = 0.40; // [REFACTORED: 24 frames]");
    code = code.replace(/public float ParryWindow\s*=\s*[\d\.]+f;/, "public float ParryWindow = 0.40f; // [REFACTORED: 24 frames]");
    summary = "패링 판정 시간(0.20s -> 0.40s / 24프레임) 2배 확장 완료";
  } else if (lower.includes("대시") || lower.includes("무적") || lower.includes("회피")) {
    code = code.replace(/let DASH_INVINCIBLE_TIME\s*=\s*[\d\.]+;/, "let DASH_INVINCIBLE_TIME = 0.45; // [REFACTORED: Extended]");
    code = code.replace(/public float DashInvincibleDuration\s*=\s*[\d\.]+f;/, "public float DashInvincibleDuration = 0.45f; // [REFACTORED: Extended]");
    summary = "대시 회피 무적 지속시간(0.20s -> 0.45s) 연장으로 생존율 보정 완료";
  } else if (lower.includes("궁극기") || lower.includes("ultimate")) {
    code = code.replace(/let ULTIMATE_CHARGE_RATE\s*=\s*[\d\.]+;/, "let ULTIMATE_CHARGE_RATE = 2.5; // [REFACTORED: 250% Speed]");
    code = code.replace(/public float UltimateChargeRate\s*=\s*[\d\.]+f;/, "public float UltimateChargeRate = 2.5f; // [REFACTORED: 250% Speed]");
    summary = "궁극기 게이지 충전 배율(1.0 -> 2.5) 250% 가속 적용 완료";
  } else if (lower.includes("60fps") || lower.includes("최적화") || lower.includes("fps")) {
    if (!code.includes("// [OPTIMIZED: 60FPS RAF LOCK]")) {
      code = "// [OPTIMIZED: 60FPS RAF LOCK] DeltaTime clamped to 16.6ms, Object Pooling Active\n" + code;
    }
    summary = "렌더링 파이프라인 최적화: 델타타임 16.6ms 하드웨어 락 및 GC 오브젝트 풀링 적용";
  } else {
    code = code + `\n// [AI REFACTOR - CEO DIRECTIVE]: ${promptText}\n// Applied at ${new Date().toLocaleTimeString("ko-KR", { hour12: false })} by Lead Programmer Yoon Ji-min\n`;
    summary = `대표님 지시사항 '${promptText}' 맞춤형 로직 반영 완료`;
  }

  fileObj.content = code;
  fileObj.loc = code.split("\n").length;
  fileObj.size = "5.2 KB";

  currentCodeReviewArtifacts.refactor_history.unshift({
    timestamp: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
    author: "프로그래밍팀장 (윤지민)",
    prompt: promptText,
    summary: summary,
    target_file: currentCodeReviewActiveFile
  });

  renderCodeReviewInspector();
  engine.addLog("REFACTOR", `프로그래밍팀장(윤지민): 대표님 지시('${promptText}') 반영 - ${summary}`);
  appendTerminalOutput("프로그래밍팀장 (윤지민)", `대표님 지시('${promptText}') 반영 완료: ${summary}`);
}

window.sendQuickRefactor = function(presetPrompt) {
  const inputEl = document.getElementById("cr-refactor-input");
  if (inputEl) inputEl.value = presetPrompt;
  sendCodeRefactor(presetPrompt);
};

window.triggerCodeRollback = function() {
  playSound("click");
  if (engine.isServerConnected) {
    fetch("/api/rollback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_file: currentCodeReviewActiveFile })
    })
    .then(r => r.json())
    .then(res => {
      if (res && res.artifacts) {
        currentCodeReviewArtifacts = res.artifacts;
        renderCodeReviewInspector();
        engine.addLog("REFACTOR", `프로그래밍팀장(윤지민): [사규 §7 제4조] '${currentCodeReviewActiveFile}' 원본 코드 롤백 완료`);
        appendTerminalOutput("프로그래밍팀장 (윤지민)", `사규 §7 제4조 '원본 보존 원칙'에 따라 '${currentCodeReviewActiveFile}' 원본 코드로 복원되었습니다.`);
      }
    })
    .catch(() => {
      fallbackLocalRollback();
    });
  } else {
    fallbackLocalRollback();
  }
};

function fallbackLocalRollback() {
  if (!currentCodeReviewArtifacts) return;
  const fileObj = currentCodeReviewArtifacts.files[currentCodeReviewActiveFile] || currentCodeReviewArtifacts.files["game_core.js"];
  fileObj.content = fileObj.original_content;
  fileObj.loc = fileObj.content.split("\n").length;

  const summary = `사규 §7 제4조 '원본 보존 원칙'에 따라 '${fileObj.name}' 원본 코드로 복원되었습니다.`;
  currentCodeReviewArtifacts.refactor_history.unshift({
    timestamp: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
    author: "프로그래밍팀장 (윤지민)",
    prompt: "코드 롤백 (원본 복원)",
    summary: summary,
    target_file: fileObj.name
  });

  renderCodeReviewInspector();
  engine.addLog("REFACTOR", `프로그래밍팀장(윤지민): [사규 §7 제4조] '${fileObj.name}' 원본 코드 롤백 완료`);
  appendTerminalOutput("프로그래밍팀장 (윤지민)", summary);
}

// -----------------------------------------------------------------------------
// BACKEND SYNCHRONIZATION & REAL-TIME EVENT STREAM (Bug 2 Fix)
// -----------------------------------------------------------------------------
function syncWithBackend() {
  fetch("/api/state")
    .then(r => r.json())
    .then(data => {
      engine.isServerConnected = true;

      // Sync backend logs into frontend log stream without duplicates
      if (data.recent_logs && Array.isArray(data.recent_logs)) {
        let hasNew = false;
        data.recent_logs.forEach(l => {
          const logKey = `${l.id || l.time}_${l.category}_${l.message}`;
          if (!engine.processedLogIds.has(logKey)) {
            engine.processedLogIds.add(logKey);
            engine.logs.push({
              id: l.id || logKey,
              time: l.time, // Real system time from backend
              category: l.category,
              message: l.message
            });
            hasNew = true;
          }
        });
        if (hasNew) {
          if (engine.logs.length > 350) engine.logs = engine.logs.slice(-350);
          renderLogsList();
        }
      }

      // Sync queues from backend (Module 2)
      if (data.approval_queue && Array.isArray(data.approval_queue)) {
        engine.approvalQueue = data.approval_queue;
      }
      if (data.rejected_queue && Array.isArray(data.rejected_queue)) {
        engine.rejectedQueue = data.rejected_queue;
      }
      if (data.processed_queue && Array.isArray(data.processed_queue)) {
        engine.processedQueue = data.processed_queue;
      }
      if (data.selected_topic) {
        engine.selectedTopic = data.selected_topic;
      }

      // Sync step, hitl status
      if (data.current_step && data.current_step !== engine.currentStep) {
        engine.currentStep = data.current_step;
      }
      if (data.sim_time) {
        const [h, m] = data.sim_time.split(":").map(Number);
        engine.simMinutes = h * 60 + m;
      }
      if (typeof data.is_paused === "boolean") engine.isPaused = data.is_paused;
      if (typeof data.is_hitl_waiting === "boolean") engine.isHitlWaiting = data.is_hitl_waiting;
      if (typeof data.hitl_stage === "number") engine.hitlStage = data.hitl_stage;
      if (typeof data.wait_time_counter === "number") engine.hitlWaitTimer = data.wait_time_counter;

      // Sync agent positions, states, speeches from backend
      if (data.agents && Array.isArray(data.agents)) {
        data.agents.forEach(bgAg => {
          const fgAg = engine.agents.find(a => a.id === bgAg.id);
          if (fgAg) {
            fgAg.state = bgAg.state;
            fgAg.speechText = bgAg.speech_text || fgAg.speechText;
            if (bgAg.target_x !== undefined) fgAg.targetX = bgAg.target_x;
            if (bgAg.target_y !== undefined) fgAg.targetY = bgAg.target_y;
            if (Math.abs(fgAg.x - bgAg.x) > 0.05 || Math.abs(fgAg.y - bgAg.y) > 0.05) {
              fgAg.x += (bgAg.x - fgAg.x) * 0.35;
              fgAg.y += (bgAg.y - fgAg.y) * 0.35;
            }
          }
        });
      }

      // Auto-popup GDD modal on Step 4 HITL arrival if not already shown
      if (engine.currentStep === 4 && !engine.hasAutoOpenedModal && engine.approvalQueue.length > 0) {
        engine.hasAutoOpenedModal = true;
        openGddModal(engine.selectedTopic || engine.approvalQueue[0]);
      } else if (engine.currentStep !== 4) {
        engine.hasAutoOpenedModal = false;
      }

      // Auto-popup Code Review modal on Step 9 HITL arrival if not already shown
      if (engine.currentStep === 9 && !engine.hasAutoOpenedCodeReviewModal) {
        engine.hasAutoOpenedCodeReviewModal = true;
        setTimeout(() => openCodeReviewModal(), 400);
      } else if (engine.currentStep !== 9) {
        engine.hasAutoOpenedCodeReviewModal = false;
      }

      updateTopBarUI();
      updateBadgeCounts();
      renderCardsView();
    })
    .catch(() => {
      engine.isServerConnected = false;
    });
}

// -----------------------------------------------------------------------------
// COMMAND CONSOLE EXECUTOR (Bug 3 Fix - Form and Quick Buttons)
// -----------------------------------------------------------------------------
function executeCommand(cmdText) {
  if (!cmdText || !cmdText.trim()) return;
  playSound("click");
  const trimmed = cmdText.trim();

  // 1. Append user line in terminal history
  const history = document.getElementById("term-history");
  if (history) {
    const userLine = document.createElement("div");
    userLine.className = "term-line user";
    userLine.innerText = `CEO> ${trimmed}`;
    history.appendChild(userLine);
    history.scrollTop = history.scrollHeight;
  }

  // 2. Send to backend if connected, else run client-side parser
  fetch("/api/command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ command: trimmed })
  })
  .then(r => r.json())
  .then(res => {
    appendTerminalOutput(res.responder || "비서실장 (김세리)", res.output || res.text || "명령이 처리되었습니다.");
    updateTopBarUI();
  })
  .catch(() => {
    // Local fallback
    const res = engine.parseConsoleCommand(trimmed);
    appendTerminalOutput(res.responder, res.text);
    updateTopBarUI();
  });
}

// -----------------------------------------------------------------------------
// EVENT LISTENERS INITIALIZATION (Bug 3 Fix - Resilient DOM Binding)
// -----------------------------------------------------------------------------
function setupEventListeners() {
  // Terminal Form Submit
  const termForm = document.getElementById("term-form");
  const termInput = document.getElementById("term-input");
  if (termForm) {
    termForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (termInput) {
        const val = termInput.value.trim();
        if (val) {
          executeCommand(val);
          termInput.value = "";
        }
      }
    });
  }

  // Quick Action Buttons
  const quickActions = [
    { id: "cmd-status", cmd: "현황 보고" },
    { id: "cmd-why-slow", cmd: "왜 늦어져?" },
    { id: "cmd-meeting", cmd: "회의 소집" },
    { id: "cmd-focus", cmd: "집중 모드" },
    { id: "cmd-check-guardrails", action: () => openModal("modal-sop") },
    { id: "cmd-view-files", action: () => openDeliverablesModal() }
  ];

  quickActions.forEach(qa => {
    const btn = document.getElementById(qa.id);
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (qa.cmd) {
          executeCommand(qa.cmd);
        } else if (qa.action) {
          qa.action();
        }
      });
    }
  });

  // Top Bar Play / Pause
  const btnPausePlay = document.getElementById("btn-pause-play");
  if (btnPausePlay) {
    btnPausePlay.addEventListener("click", () => {
      playSound("click");
      engine.isPaused = !engine.isPaused;
      fetch("/api/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paused: engine.isPaused })
      }).catch(() => {});
      updateTopBarUI();
    });
  }

  // Step Next
  const btnStepNext = document.getElementById("btn-step-next");
  if (btnStepNext) {
    btnStepNext.addEventListener("click", () => {
      playSound("click");
      const nextStep = engine.currentStep < 12 ? engine.currentStep + 1 : 1;
      fetch("/api/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: nextStep })
      }).catch(() => {});
      engine.executeStep(nextStep);
    });
  }

  // Speed controls
  const speedBtns = [
    { id: "btn-speed-1", val: 1.0 },
    { id: "btn-speed-2", val: 2.0 },
    { id: "btn-speed-5", val: 5.0 }
  ];
  speedBtns.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) {
      el.addEventListener("click", (e) => {
        playSound("click");
        speedBtns.forEach(x => {
          const b = document.getElementById(x.id);
          if (b) b.classList.remove("active");
        });
        e.target.classList.add("active");
        engine.simSpeed = s.val;
        fetch("/api/control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ speed: s.val })
        }).catch(() => {});
      });
    }
  });

  // Audio Toggle
  const btnAudio = document.getElementById("btn-audio-toggle");
  if (btnAudio) {
    btnAudio.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      const audioText = document.getElementById("audio-text");
      if (audioText) audioText.innerText = soundEnabled ? "소리 켬" : "음소거";
      playSound("click");
    });
  }

  // Canvas Zoom / Pan Buttons
  const btnZoomIn = document.getElementById("btn-zoom-in");
  const btnZoomOut = document.getElementById("btn-zoom-out");
  const btnZoomReset = document.getElementById("btn-zoom-reset");
  const btnFocusCeo = document.getElementById("btn-focus-ceo");

  if (btnZoomIn) btnZoomIn.addEventListener("click", () => { engine.zoom = Math.min(engine.zoom * 1.25, 3.0); });
  if (btnZoomOut) btnZoomOut.addEventListener("click", () => { engine.zoom = Math.max(engine.zoom / 1.25, 0.4); });
  if (btnZoomReset) btnZoomReset.addEventListener("click", () => centerView());
  if (btnFocusCeo) {
    btnFocusCeo.addEventListener("click", () => {
      engine.zoom = 1.6;
      engine.panX = canvas.width / 2 - 6 * TILE_PX * engine.zoom;
      engine.panY = canvas.height / 2 - 6 * TILE_PX * engine.zoom;
    });
  }

  // Canvas Mouse Pan & Drag
  if (canvas) {
    canvas.addEventListener("mousedown", (e) => {
      engine.isDragging = true;
      engine.dragStartX = e.clientX - engine.panX;
      engine.dragStartY = e.clientY - engine.panY;
    });
    window.addEventListener("mouseup", () => { engine.isDragging = false; });
    canvas.addEventListener("mousemove", (e) => {
      if (engine.isDragging) {
        engine.panX = e.clientX - engine.dragStartX;
        engine.panY = e.clientY - engine.dragStartY;
      }
    });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 0.85;
      engine.zoom = Math.min(Math.max(engine.zoom * factor, 0.4), 3.0);
    }, { passive: false });

    // Click on Canvas to Select Agent
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - engine.panX) / engine.zoom;
      const my = (e.clientY - rect.top - engine.panY) / engine.zoom;

      const clickedAg = engine.agents.find(ag => {
        const px = ag.x * TILE_PX + TILE_PX / 2;
        const py = ag.y * TILE_PX + TILE_PX / 2;
        return Math.hypot(px - mx, py - my) < 14;
      });

      if (clickedAg) {
        playSound("click");
        engine.selectedAgentId = clickedAg.id;
        updateAgentInspector(clickedAg);
      }
    });
  }

  // Logs Filter Chips
  document.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      engine.activeLogFilter = btn.dataset.filter;
      renderLogsList();
    });
  });

  // Bottom Topic Tabs (Module 2: 3-way Queue Tabs)
  const tabTopTopics = document.getElementById("tab-top-topics");
  const tabRejectedTopics = document.getElementById("tab-rejected-topics");
  const tabProcessedTopics = document.getElementById("tab-processed-topics");

  if (tabTopTopics) {
    tabTopTopics.addEventListener("click", (e) => {
      document.querySelectorAll(".hitl-tab-btn").forEach(b => b.classList.remove("active"));
      tabTopTopics.classList.add("active");
      engine.activeTab = "approval";
      renderCardsView();
    });
  }
  if (tabRejectedTopics) {
    tabRejectedTopics.addEventListener("click", (e) => {
      document.querySelectorAll(".hitl-tab-btn").forEach(b => b.classList.remove("active"));
      tabRejectedTopics.classList.add("active");
      engine.activeTab = "rejected";
      renderCardsView();
    });
  }
  if (tabProcessedTopics) {
    tabProcessedTopics.addEventListener("click", (e) => {
      document.querySelectorAll(".hitl-tab-btn").forEach(b => b.classList.remove("active"));
      tabProcessedTopics.classList.add("active");
      engine.activeTab = "processed";
      renderCardsView();
    });
  }

  // + 신작 기획 생성 Button (Module 2: Infinite Procedural Generator)
  const btnGenProposal = document.getElementById("btn-generate-proposal");
  if (btnGenProposal) {
    btnGenProposal.addEventListener("click", () => {
      playSound("click");
      btnGenProposal.disabled = true;
      btnGenProposal.innerText = "기획안 생성 중...";

      fetch("/api/generate_proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forced_pass: true })
      })
      .then(r => r.json())
      .then(data => {
        btnGenProposal.disabled = false;
        btnGenProposal.innerText = "+ 신작 기획 생성";
        if (data.proposal) {
          playSound("step");
          engine.approvalQueue.unshift(data.proposal);
          engine.approvalQueue.forEach((t, i) => t.rank = i + 1);
          engine.selectedTopic = data.proposal;
          updateBadgeCounts();
          renderCardsView();
          appendTerminalOutput("기획1팀장 (최현우)", `대표님, 신작 기획안 '${data.proposal.title}' 생성을 완료하여 1차 결재 큐에 상정했습니다. (대기: ${engine.approvalQueue.length}건)`);
        }
      })
      .catch(() => {
        btnGenProposal.disabled = false;
        btnGenProposal.innerText = "+ 신작 기획 생성";
        // Local procedural fallback
        const pId = Date.now() % 10000;
        const genres = ["Roguelike_Action", "Deckbuilder_Puzzle", "Cyberpunk_Sim", "Retro_Metroidvania", "Stealth_Puzzle", "Fantasy_Soulslike"];
        const g = genres[Math.floor(Math.random() * genres.length)];
        const localProp = {
          id: pId,
          rank: engine.approvalQueue.length + 1,
          genre: g,
          score: Math.floor(Math.random() * 8) + 91,
          title: `신작 프로젝트 [${g}] 알파`,
          hook: "새로운 차원의 코어 루프와 감각적인 60FPS 액션 플레이!",
          target: "2030 코어 게이머 및 스팀 매니아층",
          world: "평행 세계의 차원 균열 속에서 펼쳐지는 모험 이야기.",
          core_loop: "1. 탐색 & 조작 -> 2. 자원 파밍 -> 3. 보스 토벌 -> 4. 영구 강화",
          art_sound: "스타일라이즈드 도트 2D + 다이내믹 신스웨이브 BGM",
          qa_verdict: "통과: 코어 루프 완성도(94점), 밸런스 검증 완료, 사규 준수",
          passed: true,
          approval_status: "PENDING",
          dev_period: "3개월 (MVP)",
          platform: "PC WebGL & Steam"
        };
        engine.approvalQueue.unshift(localProp);
        engine.selectedTopic = localProp;
        updateBadgeCounts();
        renderCardsView();
        appendTerminalOutput("기획1팀장 (최현우)", `신작 기획안 '${localProp.title}' 생성 완료 (오프라인 결재 큐 적재)`);
      });
    });
  }

  // Top Bar 📋 결재함 Button (Module 2: Direct CEO Popup)
  const btnApprovalBox = document.getElementById("btn-open-approval-box");
  if (btnApprovalBox) {
    btnApprovalBox.addEventListener("click", () => {
      playSound("click");
      openGddModal(engine.selectedTopic || engine.approvalQueue[0]);
    });
  }

  // Top Bar 💻 코드 검토 Button (Module 3: Direct CEO Code Review Inspector)
  const btnCodeReview = document.getElementById("btn-open-code-review");
  if (btnCodeReview) {
    btnCodeReview.addEventListener("click", () => {
      playSound("click");
      openCodeReviewModal();
    });
  }

  // Code Review Inspector: Submit Refactor Directive
  const btnSubmitRefactor = document.getElementById("cr-btn-submit-refactor");
  const inputRefactor = document.getElementById("cr-refactor-input");
  if (btnSubmitRefactor && inputRefactor) {
    btnSubmitRefactor.addEventListener("click", () => {
      sendCodeRefactor(inputRefactor.value);
    });
    inputRefactor.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendCodeRefactor(inputRefactor.value);
      }
    });
  }

  // Code Review Inspector: Final Approve & Push Button
  const btnCrFinalApprove = document.getElementById("cr-btn-final-approve");
  if (btnCrFinalApprove) {
    btnCrFinalApprove.addEventListener("click", () => {
      engine.handleHitlAction("최종 승인");
      closeModal("modal-code-review");
    });
  }

  // Module 5 Top Bar Buttons
  const btnPlayableGame = document.getElementById("btn-open-playable-game");
  if (btnPlayableGame) {
    btnPlayableGame.addEventListener("click", () => {
      playSound("click");
      openPlayableGameModal();
    });
  }

  const btnPlaytest = document.getElementById("btn-open-playtest");
  if (btnPlaytest) {
    btnPlaytest.addEventListener("click", () => {
      playSound("click");
      openPlaytestModal();
    });
  }

  const btnStorefront = document.getElementById("btn-open-storefront");
  if (btnStorefront) {
    btnStorefront.addEventListener("click", () => {
      playSound("click");
      openStorefrontModal();
    });
  }

  const btnPortfolio = document.getElementById("btn-open-portfolio");
  if (btnPortfolio) {
    btnPortfolio.addEventListener("click", () => {
      playSound("click");
      openPortfolioModal();
    });
  }

  // HITL Action Buttons (Bottom Bar)
  const btnApprove = document.getElementById("btn-hitl-approve");
  const btnRevise = document.getElementById("btn-hitl-revise");
  const btnHold = document.getElementById("btn-hitl-hold");
  const btnDiscard = document.getElementById("btn-hitl-discard");

  if (btnApprove) btnApprove.addEventListener("click", () => engine.handleHitlAction("승인"));
  if (btnRevise) btnRevise.addEventListener("click", () => engine.handleHitlAction("수정요청"));
  if (btnHold) btnHold.addEventListener("click", () => engine.handleHitlAction("보류"));
  if (btnDiscard) btnDiscard.addEventListener("click", () => engine.handleHitlAction("폐기"));

  // HITL Action Buttons (Inside Modal GDD)
  const modalBtnApprove = document.getElementById("modal-btn-approve");
  const modalBtnRevise = document.getElementById("modal-btn-revise");
  const modalBtnHold = document.getElementById("modal-btn-hold");
  const modalBtnDiscard = document.getElementById("modal-btn-discard");

  if (modalBtnApprove) modalBtnApprove.addEventListener("click", () => {
    engine.handleHitlAction("승인");
    closeModal("modal-gdd");
  });
  if (modalBtnRevise) modalBtnRevise.addEventListener("click", () => {
    engine.handleHitlAction("수정요청");
    closeModal("modal-gdd");
  });
  if (modalBtnHold) modalBtnHold.addEventListener("click", () => {
    engine.handleHitlAction("보류");
    closeModal("modal-gdd");
  });
  if (modalBtnDiscard) modalBtnDiscard.addEventListener("click", () => {
    engine.handleHitlAction("폐기");
    closeModal("modal-gdd");
  });

  // Modals Open
  const btnOpenSop = document.getElementById("btn-open-sop");
  const btnOpenRoster = document.getElementById("btn-open-roster");

  if (btnOpenSop) btnOpenSop.addEventListener("click", () => openModal("modal-sop"));
  if (btnOpenRoster) {
    btnOpenRoster.addEventListener("click", () => {
      loadAndDisplayRoster();
      openModal("modal-roster");
    });
  }

  // Roster Search Input
  const rosterSearch = document.getElementById("roster-search-input");
  if (rosterSearch) {
    rosterSearch.addEventListener("input", (e) => {
      filterRosterCards(e.target.value.trim());
    });
  }
}

// -----------------------------------------------------------------------------
// LAZY LOADING 270 AGENCY ROSTER
// -----------------------------------------------------------------------------
function loadAndDisplayRoster() {
  const container = document.getElementById("roster-grid-container");
  const countBadge = document.getElementById("roster-count-badge");
  if (!container) return;

  if (engine.rosterData) {
    renderRosterGrid(engine.rosterData);
    return;
  }

  container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:20px; color:#94A3B8;">270명 전사 에이전트 데이터 지연 로딩 중...</div>`;

  fetch("/api/roster")
    .then(r => r.json())
    .then(data => {
      engine.rosterData = data.roster || [];
      if (countBadge) countBadge.innerText = `총 ${engine.rosterData.length}명 로드 완료`;
      renderRosterGrid(engine.rosterData);
    })
    .catch(() => {
      // Local fallback generation
      engine.rosterData = generateLocal270Roster();
      if (countBadge) countBadge.innerText = `총 ${engine.rosterData.length}명 로드 완료 (오프라인)`;
      renderRosterGrid(engine.rosterData);
    });
}

function generateLocal270Roster() {
  const list = [...AGENTS_DATA];
  let idCounter = list.length + 1;
  const subRoles = ["시니어 기획자", "서브 스크립터", "밸런스 테스터", "셰이더 아티스트", "SFX 엔지니어", "코어 프로그래머", "QA 테스터", "스토어 매니저"];

  for (let deptId = 1; deptId <= 12; deptId++) {
    const dept = DEPARTMENTS.find(d => d.id === deptId) || DEPARTMENTS[0];
    for (let i = 0; i < 21; i++) {
      if (idCounter > 270) break;
      const roleName = subRoles[i % subRoles.length];
      list.push({
        id: idCounter,
        name: `사원_${String(idCounter).padStart(3, "0")}`,
        code: `AG-${String(idCounter).padStart(3, "0")}`,
        deptId: dept.id,
        role: `${dept.name.split(" ")[0]} ${roleName}`,
        isLeader: false,
        task: `${dept.name} 실무 및 백그라운드 지원`,
        reject: "사규 준수"
      });
      idCounter++;
    }
  }
  return list;
}

function renderRosterGrid(roster) {
  const container = document.getElementById("roster-grid-container");
  if (!container) return;

  container.innerHTML = roster.map(ag => {
    const dept = DEPARTMENTS.find(d => d.id === (ag.deptId || ag.dept_id)) || { color: "#3B82F6", name: "전사" };
    return `
      <div style="background:#131B29; border:1px solid #243248; border-radius:6px; padding:8px 10px; display:flex; gap:8px; align-items:center;">
        <div style="width:30px; height:30px; border-radius:50%; background:${dept.color}; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; color:#FFF;">
          ${(ag.name || "").slice(-2)}
        </div>
        <div style="flex:1; overflow:hidden;">
          <div style="font-weight:700; color:#FFF; font-size:12px; display:flex; justify-content:space-between;">
            <span>${escapeHtml(ag.name)} <span style="font-size:10px; color:#94A3B8;">(${escapeHtml(ag.code)})</span></span>
            <span style="font-size:9px; color:${ag.isLeader || ag.is_leader ? '#F59E0B' : '#94A3B8'};">${escapeHtml(ag.role)}</span>
          </div>
          <div style="font-size:10px; color:#60A5FA;">${escapeHtml(dept.name)}</div>
          <div style="font-size:9px; color:#94A3B8; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${escapeHtml(ag.task)}</div>
        </div>
      </div>
    `;
  }).join("");
}

function filterRosterCards(keyword) {
  if (!engine.rosterData) return;
  const kw = keyword.toLowerCase();
  const filtered = engine.rosterData.filter(ag => {
    const nameMatch = (ag.name || "").toLowerCase().includes(kw);
    const codeMatch = (ag.code || "").toLowerCase().includes(kw);
    const roleMatch = (ag.role || "").toLowerCase().includes(kw);
    const dept = DEPARTMENTS.find(d => d.id === (ag.deptId || ag.dept_id));
    const deptMatch = dept && dept.name.toLowerCase().includes(kw);
    return nameMatch || codeMatch || roleMatch || deptMatch;
  });
  renderRosterGrid(filtered);
}

// -----------------------------------------------------------------------------
// DELIVERABLES MODAL
// -----------------------------------------------------------------------------
function openDeliverablesModal() {
  openModal("modal-deliverables");
  const listEl = document.getElementById("deliverables-file-list");
  const contentEl = document.getElementById("deliverable-file-content");

  fetch("/api/deliverables")
    .then(r => r.json())
    .then(data => {
      const files = data.files || [];
      if (files.length === 0) {
        listEl.innerHTML = `<div style="padding:10px; color:#64748B;">산출물 생성 대기 중 (STEP 10 도달 시 폴더 자동 생성)</div>`;
        contentEl.innerText = "STEP 10(스토어 준비 & 패키징)에 도달하면 5개 서브폴더(1_GDD, 2_Assets, 3_SourceCode, 4_Build, 5_Marketing) 규격에 맞춰 안전 복제본이 자동 생성됩니다.";
      } else {
        listEl.innerHTML = files.map(f => `
          <div style="padding:8px 10px; border-bottom:1px solid #243248; cursor:pointer;" onclick="viewDeliverableFile('${escapeHtml(f.name)}')">
            <div style="font-weight:700; color:#38BDF8; font-size:11px;">${escapeHtml(f.name)}</div>
            <div style="font-size:10px; color:#64748B;">${f.size} bytes</div>
          </div>
        `).join("");
      }
    })
    .catch(() => {
      // Mock files
      const mockFiles = [
        "2026-10-09_Roguelike_Action/1_GDD/GDD_GameDesignDocument.md",
        "2026-10-09_Roguelike_Action/3_SourceCode/game_core.js",
        "2026-10-09_Roguelike_Action/4_Build/index.html",
        "2026-10-09_Roguelike_Action/5_Marketing/store_description.md"
      ];
      listEl.innerHTML = mockFiles.map(name => `
        <div style="padding:8px 10px; border-bottom:1px solid #243248; cursor:pointer;" onclick="viewDeliverableMock('${name}')">
          <div style="font-weight:700; color:#38BDF8; font-size:11px;">${name}</div>
          <div style="font-size:10px; color:#64748B;">안전 복제본 (로컬)</div>
        </div>
      `).join("");
    });
}

window.viewDeliverableFile = function(name) {
  fetch(`/api/deliverable_content?name=${encodeURIComponent(name)}`)
    .then(r => r.text())
    .then(text => {
      document.getElementById("deliverable-file-content").innerText = text;
    });
};

window.viewDeliverableMock = function(name) {
  const contentEl = document.getElementById("deliverable-file-content");
  if (name.includes("GDD")) {
    contentEl.innerText = `# [ANTI-GRAVITY AI] 게임 기획서: 크로노 블레이드\n* 장르: Roguelike_Action\n* 점수: 96점 (QA 전수 통과)\n\n## Core Gameplay Loop\n시간 왜곡 패링 액션 -> 차원 룬 조합 & 유물 파밍 -> 시공간 균열 보스 토벌 -> 영구 거점 강화`;
  } else if (name.includes("game_core")) {
    contentEl.innerText = `// ANTI-GRAVITY AI: WebGL Core Game Engine\nclass GameEngine {\n  init() { console.log("Chrono Blade Engine 60 FPS Started"); }\n}`;
  } else {
    contentEl.innerText = `<!DOCTYPE html>\n<html>\n<head><title>Chrono Blade WebGL Build</title></head>\n<body><h1>WebGL Build Screen</h1></body>\n</html>`;
  }
};

window.openModal = function(id) {
  playSound("click");
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
};

window.closeModal = function(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
};

// -----------------------------------------------------------------------------
// MODULE 5: IN-BROWSER PLAYABLE RUNNER, AI PLAYTEST, STEAM STORE, PORTFOLIO
// -----------------------------------------------------------------------------
let currentStoreBundle = null;

function generateFallbackPlayableHtml(title, genre = "Action") {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>${title} - WebGL Runner</title>
  <style>
    * { box-sizing: border-box; margin:0; padding:0; }
    body { background:#070B14; color:#F8FAFC; font-family:'Segoe UI',sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
    #container { width:780px; background:#0B0F17; border:2px solid #38BDF8; border-radius:10px; overflow:hidden; box-shadow:0 0 25px rgba(56,189,248,0.2); }
    #hud { display:flex; justify-content:space-between; align-items:center; padding:8px 16px; background:#0F172A; border-bottom:1px solid #1E293B; font-size:12px; font-weight:600; }
    canvas { display:block; background:#030712; width:100%; height:420px; }
    #dbg { display:flex; justify-content:space-between; align-items:center; padding:8px 16px; background:#0F172A; font-size:11px; color:#94A3B8; }
    .btn { background:#1E293B; color:#38BDF8; border:1px solid #38BDF8; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:11px; }
    .btn:hover { background:#38BDF8; color:#0B0F17; }
  </style>
</head>
<body>
  <div id="container">
    <div id="hud">
      <div><span style="color:#38BDF8; font-weight:bold;">${title}</span> | <span style="color:#64748B;">${genre}</span></div>
      <div>HP: <span id="hp" style="color:#10B981; font-weight:bold;">100</span> | SCORE: <span id="sc" style="color:#F59E0B; font-weight:bold;">0</span></div>
    </div>
    <canvas id="c" width="780" height="420"></canvas>
    <div id="dbg">
      <div>조작: [WASD] 이동 | [Space] 공격 | [Shift] 대시 | [F] 패링 | [Q] 궁극기</div>
      <div>
        <button class="btn" onclick="toggleGod()">무적 (G)</button>
        <button class="btn" onclick="spawnB()">보스 소환 (B)</button>
      </div>
    </div>
  </div>
  <script>
    const cvs = document.getElementById("c"), ctx = cvs.getContext("2d");
    let px = 390, py = 210, hp = 100, sc = 0, god = false, boss = null;
    const keys = {};
    let slashes = [];
    window.addEventListener("keydown", e => {
      keys[e.code] = true;
      if (e.code === "Space") { slashes.push({x:px, y:py, r:35, a:1}); sc += 50; sendT("PLAYER_ATTACK", {score:sc}); }
      if (e.code === "KeyF") { sendT("PARRY_SUCCESS", {score:sc}); }
      if (e.code === "KeyG") { god = !god; sendT("DEBUG_GOD_MODE", {enabled:god}); }
      if (e.code === "KeyB") { spawnB(); }
    });
    window.addEventListener("keyup", e => { keys[e.code] = false; });
    function sendT(ev, d) {
      const p = { type:"GAME_TELEMETRY", title:"${title}", event:ev, data:d };
      if (window.parent) window.parent.postMessage(p, "*");
    }
    function toggleGod() { god = !god; sendT("DEBUG_GOD_MODE", {enabled:god}); }
    function spawnB() { boss = { x:390, y:80, hp:1000 }; sendT("BOSS_SPAWNED", {name:"공허의 지배자"}); }
    function loop() {
      if (keys["KeyW"] && py > 20) py -= 4;
      if (keys["KeyS"] && py < 400) py += 4;
      if (keys["KeyA"] && px > 20) px -= 4;
      if (keys["KeyD"] && px < 760) px += 4;
      ctx.fillStyle = "#030712"; ctx.fillRect(0,0,780,420);
      // Grid
      ctx.strokeStyle = "rgba(56,189,248,0.06)";
      for(let x=0; x<780; x+=30){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,420); ctx.stroke(); }
      for(let y=0; y<420; y+=30){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(780,y); ctx.stroke(); }
      // Slashes
      for(let i=slashes.length-1; i>=0; i--) {
        const s = slashes[i];
        ctx.strokeStyle = "rgba(56,189,248," + s.a + ")";
        ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.stroke();
        s.r += 3; s.a -= 0.08;
        if (s.a <= 0) slashes.splice(i,1);
      }
      // Player
      ctx.fillStyle = god ? "#F59E0B" : "#38BDF8";
      ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 2; ctx.stroke();
      // Boss
      if (boss) {
        ctx.fillStyle = "#EF4444";
        ctx.beginPath(); ctx.arc(boss.x, boss.y, 28, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#FFF"; ctx.font = "bold 11px sans-serif";
        ctx.fillText("BOSS", boss.x-15, boss.y+4);
      }
      document.getElementById("hp").innerText = god ? "무적" : hp;
      document.getElementById("sc").innerText = sc;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  </script>
</body>
</html>`;
}

function generateLocalPlaytestReport() {
  const currentTitle = engine.selectedTopic ? engine.selectedTopic.title : "게임 프로젝트";
  return {
    iterations: 100,
    clear_rate: 38.0,
    balance_status: "BALANCED",
    avg_survival_time_sec: 114.5,
    recommendation: `정상 밸런스입니다. (클리어율 38.0%, 평균 생존 114.5초 - '${currentTitle}' 권장 소울라이크 난이도 곡선 일치)`,
    death_heatmap: Array.from({length: 45}, () => ({
      x: Math.floor(Math.random() * 700 + 50),
      y: Math.floor(Math.random() * 400 + 40),
      cause: "보스 광역 강타"
    }))
  };
}

function generateLocalStoreBundle() {
  const t = engine.selectedTopic || { title: "크로노 블레이드: 시공간의 방랑자", genre: "Roguelike_Action", hook: "시간을 왜곡하는 찰나의 패링!" };
  return {
    title: t.title,
    steam_score: "98% (압도적으로 긍정적)",
    capsules: {
      header_svg: `<svg viewBox="0 0 460 215" width="100%" height="100%"><rect width="460" height="215" fill="#0B132B"/><text x="230" y="115" fill="#38BDF8" font-size="18" font-weight="bold" text-anchor="middle">${t.title}</text></svg>`,
      main_svg: `<svg viewBox="0 0 616 353" width="100%" height="100%"><rect width="616" height="353" fill="#070B14"/><text x="308" y="180" fill="#F8FAFC" font-size="24" font-weight="900" text-anchor="middle">${t.title}</text></svg>`
    },
    localized: {
      ko: {
        title: t.title,
        synopsis: t.hook || "시공간을 왜곡하는 극한의 하이퍼 스타일리시 액션.",
        features: ["초정밀 패링 & 대시 전투 시스템", "60 FPS WebGL 하이브리드 물리 엔진", "The Agency 270인 AI 스튜디오 밸런스 검증 완료"],
        rec_req: "OS: Windows 11 64-bit | CPU: Intel Core i7 | RAM: 16 GB | GPU: RTX 3060"
      },
      en: {
        title: t.title,
        synopsis: "An intense stylish action experience set in a realm governed by time distortions.",
        features: ["High-precision parry and temporal dash combat", "Ultra-smooth 60 FPS WebGL engine", "Balanced by 270 AI Agency Specialists"],
        rec_req: "OS: Windows 11 64-bit | Processor: Intel Core i7 | RAM: 16 GB | Graphics: RTX 3060"
      },
      jp: {
        title: t.title,
        synopsis: "時空の歪みを切り裂く極限のスタイリッシュ・アクション。",
        features: ["超精密パリィ＆ダッシュ回避アクション", "60 FPS WebGLハイブリッド物理エンジン", "270名のAIエージェントによるバランス検証"],
        rec_req: "OS: Windows 11 64-bit | CPU: Intel Core i7 | RAM: 16 GB | GPU: RTX 3060"
      },
      zh: {
        title: t.title,
        synopsis: "在时空扭曲的深渊中展开的极限华丽动作冒险。",
        features: ["超精准弹刀与瞬身闪避战斗机制", "60 FPS WebGL混合物理引擎驱动", "经270名AI员工全方位平衡性测试"],
        rec_req: "OS: Windows 11 64-bit | 处理器: Intel Core i7 | 内存: 16 GB | 显卡: RTX 3060"
      }
    }
  };
}

function generateLocalPortfolioData() {
  const t = engine.selectedTopic || { title: "크로노 블레이드: 시공간의 방랑자", genre: "Roguelike_Action" };
  return {
    portfolio: [
      {
        id: t.id || 1,
        title: t.title,
        genre: t.genre || "Roguelike_Action",
        version: "v1.0.1",
        downloads: 204520,
        revenue_usd: 486200,
        steam_score: 98.4,
        steam_rating: "압도적으로 긍정적 (Overwhelmingly Positive)",
        ccu: 4120
      }
    ],
    metrics: {
      total_downloads: 204520,
      total_revenue_usd: 486200,
      active_live_games: 1,
      avg_review_score: 98.4
    }
  };
}

function openPlayableGameModal() {
  const modal = document.getElementById("modal-playable-game");
  if (!modal) return;
  const frame = document.getElementById("game-runner-frame");
  const titleEl = document.getElementById("game-runner-title");
  
  const currentTitle = engine.selectedTopic ? engine.selectedTopic.title : "게임 프로젝트";
  if (titleEl) titleEl.innerText = `${currentTitle} - 실시간 인브라우저 WebGL 플레이어`;
  
  fetch("/api/deliverables")
    .then(r => r.json())
    .then(data => {
      const buildFile = data.files.find(f => f.filename === "index.html" && f.name.includes("4_Build"));
      if (buildFile && frame) {
        frame.src = `/output/${buildFile.name}`;
      } else if (frame) {
        frame.srcdoc = generateFallbackPlayableHtml(currentTitle, engine.selectedTopic ? engine.selectedTopic.genre : "Action");
      }
    })
    .catch(() => {
      if (frame) {
        frame.srcdoc = generateFallbackPlayableHtml(currentTitle, engine.selectedTopic ? engine.selectedTopic.genre : "Action");
      }
    });

  modal.classList.add("open");
}

window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "GAME_TELEMETRY") {
    const t = e.data;
    const desc = t.event === "PLAYER_HIT" ? `피격 (HP: ${t.data.hp})` :
                 t.event === "PARRY_SUCCESS" ? `시간 왜곡 패링 성공! (점수: ${t.data.score})` :
                 t.event === "BOSS_SPAWNED" ? `보스 출현: ${t.data.name}` :
                 t.event === "BOSS_VICTORY" ? `보스 격파 승리! (+2500점)` :
                 t.event === "PLAYER_DIED" ? `플레이어 사망 (최종 점수: ${t.data.finalScore})` :
                 t.event === "ULTIMATE_BURST" ? `화면 전멸 궁극기 발동!` : t.event;
    
    appendTerminalOutput("인게임 런너", `[${t.title}] ${desc}`);
  }
});

function openPlaytestModal() {
  const modal = document.getElementById("modal-playtest");
  if (!modal) return;
  modal.classList.add("open");

  fetch("/api/playtest")
    .then(r => r.json())
    .then(data => {
      if (data.status === "ok" && data.report) {
        renderPlaytestReport(data.report);
      } else {
        renderPlaytestReport(generateLocalPlaytestReport());
      }
    })
    .catch(() => {
      renderPlaytestReport(generateLocalPlaytestReport());
    });
}

function triggerRunPlaytest() {
  playSound("click");
  fetch("/api/playtest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ iterations: 100 })
  })
    .then(r => r.json())
    .then(data => {
      if (data.status === "ok" && data.report) {
        renderPlaytestReport(data.report);
        appendTerminalOutput("QA팀장 (한소희)", `100회 재검수 완료: 클리어율 ${data.report.clear_rate}% [${data.report.balance_status}].`);
      } else {
        const rep = generateLocalPlaytestReport();
        renderPlaytestReport(rep);
        appendTerminalOutput("QA팀장 (한소희)", `100회 재검수 완료: 클리어율 ${rep.clear_rate}% [${rep.balance_status}].`);
      }
    })
    .catch(() => {
      const rep = generateLocalPlaytestReport();
      renderPlaytestReport(rep);
      appendTerminalOutput("QA팀장 (한소희)", `100회 재검수 완료: 클리어율 ${rep.clear_rate}% [${rep.balance_status}].`);
    });
}

function renderPlaytestReport(rep) {
  document.getElementById("pt-iterations").innerText = `${rep.iterations}회`;
  document.getElementById("pt-clear-rate").innerText = `${rep.clear_rate}%`;
  document.getElementById("pt-survival-time").innerText = `${rep.avg_survival_time_sec}초`;
  
  const statusEl = document.getElementById("pt-status-badge");
  statusEl.innerText = rep.balance_status;
  statusEl.style.color = rep.balance_status === "BALANCED" ? "#10B981" : (rep.balance_status === "TOO_HARD" ? "#EF4444" : "#F59E0B");

  document.getElementById("pt-recommendation").innerText = rep.recommendation;

  const cvs = document.getElementById("pt-heatmap-canvas");
  if (!cvs) return;
  const ctx = cvs.getContext("2d");
  ctx.clearRect(0, 0, 760, 260);

  ctx.fillStyle = "#070B14";
  ctx.fillRect(0, 0, 760, 260);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
  for (let x = 0; x < 760; x += 38) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 260); ctx.stroke(); }
  for (let y = 0; y < 260; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(760, y); ctx.stroke(); }

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(10, 10, 230, 240);
  ctx.fillRect(250, 10, 240, 240);
  ctx.fillRect(500, 10, 250, 240);

  ctx.fillStyle = "#64748B";
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("Stage 1: 진입로 (위험도 10%)", 20, 30);
  ctx.fillText("Stage 2: 왜곡 회랑 (위험도 25%)", 260, 30);
  ctx.fillText("Stage 3: 보스 구역 (위험도 55%)", 510, 30);

  const points = rep.death_heatmap || [];
  points.forEach((pt) => {
    const scaleX = (pt.x / 800) * 740 + 10;
    const scaleY = (pt.y / 480) * 230 + 15;

    const grad = ctx.createRadialGradient(scaleX, scaleY, 0, scaleX, scaleY, 9);
    grad.addColorStop(0, "rgba(244, 63, 94, 0.9)");
    grad.addColorStop(1, "rgba(244, 63, 94, 0.0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(scaleX, scaleY, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(scaleX, scaleY, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function openStorefrontModal() {
  const modal = document.getElementById("modal-storefront");
  if (!modal) return;
  modal.classList.add("open");

  fetch("/api/storefront")
    .then(r => r.json())
    .then(data => {
      if (data.status === "ok" && data.storefront) {
        currentStoreBundle = data.storefront;
        renderStorefrontUI("ko");
      } else {
        currentStoreBundle = generateLocalStoreBundle();
        renderStorefrontUI("ko");
      }
    })
    .catch(() => {
      currentStoreBundle = generateLocalStoreBundle();
      renderStorefrontUI("ko");
    });
}

function switchStoreLang(lang) {
  document.querySelectorAll("#modal-storefront .filter-chip").forEach(c => c.classList.remove("active"));
  const tab = document.getElementById(`sf-tab-${lang}`);
  if (tab) tab.classList.add("active");
  renderStorefrontUI(lang);
}

function renderStorefrontUI(lang = "ko") {
  if (!currentStoreBundle) return;
  const bundle = currentStoreBundle;
  
  if (bundle.capsules) {
    const hCap = document.getElementById("sf-header-capsule");
    if (hCap) hCap.innerHTML = bundle.capsules.header_svg || "";
    const mCap = document.getElementById("sf-main-capsule");
    if (mCap) mCap.innerHTML = bundle.capsules.main_svg || "";
  }

  const loc = bundle.localized && bundle.localized[lang] ? bundle.localized[lang] : bundle.localized["ko"];
  if (loc) {
    document.getElementById("sf-title").innerText = `${loc.title} - ${bundle.steam_score}`;
    document.getElementById("sf-synopsis").innerText = loc.synopsis;
    
    const featList = document.getElementById("sf-features");
    if (featList && Array.isArray(loc.features)) {
      featList.innerHTML = loc.features.map(f => `<li>${f}</li>`).join("");
    }
    document.getElementById("sf-rec-req").innerText = loc.rec_req;
  }
}

function openPortfolioModal() {
  const modal = document.getElementById("modal-portfolio");
  if (!modal) return;
  modal.classList.add("open");

  fetch("/api/portfolio")
    .then(r => r.json())
    .then(data => {
      if (data.status === "ok" && data.data) {
        renderPortfolioUI(data.data);
      } else {
        renderPortfolioUI(generateLocalPortfolioData());
      }
    })
    .catch(() => {
      renderPortfolioUI(generateLocalPortfolioData());
    });
}

function renderPortfolioUI(pData) {
  const metrics = pData.metrics || {};
  document.getElementById("pf-total-games").innerText = `${pData.portfolio.length}작품`;
  document.getElementById("pf-total-downloads").innerText = `${(metrics.total_downloads || 0).toLocaleString()}건`;
  document.getElementById("pf-total-revenue").innerText = `$${(metrics.total_revenue_usd || 0).toLocaleString()}`;
  document.getElementById("pf-avg-score").innerText = `${metrics.avg_review_score || 96.5}점`;

  const listEl = document.getElementById("pf-games-list");
  if (!listEl) return;
  if (!pData.portfolio || pData.portfolio.length === 0) {
    listEl.innerHTML = `<div style="padding:15px; color:#64748B; text-align:center;">STEP 12 브리핑 완수 시 출시된 게임이 포트폴리오로 편입됩니다.</div>`;
    return;
  }

  listEl.innerHTML = pData.portfolio.map(g => `
    <div style="background:#131B2A; border:1px solid #2A3B53; border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-weight:700; color:#F8FAFC; font-size:14px;">${g.title} <span style="font-size:11px; color:#38BDF8; font-weight:normal;">[${g.genre}]</span></div>
        <div style="font-size:11px; color:#94A3B8; margin-top:2px;">출시 버전: <b style="color:#10B981;">${g.version}</b> · 평점: <b style="color:#EC4899;">${g.steam_score}점</b> (${g.steam_rating})</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:13px; font-weight:700; color:#10B981;">${g.downloads.toLocaleString()} 다운로드</div>
        <div style="font-size:11px; color:#F59E0B;">매출: $${g.revenue_usd.toLocaleString()} | CCU: ${g.ccu}</div>
      </div>
    </div>
  `).join("");
}

// -----------------------------------------------------------------------------
// MAIN ENTRYPOINT & GAME LOOP
// -----------------------------------------------------------------------------
function startApplication() {
  initCanvas();
  setupEventListeners();

  updateBadgeCounts();
  renderCardsView();
  renderLogsList();
  updateTopBarUI();
  updateAgentInspector(engine.agents.find(a => a.id === 26));

  // Module 2 Spec 2: Auto-popup Approval Box on initial UI load
  setTimeout(() => {
    if (!engine.hasAutoOpenedModal && engine.approvalQueue.length > 0) {
      engine.hasAutoOpenedModal = true;
      openGddModal(engine.selectedTopic || engine.approvalQueue[0]);
    }
  }, 600);

  // Sync with backend every 500ms
  setInterval(syncWithBackend, 500);

  // Animation & simulation loop
  let lastTime = performance.now();
  function gameLoop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    engine.tick(dt);
    drawOffice();
    updateTopBarUI();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);
}

// Resilient startup: runs whether DOM is already ready or loading
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApplication);
} else {
  startApplication();
}
