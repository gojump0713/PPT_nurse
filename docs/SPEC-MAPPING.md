# 작업지시서 ↔ 구현 대조표

`작업지시서_화면설계서.md` 의 각 항목이 어디에 구현되어 있는지, 사양과 다르게 처리한 부분은 무엇인지 정리합니다.

---

## PART A — 공통 사양

| 사양 | 구현 |
|---|---|
| 브라우저 Full Screen Presentation | `index.html` + `src/js/engine/stage.js` (`F` 키 전체화면) |
| 16:9 / 1920×1080 / `transform: scale()` | `stage.js` `mountStage()` — `min(vw/1920, vh/1080)` |
| 24 SCREEN · 페이지 단위 전환 · 세로 스크롤 금지 | `engine/deck.js`, `base.css` `html,body{overflow:hidden}` |
| → / Space / 클릭 = 다음, ← = 이전 | `engine/nav.js` |
| ESC 전체 목차 오버레이 | `engine/toc.js` (24 썸네일, PART 색 구분) |
| 숫자 + Enter 페이지 점프 | `engine/nav.js` `jump-hud` |
| 우하단 `NN / 24` + PART 라벨 | `engine/chrome.js` `.page-indicator` |
| 커서 자동 숨김 3초 | `engine/chrome.js` `IDLE_CURSOR_MS` |
| 기본 전환 0.6s Fade + 20px Slide-up | `base.css` `.screen` / `--t-page: 600ms` |
| PART 전환(14→15, 21→22) 1.2s 전용 | `deck.js` `BRIDGE_FROM` + `.is-bridge-in/out` |
| 등장 순서 제목(0s) → 거버닝(0.4s) → 본문(0.8s~, 0.15s) | `components/screen.js` `standardIntro()`, `tokens.css` `--d-*` |
| 클릭 인디케이터 ▸ / 「다음 페이지 →」 / 5초 펄스 | `engine/chrome.js` `renderClickIndicator()` |
| 타이포 스케일 (Big Number 240~360 등) | `tokens.css` `--fs-*` |

## PART C — 종합 정리

| 사양 | 구현 |
|---|---|
| 배경 `#0B1220` / 카드 `#131C2E` | `tokens.css` `--c-bg`, `--c-card` |
| PART 1/2/3 포인트 `#1C60EF` / `#0E9E8E` / `#F0B429` | `tokens.css` `body[data-part]` 스와핑 |
| 경고 `#E5484D` | `--c-danger` |
| 애니메이션 0.6~1.2s `ease-out` 통일, 바운스 금지 | `--ease: cubic-bezier(.16,.84,.44,1)` 전역 사용 |
| 공통 컴포넌트 15종 | `src/js/components/index.js` + `components.css` |

### 공통 컴포넌트 대응

| 작업지시서 | 구현 |
|---|---|
| `<PageShell>` | `components/screen.js` `ScreenRoot()` |
| `<Header>` | `Header()` / `.hdr` |
| `<GoverningMessage>` | `Governing()` / `.gov` |
| `<BigNumber>` | `BigNumber()` — `countUp` · `morphTo` · `swapText` |
| `<ComparisonCard>` | `Comparison()` / `.cmp` (+ S02는 전용 테이블 레이아웃) |
| `<DataCard>` | `DataCard()` / `.dcard` |
| `<Timeline>` | `Timeline()` / `.tl` (S05) |
| `<ProcessBand>` | `ProcessBand()` / `.band` (S07) · `Track()` / `.track` (S04) |
| `<FlipCard>` | `FlipCard()` / `.flip` (S19) · S09는 전용 플립 |
| `<Tooltip>` | `Hotspot()` / `.hot` (S03) |
| `<Modal>` | `Popover()` / `.pop` (S18) |
| `<VideoPlayer>` | `VideoPlayer()` / `.vplayer` — 폴백 슬라이드 내장 (S14) |
| `<CTAButton>` | `CTA()` / `.cta` (S21 · S24) |
| `<SourceFooter>` | `SourceFooter()` / `.srcfoot` |
| `<TOCOverlay>` | `engine/toc.js` |
| `<ClickIndicator>` | `engine/chrome.js` |

---

## 사양과 다르게 처리한 부분

### 1. 폰트 — Pretendard CDN → 로컬 A2Z + NanumSquare Neo

작업지시서는 `Pretendard CDN, font-display: swap` 을 지정했으나,

- 발표장 네트워크에 의존하면 CDN 실패 시 폰트가 바뀝니다.
- 프로젝트에 로컬 폰트(에이투지체 9종, NanumSquareNeo 5종)가 제공되었습니다.

→ 로컬 폰트를 WOFF2로 변환해 **자체호스팅**하고 `font-display: block` 을 씁니다.
`block` 은 Big Number가 폴백 폰트로 잠깐 그려졌다 교체되며 튀는 것을 막기 위한 선택이며,
`main.js` 가 `document.fonts.ready` 를 기다린 뒤 첫 화면을 그립니다.

### 2. 클릭 합계 — 13회가 아니라 11회

작업지시서 검수 기준 ②는 "13회 이하 유지 (현재 설계: 13회)" 라고 적혀 있으나,
PART B의 화면별 「클릭 횟수」를 모두 더하면 **11회**입니다.

```
S01 1 · S02 1 · S07 1 · S09 1 · S12 1 · S13 1 · S15 1 · S17 1 · S18 2 · S21 1 = 11
```

화면별 설계값을 정본으로 보고 11회로 구현했습니다. 기준(≤13)은 충족합니다.
`npm run check` 가 화면별 설계값과 구현값을 매번 대조합니다.

### 3. S03 · S10 · S14 — 매뉴얼 캡처 대신 목업

실제 제주대 매뉴얼 PDF 캡처가 저장소에 없어, **같은 정보구조의 CSS 목업**으로 구현했습니다.
캡처 없이도 발표 리허설이 가능하고, 교체 지점이 한 곳으로 모여 있습니다.

목업이 실물로 오해되지 않도록, `config.assetsFinal === false` 인 동안
해당 화면에 「매뉴얼 캡처 교체 예정」 배지가 표시됩니다. 교체 절차는 `docs/ASSETS.md`.

### 4. S14 — 영상 미확보 시 자동 폴백

작업지시서의 "영상 미확보 시 대체: 학생 응시 화면 3장 자동 슬라이드"를 **런타임 자동 폴백**으로 구현했습니다.
`assets/video/cbt-demo.mp4` 가 없거나 재생에 실패하면 슬라이드로 전환되고,
사실과 달라지는 "LIVE DEMO" 배지는 자동 제거됩니다.

### 5. 생성형 AI 에셋 — 무엇을 만들고 무엇을 만들지 않았는가

작업지시서 PART C-D가 `생성형 AI`로 지정했거나 「선택」으로 비워 둔 항목은 Higgsfield 로 생성해 반영했습니다.

| 화면 | 에셋 | 지시서 근거 |
|---|---|---|
| SCREEN 00 | 표지 배경 루프 영상 15초 · 무음 · H.264 | 표지.pdf §8 §9 §16 (프롬프트 명시) |
| S15 | 대학 시험실 / 병원 복도 실루엣 2장 | PART C-D 「생성형 AI」 + 프롬프트 명시 |
| S04 | 간호 시뮬레이션 실습실 | PART C-D 「선택 · 검색」 |
| S07 | 시험지 채점 더미 | PART C-D 「선택 · 검색」 |

지시서의 원본 프롬프트는 흰 배경 기준이라 다크 배경 덱에서는 밝은 사각형으로 떠 버립니다.
그래서 배경색을 다크로 바꿔 생성하고, `mix-blend-mode: screen` 으로 어두운 영역을 떨어뜨려
패널 그라디언트와 이음매 없이 합성했습니다. 원본 18.6MB → WebP 0.12MB.

**S16 병원 평면도는 생성하지 않고 CSS/SVG 유지.** 의료진 아이콘이 `offset-path` 모션 경로를 따라
움직이는데, 그 좌표가 평면도의 방 위치와 맞물려 있습니다. 래스터 이미지로 바꾸면 좌표를 다시 맞춰야 하고
PART 컬러 전환에도 따라오지 못해 품질이 오히려 떨어집니다.

**S14 데모 영상은 의도적으로 생성하지 않음.** 아래 6절 참조.

### 6. S14 — 생성형 AI를 쓰지 않는 이유

S14의 거버닝 메시지는 「제안이 아니라, 이미 대학에서 운영 중인 환경입니다」입니다.
즉 이 화면의 영상은 연출이 아니라 **제3자(제주대학교)의 실제 가동 시스템에 대한 증거**입니다.
합성하면 영남이공대·영남대병원 청중에게 제주대의 운영 실태를 조작해 보여주는 것이 됩니다.
품질 면에서도 생성 모델은 한글 UI를 읽을 수 없는 형태로 뭉갭니다.

따라서 이 자리는 **틸론이 실제 화면을 녹화**해서 채워야 합니다.
그때까지는 같은 정보구조의 목업 슬라이드로 폴백하고, 사실과 달라지는 "LIVE DEMO" 배지는 자동 제거됩니다.

### 7. 표지 배경 영상에 블러를 건 이유

생성 모델은 화면 속 UI 위에 **한글처럼 보이지만 실제로는 의미 없는 글자**를 그려 넣습니다.
1920px 원본에서는 이게 또렷하게 읽혀 표지의 신뢰도를 깎습니다
(프롬프트에 `no readable text` 를 넣어도 사라지지 않습니다).

그래서 `filter: blur(3.5px)` 를 적용해 판독 불가 수준까지 낮췄습니다.
사람·화면·의료장비의 형태는 그대로 남아 사양서 §2 「사람과 환경이 보여야 함」은 유지됩니다.
`transform: scale(1.035)` 는 블러로 생기는 가장자리 비침을 가리기 위한 것입니다.

### 8. 생성 영상은 반드시 H.264로 재인코딩

생성된 표지 영상은 **HEVC(H.265 / hvc1)** 로 나옵니다. 크롬은 플랫폼 코덱이 없으면 HEVC를 재생하지 못해
발표장에서 표지가 통째로 검게 나올 수 있습니다. 그래서 배포 전 H.264(avc1)로 재인코딩합니다.

```bash
ffmpeg -y -i src.mp4 -c:v libx264 -profile:v high -pix_fmt yuv420p \
       -crf 22 -preset slow -an -movflags +faststart assets/video/cover-loop.mp4
```

### 9. 표지(SCREEN 00)를 24화면 번호 밖에 둠

표지는 별도 사양서(`docs/표지.pdf`)로 왔고, 작업지시서의 화면 번호 체계(`NN / 24`)와 검수 기준은
본편 24화면을 전제로 합니다. 그래서 표지는 `id: 0, cover: true` 로 두고
페이지 인디케이터에 `COVER` 로만 표시하며, 화면 수·클릭 수 검수 대상에서 제외했습니다.
해시 딥링크는 `#0` 이 표지, `#1`~`#24` 가 본편입니다.

### 6. 발표자 노트(N 키) 추가

작업지시서 §1의 "불필요 UI 없음"을 지키기 위해 **기본 숨김**입니다.
`N` 을 눌렀을 때만 우측에서 열리며, 화면별 「주요 발표 멘트」와 「다음 화면 연결 멘트」를 원문 그대로 보여줍니다.
검수 기준 ①("발표자가 화면만 보고 다음 말을 할 수 있는가")의 리허설 도구로 쓰라고 넣었습니다.

### 7. S18 — 마커 번호 부여

Cleveland(오하이오)와 Mass General Brigham(보스턴)이 지리적으로 가까워 세계지도 위에서 두 마커가 겹칩니다.
어느 카드가 어느 마커인지 구분되도록 마커와 카드에 `01` / `02` 번호를 붙였습니다.

### 8. S02 — 로드 시 CBT 컬럼 완전 숨김

"로드: PBT 컬럼만 표시"를 그대로 따르되, 우측을 흐릿하게 미리 보여주면
같은 숫자(8/295/3)가 비쳐 "현행과 동일"로 오독되므로 **완전히 감췄다가** 클릭 시 모핑과 함께 등장시킵니다.
