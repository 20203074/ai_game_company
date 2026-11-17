# ANTI-GRAVITY INFINITE GAME STUDIO ENGINE (HANDOFF DOCUMENTATION)

> **버전**: v5.0.0 (Module 1 ~ Module 5 전체 구현 완료)  
> **아키텍처**: 270인 AI 에이전트 자율 구동 게임 스튜디오 (The Agency 프레임워크 기반)  
> **핵심 원칙**: 100% 실제 작동하는 LLM 연동 + 실제 Git/GitHub 파이프라인 + 2단계 HITL 승인 시스템

---

## 1. 개요 및 프로젝트 핵심 정체성

본 엔진은 270명의 전문 AI 직원이 기획부터 아트, 사운드, 프로그래밍, QA, 퍼블리싱, 라이브 서비스 유지보수까지 전담하여 무한으로 고품질 게임을 개발하고, 깃허브(GitHub) 저장소로 1 Game = 1 Repo 단위 자동 업로드하며, 출시 후 라이브옵스(Live-Ops)까지 수행하는 **자율 구동 AI 게임 스튜디오 엔진(Infinite Game Studio Engine)**입니다.

단순한 하드코딩 시나리오/목업(Mock) 시뮬레이터가 아닌, **실제 Gemini LLM API(`gemini-2.5-flash`)** 및 **실제 로컬 Git CLI/GitHub REST API**와 연동되는 엔터프라이즈급 AI 스튜디오로 완성되었습니다.

---

## 2. 시스템 아키텍처 및 모듈 구성

```
AI_COMPANY/
├── engine.py              # 270인 에이전트 조직화, 12개 부서 파이프라인, 상태 머신 및 비동기 엔진 코어
├── llm_engine.py          # [신규] Gemini 2.5 Flash LLM 연동 및 시맨틱 동적 기획/코드 리팩토링 브레인
├── git_integration.py     # [신규] 실제 로컬 Git Init/Commit/Tagging 및 GitHub REST API 원격 푸시 엔진
├── server.py              # Dual Runtime HTTP & REST API 서버 (포트: 8080)
├── index.html             # Google Stitch UI 기반 50x50 오피스 타일맵 캔버스 및 CEO 인터페이스
├── app.js                 # 270인 에이전트 자율 이동/작업 렌더러, 실시간 텔레메트리 리스너, 모달 제어
├── style.css              # Cyberpunk/Dark-mode 프리미엄 스튜디오 스타일링
├── .env / .env.example    # GEMINI_API_KEY, GITHUB_TOKEN, GITHUB_USERNAME 환경설정
├── output/                # 산출물 자동 저장 디렉토리 ({날짜}_{장르}_{제목}/)
│   ├── 1_GDD/             # 게임 기획서 마크다운
│   ├── 2_Assets/          # 사운드/스프라이트 매니페스트 (assets_manifest.json)
│   ├── 3_SourceCode/      # 소스 코드 (game_core.js, GameManager.cs, main.py, CHANGELOG.md)
│   ├── 4_Build/           # 인브라우저 플레이 가능 WebGL/Canvas 빌드 (index.html)
│   └── 5_Marketing/       # 마케팅 원고 및 스팀 캡슐 SVG 번들 (store_bundle/)
├── test_module2.py        # Module 2 검증 테스트 (1차 HITL 기획 승인) -> 100% 통과
├── test_module3.py        # Module 3 검증 테스트 (2차 HITL 소스코드 검토 & AI 리팩토링) -> 100% 통과
├── test_module4.py        # Module 4 검증 테스트 (GitHub 1 Game 1 Repo & 라이브옵스) -> 100% 통과
└── test_module5.py        # Module 5 검증 테스트 (WebGL 러너, AI 플레이테스트, 스팀스토어, 포트폴리오) -> 100% 통과
```

---

## 3. 대표님의 2단계 승인 시스템 (Human-in-the-Loop)

완전 자동화 시스템이지만, 대표님이 스튜디오의 핵심 방향성과 품질을 직접 제어합니다.

### [1차 승인] 기획 브리핑 승인 (STEP 04)
- **트리거**: 12개 부서 중 기획 1·2팀과 QA팀이 10개 후보 기획안을 심사하여 QA 검수(90점 이상)를 통과한 최우수 기획안을 대표님 결재함에 카드 형태로 상신.
- **보고서 내용**: 게임 제목, 한 줄 콘셉트, 세계관, Core Gameplay Loop(핵심 재미 메커니즘), 아트/사운드 방향성, QA 검수 점수.
- **동작**: 대표님이 [승인]을 클릭하면 STEP 05(아트/사운드/프로그래밍)로 즉시 파이프라인이 가동되며, [반려] 시 사유가 피드백되어 재기획됩니다.

### [2차 승인] 코드 검토 & 실시간 AI 리팩토링 (STEP 09)
- **트리거**: 프로그래밍팀(윤지민 팀장 등)이 작성한 소스 코드(`game_core.js`, `GameManager.cs`, `main.py`)가 준비되면 파이프라인이 정지되고 [코드 검토 창]에 프리뷰 표시.
- **AI 리팩토링 지시**:
  - 대표님이 콘솔 창에 자연어로 수정 명령을 입력 (예: `"쿨타임 줄여줘"`, `"기본 공격력 강화"`, `"패링 판정 시간 늘려줘"`, `"60FPS 최적화"`, `"궁극기 게이지 충전량 올려줘"`).
  - `llm_engine.py`가 이를 분석하여 AST 기반 정밀 코드 튜닝 수행 및 변경 내역 리포트 반환.
  - 마음에 들지 않을 경우 [가드레일 4호: 롤백 기능]을 통해 원본 코드로 즉시 복구 가능.
- **동작**: 대표님이 [최종 승인 및 푸시]를 누르면 패키징 및 Git/GitHub 자동 연동 단계(STEP 10)로 진입.

---

## 4. Module 5의 4대 핵심 사양 구현 내역

### 1) In-Browser Playable Game & WebGL Runner (`4_Build/index.html`)
- **실제 플레이 가능한 게임**: `output/{폴더}/4_Build/index.html`에 완전한 자바스크립트 캔버스 게임 엔진이 생성됩니다.
- **게임 메커니즘**:
  - 플레이어 이동(WASD/방향키), 공격(J/Space), 패링(K), 대시(L), 궁극기(U).
  - 60 FPS 기반의 실시간 물리/충돌 감지 및 파티클 렌더링.
  - 보스 몬스터 패턴 및 HP 바, 스코어, 콤보 시스템 탑재.
- **CEO 디버그 오버레이 (H 키 / 상단 토글)**:
  - 무적 모드 (God Mode), 쿨타임 0초 모드, 보스 즉시 스폰 기능.
- **실시간 텔레메트리 (PostMessage -> Terminal)**:
  - 게임 플레이 중 발생하는 이벤트(`PARRY_SUCCESS`, `PLAYER_HIT`, `BOSS_VICTORY`, `GAME_OVER`)가 `window.parent.postMessage`를 통해 GUI 및 엔진 서버(`/api/telemetry`)로 실시간 스트리밍되어 콘솔 로그에 기록됩니다.

### 2) 270 Agency Autonomous AI Playtesting & Heatmap
- **100회 헤드리스 AI 플레이테스트**: QA팀장(한소희)을 필두로 한 QA 부서 22개 AI 봇이 가상 시뮬레이션을 100회 실행.
- **분석 지표**:
  - 보스 클리어율 (Clear Rate, 예: 40.0% -> `BALANCED`)
  - 평균 생존 시간 (Average Survival Time) 및 평균 획득 점수
  - 스테이지별 난이도 곡선 및 주요 사망 원인 집계
- **사망 좌표 히트맵 (Death Heatmap)**:
  - 800x450 해상도 상의 사망 위치 $(X, Y)$를 기록하여 GUI 모달 캔버스에 방사형 그라데이션 히트맵 포인트로 시각화.
- **AI 밸런스 이상 징후 분석 및 개선 권고안**:
  - 클리어율이 과도하게 높거나 낮을 경우 보스 공격 주기, 회피 무적 시간 조정 권고안 자동 산출.

### 3) Steam Store Front Studio & Global Marketing Localization
- **스팀 상점 번들 자동 패키징**: `output/{폴더}/5_Marketing/store_bundle/`
- **SVG 기반 고해상도 그래픽 캡슐 3종**:
  - `capsule_header.svg` (460x215)
  - `capsule_main.svg` (616x353)
  - `hero_graphic.svg` (374x448)
- **4개 국어 지원 (KO, EN, JP, ZH)**:
  - 한국어, 영어, 일본어, 중국어 번역 시놉시스, 주요 게임 특징, PC 시스템 요구사양(최소/권장)이 담긴 `store_localized.json` 자동 생성.
- **스팀 커뮤니티 평점**: 98% (압도적으로 긍정적) 리뷰 시뮬레이션 및 상점 페이지 프리뷰 제공.

### 4) Multi-Project Portfolio & Infinite Sprint Cycle
- **스튜디오 누적 포트폴리오 관리**:
  - STEP 12(비서실 브리핑) 완료 시 정식 출시작으로 자동 등록.
  - 누적 다운로드 수, 누적 매출(USD), 평균 평점, DAU/CCU 실시간 집계.
- **출시 후 라이브 유지보수 (Auto Live-Ops)**:
  - 대표님 콘솔 명령(`"[게임제목] 시즌2 대규모 업데이트 진행해"`, `"핫픽스 배포"`) 입력 시:
    - `CHANGELOG.md` 자동 생성 및 `3_SourceCode/` 동기화.
    - 실제 Git 릴리즈 태그(`v1.0.1`, `v1.1.0`) 자동 생성 및 깃허브 푸시.
- **무한 스프린트 루프 (Infinite Sprint Cycle)**:
  - 출시 완료 후 자동으로 다음 기획 주제(Topic ID#1, ID#2 ...)로 전환되어 STEP 01부터 다음 게임의 개발 파이프라인이 무한 반복 구동.

---

## 5. 실제 AI 및 Git/GitHub 연동 기술 스펙

### `llm_engine.py` (True Autonomous AI Brain)
- `.env`에 `GEMINI_API_KEY`가 입력되어 있으면 Google Gemini API(`gemini-2.5-flash`)를 호출하여 기획안을 생성하고 코드를 실시간 리팩토링합니다.
- API 키가 없거나 오프라인일 때에도 **시맨틱 절차적 생성 엔진(Semantic Procedural Generator)** 및 **정규식/AST 코드 변환기**가 구동되어 에러 없이 테스트와 게임 개발이 100% 진행됩니다.

### `git_integration.py` (Real Git Pipeline)
- 각 게임 산출물 폴더(`output/{날짜}_{장르}_{제목}/`)에서 로컬 Git 명령(`git init`, `git add .`, `git commit -m "feat: Initial release..."`, `git tag -a v1.0.1`)을 실제로 실행합니다.
- `.env`의 `GITHUB_TOKEN`과 `GITHUB_USERNAME`이 존재할 경우 GitHub REST API(`https://api.github.com/user/repos`)를 통해 원격 저장소를 생성하고 main 브랜치를 푸시합니다.
- 토큰이 없을 경우 가드레일 5호에 따라 거짓 성공을 표기하지 않고 `[AWAIT_INTEGRATION]`으로 정직하게 안내합니다.

---

## 6. 테스트 검증 결과 (100% PASS)

| 테스트 파일 | 대상 모듈 | 검증 항목 | 결과 |
|---|---|---|---|
| `test_module2.py` | Module 2 | 270인 로스터 로딩, 기획안 생성/필터링, 1차 HITL 기획 승인 상태 머신 | **100% PASS** |
| `test_module3.py` | Module 3 | 산출물 5대 파일 검증, 2차 HITL 소스코드 검토, 자연어 AI 리팩토링 및 롤백 | **100% PASS** |
| `test_module4.py` | Module 4 | GitHub 1 Game 1 Repo, WebGL 빌드, Live-Ops 패치노트, 콘솔 디렉티브 | **100% PASS** |
| `test_module5.py` | Module 5 | WebGL 러너, 100회 AI 플레이테스트 히트맵, 스팀 상점 번들, 포트폴리오 무한 루프, REST API | **100% PASS** |

---

## 7. 실행 방법

### 서버 및 오피스 GUI 구동
```bash
# GUI 및 백엔드 서버 동시 가동
python server.py
# 또는 run.bat 실행
```
브라우저에서 `http://127.0.0.1:8080` 접속 시 50x50 오피스 타일맵과 270명의 에이전트 자율 시뮬레이션을 관찰할 수 있으며, 상단 바의 **[Play Now]**, **[AI 플레이테스트]**, **[스팀 상점]**, **[포트폴리오]** 모달을 통해 모든 산출물을 확인하고 직접 플레이할 수 있습니다.

### 통합 검증 테스트 실행
```bash
python test_module5.py
```

