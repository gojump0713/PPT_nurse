# 영남이공대 · 영남대병원 발표자료 (HTML Full Screen Presentation)

2028년 간호사 국가시험 CBT 전환 대응과 의료 VDI 업무환경을 다루는 **24화면 브라우저 전체화면 발표자료**입니다.
`작업지시서_화면설계서.md` 의 사양(PART A 공통 사양 · PART B 화면설계 · PART C 종합 정리)을 그대로 구현했습니다.

- 형식: 브라우저 Full Screen Presentation (PPT 아님, 웹사이트 아님)
- 화면비 16:9, 기준 해상도 1920×1080, `transform: scale()` 반응 축소
- **표지(SCREEN 00)** + 본편 30 SCREEN / 3 PART (CBT · VDI · TILON)
- 빌드 도구·외부 CDN·런타임 의존성 **없음** (ES 모듈 + 자체호스팅 웹폰트·영상)

| 구간 | 내용 |
|---|---|
| `00` | 표지 — 별도 사양서 `docs/표지.pdf` |
| `01` ~ `14` | PART 1 · CBT |
| `15` ~ `20` | PART 2 · VDI |
| `21` ~ `26` | 주요 구축사례 6곳 (발주 측 제공 슬라이드) |
| `27` | PART 2 마무리 — 우선 적용업무 선정 |
| `28` ~ `30` | PART 3 · TILON |

본편 24화면(현 01~20 · 27~30)은 `docs/작업지시서_화면설계서.md` 를 따릅니다.
표지는 번호 체계 밖이라 페이지 인디케이터에 `COVER` 로만 표시되고, 검수 기준의 화면 수·클릭 수에는 포함되지 않습니다.

---

**배포본**: <https://gojump0713.github.io/PPT_nurse/>

## 실행

정적 파일이지만 ES 모듈을 쓰므로 `file://` 이 아닌 로컬 서버로 열어야 합니다.

```bash
npm start          # http://localhost:5173
# 또는
python -m http.server 5173
```

발표장에서는 브라우저를 열고 **F** 키로 전체화면으로 전환하세요.

> 발표 당일 네트워크를 신뢰할 수 없다면 저장소를 클론해 로컬 서버로 여는 편이 안전합니다.
> 폰트·이미지가 전부 자체호스팅이라 첫 로드 이후에는 외부 요청이 전혀 없습니다.

## 빌드 · 배포

번들러가 없으므로 "빌드"는 **검수 → 조립 → 보고** 세 단계를 뜻합니다.

```bash
npm run build        # 검수 통과 시에만 dist/ 생성
npm run preview      # http://localhost:5174 로 배포본 확인
npm run verify:dist  # 빌드 후 dist/ 를 헤드리스 브라우저로 렌더 검증
```

- `tools/check.mjs` 검수를 통과하지 못하면 `dist/` 를 만들지 않고 중단합니다.
- 소스에서 실제로 참조하는 에셋만 담습니다(현재 이미지 1개). 제외된 파일은 전부 콘솔에 출력됩니다 — 저장소에는 그대로 남습니다.
- 산출물: **66개 파일 / 2.82 MB** (폰트 2.52 MB 포함)

`main` 에 푸시하면 `.github/workflows/deploy.yml` 이 위 빌드를 그대로 실행하고
GitHub Pages 로 배포합니다. 검수 실패 시 배포되지 않습니다.

## 조작

| 키 | 동작 |
|---|---|
| `→` `Space` `PageDown` · 화면 클릭 | 다음 단계 또는 다음 페이지 |
| `←` `PageUp` · 우클릭 | 이전 (스텝이 남아 있으면 한 단계 되돌림) |
| `↓` `↑` | 스텝 무시하고 페이지 단위 이동 |
| `ESC` | 전체 목차 오버레이 (24 썸네일, PART 색 구분) |
| 숫자 + `Enter` | 페이지 점프 (`0` `Enter` → 표지, `1` `5` `Enter` → SCREEN 15) |
| `Home` / `End` | 첫 화면 / 마지막 화면 |
| `F` | 전체화면 토글 |
| `N` | **발표자 노트** (주요 발표 멘트 · 다음 화면 연결 멘트) |

- 우하단에 `NN / 24` 와 PART 라벨이 고정 표시됩니다.
- 클릭이 남은 화면은 `▸`, 소진되면 `다음 페이지 →` 로 바뀌고 5초 무동작 시 미세 펄스합니다.
- 마우스를 3초간 움직이지 않으면 커서가 자동으로 숨습니다.
- 주소창 해시로 딥링크됩니다 (`index.html#0` 표지, `index.html#15` SCREEN 15).
- 표지에서는 클릭 인디케이터와 진행 바가 숨겨집니다(사양서 §13 — 발표자가 조작하지 않는 화면).

---

## 구조

```
index.html                  진입점
assets/
  fonts/                    A2Z(에이투지체) 7종 · NanumSquare Neo 4종 → WOFF2 (11MB → 2.5MB)
  images/brand|mascot|dept  ASCII 슬러그로 정규화 + manifest.json
  images/gen/               생성형 AI 이미지 (S04 · S07 · S15) — WebP 18.6MB → 0.12MB
  video/cover-loop.mp4      표지 배경 루프 영상 15초 · 무음 · H.264
src/
  css/
    tokens.css              컬러 · 타이포 스케일 · 모션 토큰
    base.css                리셋 · 스테이지 스케일링 · 페이지 전환 · reveal 시스템
    components.css          공통 컴포넌트 15종
    mocks.css               CBT 응시/관리 화면 목업
    chrome.css              페이지·클릭 인디케이터 · 목차 · 발표자 노트
    screens/cover.css       표지(SCREEN 00) 스타일
    screens/part1|2|3.css   화면별 스타일
  js/
    main.js                 부트스트랩
    engine/                 deck(전환·스텝) · stage(스케일) · nav(조작) · toc · notes · chrome
    components/             하이퍼스크립트 기반 컴포넌트 · 아이콘 · 목업 · 레이더 · 세계지도
    screens/s00…s24.js      표지 + 본편 24화면
    lib/                    dom(h) · anim(Scheduler·countTo)
  data/
    screens.js              24화면 메타 (제목 · 거버닝 메시지 · 발표 멘트 · 클릭 수)
    config.js               발표 전 교체 항목 플래그
tools/
  check.mjs                 최종 검수 3문항 자동 점검
  build.mjs                 검수 → dist/ 조립 → 포함/제외 보고
  shoot.mjs                 Chrome 헤드리스 자동 캡처 + 콘솔 오류 수집
.github/workflows/
  deploy.yml                push(main) → 검수·빌드 → GitHub Pages 배포
```

**화면 모듈 계약** — `src/js/screens/sNN.js` 는 `create()` 하나만 노출합니다.

```js
export function create() {
  return {
    el,                  // .screen 루트 엘리먼트
    enter(sch) {},       // 진입 자동 연출 (sch = Scheduler)
    steps: [(sch) => {}],// 클릭으로 진행되는 단계. 길이 = 설계 클릭 수
    resume(sch) {},      // (선택) 뒤로 이동 복원 후 루프 연출 재개
    leave() {},          // (선택) 정리
  };
}
```

화면은 방문할 때마다 새로 만들어지므로 연출이 항상 처음부터 재생됩니다.
`Scheduler` 가 타이머·rAF를 모두 쥐고 있어 화면 이탈 시 확실히 취소됩니다.

---

## 검수

```bash
npm run check           # 작업지시서 「구현 체크 기준 3문항」 자동 점검
node tools/shoot.mjs    # 24화면 자동 캡처 → tools/shots/*.png + 콘솔 오류 리포트
node tools/shoot.mjs 15 22 --steps 0   # 특정 화면 · 클릭 전 상태만
node tools/shoot.mjs --dist            # 배포 산출물 검증
node tools/shoot.mjs --url https://gojump0713.github.io/PPT_nurse/   # 실제 배포본 검증
```

`shoot.mjs` 는 JS 예외·콘솔 오류가 하나라도 있으면 exit 1 로 끝납니다.
발표 전 교체 대기 항목(데모 영상 등)으로 인한 예상된 404 는 별도로 분리해 보고하고 실패로 치지 않습니다.

현재 상태

| 기준 | 결과 |
|---|---|
| ① 발표 멘트 키워드의 화면 반영 | 전 화면 충족 |
| ② 클릭 합계 ≤ 13회 | **12회** (설계 per-screen 합계와 일치) |
| ③ HTML 고유 연출 | 카운트 모핑(S02) · 수렴 모핑(S15·S28) · 실운영 현장 사진(S14) · 표지 배경 영상(S00) · 지도 팝업(S18) · 자동 2막(S16) |

---

## 발표 전 교체 항목

`src/data/config.js` 의 플래그로 관리합니다. 미완료 항목은 화면에 **교체 대기 배지**가 표시되어 리허설 때 놓치지 않습니다.

| 항목 | 대상 | 상태 |
|---|---|---|
| 제주대 약학대학 실제 운영 사진 | S14 | **완료** — 발주 측 제공 (응시생 식별정보 마스킹) |
| 주요 구축사례 슬라이드 6장 | S21~S26 | **완료** — 발주 측 제공 |
| 표지 배경 루프 영상 | SCREEN 00 | **완료** — 생성형 AI 15초 무음 루프 |
| 시뮬레이션 실습실 · 시험지 더미 · 대학/병원 실루엣 | S04 · S07 · S15 | **완료** — 생성형 AI |
| 학생 응시 / 교수 관리 화면 실제 캡처 | S03 · S10 | 대기 (`assetsFinal`) |
| 글로벌 병원 수치 재검증 | S18 | 대기 (`globalFiguresVerified`) |
| 국내 구축 실적 수치 확정 | S20 | 대기 (`domesticFiguresConfirmed`) |
| 회사 연혁·인증 수치 확정 | S29 | 대기 (`companyFiguresConfirmed`) |

> **S14는 생성형 AI로 만들지 않았습니다.** 그 화면의 주장이 "제안이 아니라, 이미 대학에서
> 운영 중인 환경입니다"이기 때문에, 이 자리는 연출이 아니라 제3자(제주대학교)의 실제 가동 시스템에 대한
> **증거**여야 합니다. 발주 측이 실제 운영 사진을 제공해 그대로 채웠습니다.

자세한 교체 절차는 [`docs/ASSETS.md`](docs/ASSETS.md) 참조.

---

## 폰트

`작업지시서`는 Pretendard CDN을 제안했으나, **오프라인 발표장에서도 렌더링이 100% 동일해야 하므로**
제공된 로컬 폰트를 WOFF2로 변환해 자체호스팅했습니다.

- **A2Z (에이투지체)** 300~900 7단계 → 제목 · 본문 · UI
- **NanumSquare Neo** 400/700/800/900 → Big Number · 디스플레이 숫자 (`tabular-nums`)

원본 TTF/OTF 11.0MB → WOFF2 2.5MB.

## 브라우저

Chrome / Edge 최신 버전 기준으로 개발·검증했습니다.
S16의 동선 애니메이션은 CSS `offset-path` 를 사용하므로 Chromium 계열 또는 Firefox가 필요합니다.
