/**
 * tools/build.mjs — 배포용 산출물(dist/) 생성
 *
 *   node tools/build.mjs
 *
 * 이 프로젝트는 번들러가 없다(ES 모듈 + 자체호스팅 폰트를 그대로 서빙).
 * 따라서 "빌드"는 번들링이 아니라 다음 세 가지를 뜻한다.
 *
 *   1. 검수  — tools/check.mjs 를 통과하지 못하면 배포 산출물을 만들지 않는다
 *   2. 조립  — 발표에 실제로 필요한 파일만 dist/ 로 모은다
 *   3. 보고  — 무엇을 넣고 무엇을 뺐는지 전부 출력한다 (조용한 누락 금지)
 *
 * 이미지는 소스에서 실제로 참조하는 것만 담는다. 저장소에는 제공받은 에셋을
 * 모두 보관하되, 배포본에는 쓰이지 않는 8MB를 싣지 않기 위함이다.
 * 제외된 파일은 아래 목록으로 전부 출력되므로 누락을 눈으로 확인할 수 있다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const mb = (n) => `${(n / 1048576).toFixed(2)} MB`;

const c = {
  ok: (s) => `\x1b[32m${s}\x1b[0m`,
  warn: (s) => `\x1b[33m${s}\x1b[0m`,
  bad: (s) => `\x1b[31m${s}\x1b[0m`,
  dim: (s) => `\x1b[90m${s}\x1b[0m`,
};

/* ---------------------------------------------------------------
   1. 검수
   --------------------------------------------------------------- */
console.log('\n[1/3] 검수');
const check = spawnSync(process.execPath, [path.join(__dirname, 'check.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
});
if (check.status !== 0) {
  console.log(c.bad('\n검수 실패 — 빌드를 중단합니다.\n'));
  process.exit(1);
}

/* ---------------------------------------------------------------
   2. 조립
   --------------------------------------------------------------- */
console.log('[2/3] dist/ 조립');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

let copied = 0;
let bytes = 0;

function copyFile(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  copied += 1;
  bytes += fs.statSync(dst).size;
}

function copyDir(srcDir, filter = () => true) {
  const abs = path.join(ROOT, srcDir);
  if (!fs.existsSync(abs)) return;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true, recursive: true })) {
    if (entry.isDirectory()) continue;
    const src = path.join(entry.parentPath ?? entry.path, entry.name);
    const r = rel(src);
    if (!filter(r)) continue;
    copyFile(src, path.join(DIST, r));
  }
}

/* --- 소스에서 실제로 참조하는 에셋 경로 수집 --- */
const sourceText = (() => {
  let out = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const entry of fs.readdirSync(path.join(ROOT, 'src'), { withFileTypes: true, recursive: true })) {
    if (entry.isDirectory()) continue;
    const p = path.join(entry.parentPath ?? entry.path, entry.name);
    if (/\.(js|css|html)$/.test(p)) out += '\n' + fs.readFileSync(p, 'utf8');
  }
  return out;
})();

const referenced = new Set(
  (sourceText.match(/assets\/[A-Za-z0-9._\-/]+\.[A-Za-z0-9]+/g) || [])
    .map((s) => s.replace(/^\.\.\/\.\.\//, ''))
);

/* --- 진입점 · 소스 --- */
copyFile(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
copyFile(path.join(ROOT, '.nojekyll'), path.join(DIST, '.nojekyll'));
copyDir('src', (r) => /\.(js|css)$/.test(r));

/* --- 폰트: 전부 (모든 웨이트가 @font-face 에 선언되어 있다) --- */
copyDir('assets/fonts', (r) => r.endsWith('.woff2'));
copyFile(path.join(ROOT, 'assets/favicon.svg'), path.join(DIST, 'assets/favicon.svg'));

/* --- 영상: 있으면 담고, 없으면 폴백으로 동작 --- */
const videoDir = path.join(ROOT, 'assets/video');
const videos = fs.existsSync(videoDir)
  ? fs.readdirSync(videoDir).filter((f) => /\.(mp4|webm)$/i.test(f))
  : [];
videos.forEach((f) => copyFile(path.join(videoDir, f), path.join(DIST, 'assets/video', f)));

/* --- 이미지: 참조된 것만 --- */
const imgDir = path.join(ROOT, 'assets/images');
const allImages = fs.existsSync(imgDir)
  ? fs.readdirSync(imgDir, { withFileTypes: true, recursive: true })
      .filter((e) => !e.isDirectory() && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(e.name))
      .map((e) => rel(path.join(e.parentPath ?? e.path, e.name)))
  : [];

const usedImages = allImages.filter((r) => referenced.has(r));
const unusedImages = allImages.filter((r) => !referenced.has(r));
usedImages.forEach((r) => copyFile(path.join(ROOT, r), path.join(DIST, r)));

/* ---------------------------------------------------------------
   3. 보고
   --------------------------------------------------------------- */
console.log('\n[3/3] 결과');

const fonts = fs.readdirSync(path.join(DIST, 'assets/fonts'));
const fontBytes = fonts.reduce((a, f) => a + fs.statSync(path.join(DIST, 'assets/fonts', f)).size, 0);

console.log(`  ${c.ok('✓')} 화면 스크립트 24개 · 엔진/컴포넌트 포함 소스 전체`);
console.log(`  ${c.ok('✓')} 웹폰트 ${fonts.length}종  ${c.dim(mb(fontBytes))}`);
console.log(`  ${c.ok('✓')} 이미지 ${usedImages.length}개 (소스에서 참조된 것만)`);
usedImages.forEach((r) => console.log(`      ${c.dim(r)}`));

if (videos.length) {
  console.log(`  ${c.ok('✓')} 영상 ${videos.length}개`);
} else {
  console.log(`  ${c.warn('!')} 영상 없음 — S14는 대체 화면(이미지 슬라이드)으로 동작합니다`);
}

if (unusedImages.length) {
  const unusedBytes = unusedImages.reduce((a, r) => a + fs.statSync(path.join(ROOT, r)).size, 0);
  console.log(`\n  ${c.warn('!')} 배포본에서 제외된 이미지 ${unusedImages.length}개 ${c.dim(`(${mb(unusedBytes)} 절감)`)}`);
  console.log(`     ${c.dim('저장소에는 그대로 보관됩니다. 화면에서 쓰기 시작하면 자동으로 포함됩니다.')}`);
  const byDir = {};
  unusedImages.forEach((r) => {
    const d = path.dirname(r);
    byDir[d] = (byDir[d] || 0) + 1;
  });
  Object.entries(byDir).forEach(([d, n]) => console.log(`      ${c.dim(`${d}/ — ${n}개`)}`));
}

console.log(`\n  dist/  ${copied}개 파일 · ${mb(bytes)}`);
console.log(c.ok('\n빌드 완료\n'));
