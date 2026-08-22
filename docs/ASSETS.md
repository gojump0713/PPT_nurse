# 발표 전 에셋 교체 가이드

작업지시서 PART C-C(영상) · C-D(이미지) · C-E(데이터) 에 명시된 "발표 전 확정 필요" 항목의 교체 절차입니다.
교체 전에는 해당 화면에 **금색 점선 배지**가 떠서 리허설 때 반드시 눈에 띕니다.

---

## 1. 제주대 CBT 매뉴얼 실제 화면 캡처 (S03 · S10 · S14)

현재는 매뉴얼과 동일한 정보구조의 **CSS 목업**(`src/js/components/mocks.js`)으로 동작합니다.
실제 캡처를 확보하면 다음 순서로 교체합니다.

### 1-1. 파일 배치

```
assets/images/manual/
  student-solve.png     # S03 — 문항 · 타이머 · 이동 · 체크가 모두 보이는 응시 화면
  prof-bank.png         # S10 — 문제은행 목록
  prof-create.png       # S10 — 신규 문제 등록
  prof-exam.png         # S10 — 시험(CBT) 등록
  prof-score.png        # S10 — 채점 화면
  student-tutorial.png  # S14 — CBT 체험하기
  student-submit.png    # S14 — 최종 제출
```

권장 해상도: 가로 2000px 이상, PNG. 개인정보·실명이 보이면 반드시 마스킹합니다.

### 1-2. 코드 교체

| 화면 | 파일 | 교체 지점 |
|---|---|---|
| S03 | `src/js/screens/s03.js` | `CbtStudentMock()` → `h('img', { src: 'assets/images/manual/student-solve.png', alt: '' })` |
| S10 | `src/js/screens/s10.js` | `CbtProfessorMock(k)` → 각 키에 대응하는 `<img>` |
| S14 | `src/js/screens/s14.js` | `slides` 배열의 `CbtStudentMock(...)` → `<img>` 3장 |

S03은 핫스팟 좌표(`SPOTS` 배열의 `top`)가 목업 기준이므로, 실제 캡처의 UI 위치에 맞춰
`top` 값과 `left/right: 1332` 를 조정해야 합니다. `.s03__mock` 은 `left: 340px; width: 1000px` 입니다.

### 1-3. 플래그 전환

```js
// src/data/config.js
assetsFinal: true,
```

배지가 사라지고, S10 캡션의 "실제 업무 화면" 문구가 사실과 일치하게 됩니다.

---

## 2. CBT 운영 데모 영상 (S14)

작업지시서 PART C-C 기준:

- 길이 20~30초, **무음 자동재생 루프**
- 구성: ① 학생 로그인·CBT 체험 진입(5s) ② 문항 풀이·이동·체크(10s) ③ 검토·제출(5s) ④ 교수 채점·결과(7s)
- 구간별 하단 1줄 자막 (`체험 → 응시 → 제출 → 채점`)

### 배치

```
assets/video/cbt-demo.mp4
```

경로만 맞추면 자동으로 재생됩니다(`src/data/config.js` 의 `demoVideo`).
**영상이 없거나 재생에 실패하면 자동으로 이미지 슬라이드로 폴백**하므로, 영상 없이도 발표는 가능합니다.
폴백 시 "LIVE DEMO" 배지는 사실과 다르므로 자동으로 제거됩니다.

인코딩 권장: H.264 / 1920×1080 / CRF 23 / `-movflags +faststart` / 오디오 트랙 제거.

```bash
ffmpeg -i src.mov -c:v libx264 -crf 23 -preset slow -an \
       -vf scale=1920:-2 -movflags +faststart assets/video/cbt-demo.mp4
```

---

## 3. 수치 재검증

### 3-1. S18 — 글로벌 병원 (재검증 실패 시 수치 제거)

작업지시서 PART C-E에 **"재검증 필요 — 실패 시 수치 삭제"** 로 명시된 항목입니다.

```js
// src/js/screens/s18.js — HOSPITALS[].rows
{ label: '전체 직원', value: 78000, suffix: '명' },
```

- 검증 완료 → `src/data/config.js` 의 `globalFiguresVerified: true` (각주에서 "재검증 필요" 문구 제거)
- 검증 실패 → 해당 `rows` 항목을 지우고 정성 서술(`display: 'VDI'` 형태)로 대체

### 3-2. S20 — 국내 구축 실적

`src/js/screens/s20.js` 의 `GROUPS` 배열이 기관 목록입니다.
영업부서 확정본과 대조한 뒤 `domesticFiguresConfirmed: true` 로 전환하세요.
좌측 Big Number(26)는 그룹 합계가 아니라 별도 상수이므로, 목록을 고치면 `big.countUp(sch, 26, …)` 도 함께 확인합니다.

기관 로고는 **사용 권리 확인 전이므로 텍스트 그리드로 구현**되어 있습니다.
권리가 확인된 로고만 `assets/images/org/` 에 넣고 `.s20__org` 를 `<img>` 로 교체하세요.

### 3-3. S23 — 회사 연혁

`src/js/screens/s23.js` 의 `ERAS` / `PRODUCTS` 를 최신 회사소개서 기준으로 확정한 뒤
`companyFiguresConfirmed: true` 로 전환합니다.

---

## 4. 선택 이미지 (없어도 발표 가능)

작업지시서에서 "선택"으로 표시된 항목입니다. 현재는 모두 생략되어 있습니다.

| 항목 | 화면 | 비고 |
|---|---|---|
| 간호 시뮬레이션 실습실 사진 | S04 | 상단 트랙 배경에 저채도로 |
| 시험지 채점 더미 사진 | S07 | PBT 띠 배경에 흐리게 |
| 대학·병원 실루엣 일러스트 | S15 | 현재 인라인 SVG 실루엣으로 대체 구현됨 |
| 병원 평면도 일러스트 | S16 | 현재 CSS/SVG 평면도로 대체 구현됨 |
| Dstation · ABT 제품 스크린샷 | S23 | 내부 에셋 확보 시 하단 제품 라벨 옆에 배치 |

S15·S16은 생성형 AI 이미지 없이도 완결된 상태이므로, 교체는 품질 개선 목적일 때만 하면 됩니다.

---

## 5. 교체 후 확인

```bash
npm run check                 # 검수 3문항 + 교체 대기 항목 재확인
node tools/shoot.mjs 3 10 14  # 교체한 화면만 캡처해 눈으로 확인
```
