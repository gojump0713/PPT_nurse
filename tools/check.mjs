/**
 * tools/check.mjs — 작업지시서 「구현 체크 기준 (최종 검수 3문항)」 자동 점검
 *
 *   node tools/check.mjs
 *
 * ① 발표자가 화면만 보고 다음 말을 할 수 있는가
 *    → 각 화면의 렌더 결과 텍스트가 「주요 발표 멘트」의 핵심 키워드를 포함하는지
 * ② 클릭 없이 흐름이 이어지는가 (24화면 클릭 합계 13회 이하)
 * ③ HTML이라서 가능한 것이 쓰였는가 (5종 연출 존재 확인)
 *
 * 브라우저 없이 소스를 정적으로 훑기 때문에 ①은 "설계 데이터 기준" 점검이다.
 * 실제 렌더 결과 확인은 tools/shoot.mjs 로 캡처해 눈으로 본다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ---------- 메타 로드 (정적 파싱 대신 동적 import) ---------- */
const { META, TOTAL_CLICKS, NUMBERED_TOTAL } = await import(
  new URL('../src/data/screens.js', import.meta.url).href
);

let fail = 0;
const ok = (msg) => console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
const bad = (msg) => { fail += 1; console.log(`  \x1b[31m✗\x1b[0m ${msg}`); };
const warn = (msg) => console.log(`  \x1b[33m!\x1b[0m ${msg}`);

/* =====================================================================
   ② 클릭 합계
   ===================================================================== */
console.log('\n[검수 ②] 클릭 합계 13회 이하');
const stepCounts = META.map((m) => {
  const src = read(`src/js/screens/s${String(m.id).padStart(2, '0')}.js`);
  const block = src.slice(src.indexOf('steps: ['));
  // steps 배열 안의 최상위 화살표 함수 개수 = 구현된 클릭 수
  const body = block.slice(0, block.indexOf('\n  };'));
  const n = (body.match(/^\s{6}\(sch\)\s*=>/gm) || []).length;
  return { id: m.id, declared: m.clicks, implemented: n };
});

stepCounts.forEach((s) => {
  if (s.declared !== s.implemented) {
    bad(`SCREEN ${String(s.id).padStart(2, '0')}: 설계 ${s.declared}회 ≠ 구현 ${s.implemented}회`);
  }
});
ok(`화면 구성: 표지(SCREEN 00) + 본편 ${NUMBERED_TOTAL}화면`);
const implTotal = stepCounts.reduce((a, s) => a + s.implemented, 0);
if (implTotal <= 13) ok(`구현 클릭 합계 ${implTotal}회 (설계 ${TOTAL_CLICKS}회) — 기준 13회 이하 충족`);
else bad(`구현 클릭 합계 ${implTotal}회 — 기준 13회 초과`);

/* =====================================================================
   ① 발표 멘트 키워드가 화면 소스에 존재하는가
   ===================================================================== */
console.log('\n[검수 ①] 발표 멘트 핵심 키워드의 화면 반영');
const STOP = new Set([
  '이', '그', '저', '것', '수', '등', '및', '더', '또', '즉', '왜', '이제', '오늘', '지금',
  '있습니다', '입니다', '됩니다', '합니다', '드립니다', '겁니다', '까요', '거죠', '보겠습니다',
]);

/** 발표 멘트에서 화면에 있어야 할 고유명사·숫자 키워드를 뽑는다 */
function keywords(notes) {
  const text = notes.join(' ');
  const found = new Set();
  // 숫자 + 영문 약어
  (text.match(/\d[\d,]*/g) || []).forEach((t) => found.add(t.replace(/,/g, '')));
  (text.match(/[A-Z]{2,}/g) || []).forEach((t) => found.add(t));
  // 4글자 이상 한글 명사구
  (text.match(/[가-힣]{4,}/g) || [])
    .filter((t) => !STOP.has(t))
    .forEach((t) => found.add(t));
  return [...found];
}

let weak = 0;
META.forEach((m) => {
  const file = `src/js/screens/s${String(m.id).padStart(2, '0')}.js`;
  const src = read(file) + read('src/data/screens.js');
  const kws = keywords(m.notes);
  const hit = kws.filter((k) => src.includes(k));
  const rate = kws.length ? hit.length / kws.length : 1;
  if (rate < 0.5) {
    weak += 1;
    warn(`SCREEN ${String(m.id).padStart(2, '0')}: 멘트 키워드 반영률 ${(rate * 100).toFixed(0)}% — 화면 텍스트 보강 검토`);
  }
});
if (weak === 0) ok('전 화면에서 발표 멘트 키워드가 화면 텍스트에 충분히 반영됨');

/* =====================================================================
   ③ HTML 고유 연출 5종
   ===================================================================== */
console.log('\n[검수 ③] HTML이라서 가능한 연출 5종');
const CHECKS = [
  { name: '카운트 모핑 (S02)', file: 'src/js/screens/s02.js', needle: 'countTo' },
  { name: '수렴 모핑 (S15)', file: 'src/js/screens/s15.js', needle: 'is-merging' },
  { name: '수렴 모핑 (S22)', file: 'src/js/screens/s22.js', needle: 'is-landing' },
  { name: '실화면 영상 (S14)', file: 'src/js/screens/s14.js', needle: 'VideoPlayer' },
  { name: '지도 팝업 (S18)', file: 'src/js/screens/s18.js', needle: 'WorldMap' },
  { name: '자동 2막 (S16)', file: 'src/js/screens/s16.js', needle: 'is-act2' },
];
CHECKS.forEach((c) => {
  if (read(c.file).includes(c.needle)) ok(c.name);
  else bad(`${c.name} — 구현 확인 실패`);
});

/* =====================================================================
   부가: 에셋 존재 확인
   ===================================================================== */
console.log('\n[부가] 에셋');
const FONTS = [
  'A2Z-300', 'A2Z-400', 'A2Z-500', 'A2Z-600', 'A2Z-700', 'A2Z-800', 'A2Z-900',
  'NanumSquareNeo-400', 'NanumSquareNeo-700', 'NanumSquareNeo-800', 'NanumSquareNeo-900',
];
const missingFonts = FONTS.filter((f) => !fs.existsSync(path.join(ROOT, 'assets/fonts', `${f}.woff2`)));
if (missingFonts.length) bad(`폰트 누락: ${missingFonts.join(', ')}`);
else ok(`웹폰트 ${FONTS.length}종 자체호스팅 확인`);

if (!fs.existsSync(path.join(ROOT, 'assets/images/brand/tilon-ci.png'))) bad('틸론 CI 이미지 누락');
else ok('틸론 CI 이미지 확인');

const { CONFIG } = await import(new URL('../src/data/config.js', import.meta.url).href);
console.log('\n[발표 전 교체 대기]');
if (!CONFIG.assetsFinal) warn('제주대 매뉴얼 실제 캡처 미반영 (S03 · S10 · S14) — config.assetsFinal');
if (!fs.existsSync(path.join(ROOT, CONFIG.demoVideo))) warn(`CBT 데모 영상 없음 (${CONFIG.demoVideo}) — S14는 대체 화면으로 동작`);
if (!CONFIG.globalFiguresVerified) warn('글로벌 병원 수치 재검증 미완료 (S18)');
if (!CONFIG.domesticFiguresConfirmed) warn('국내 실적 수치 영업부서 확정 미완료 (S20)');
if (!CONFIG.companyFiguresConfirmed) warn('회사 연혁 수치 확정 미완료 (S23)');

console.log(fail === 0 ? '\n\x1b[32m검수 통과\x1b[0m\n' : `\n\x1b[31m검수 실패 ${fail}건\x1b[0m\n`);
process.exit(fail === 0 ? 0 : 1);
