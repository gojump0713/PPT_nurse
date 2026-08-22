/**
 * tools/shoot.mjs — 로컬 정적 서버 + Chrome(CDP) 자동 캡처 · 콘솔 오류 수집
 *
 *   node tools/shoot.mjs                 # 24화면 전부 캡처
 *   node tools/shoot.mjs 1 2 15 22       # 특정 화면만
 *   node tools/shoot.mjs --steps 2       # 각 화면에서 스텝을 2회까지 진행한 뒤 캡처
 *   node tools/shoot.mjs --dist          # 소스 대신 배포 산출물(dist/)을 검증
 *   node tools/shoot.mjs --url https://gojump0713.github.io/PPT_nurse/   # 실제 배포본 검증
 *
 * 결과: tools/shots/*.png  ·  콘솔 오류는 stdout 에 요약
 * 외부 의존 없음 (Node 내장 http/ws + 설치된 Chrome/Edge 사용)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVE_DIST = process.argv.includes('--dist');
const ROOT = SERVE_DIST
  ? path.resolve(__dirname, '..', 'dist')
  : path.resolve(__dirname, '..');
const OUT = path.join(__dirname, SERVE_DIST ? 'shots-dist' : 'shots');
const PORT = 5178;
const CDP_PORT = 9333;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

/* ---------------- static server ---------------- */
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    let file = path.join(ROOT, url === '/' ? 'index.html' : url);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    fs.stat(file, (err, st) => {
      if (err || st.isDirectory()) { res.writeHead(404).end('not found'); return; }
      res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
  });
  return new Promise((r) => server.listen(PORT, '127.0.0.1', () => r(server)));
}

/* ---------------- chrome ---------------- */
function findBrowser() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  return candidates.find((p) => fs.existsSync(p));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdpTargets() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page;
    } catch { /* 아직 안 떴다 */ }
    await sleep(250);
  }
  throw new Error('CDP 연결 실패');
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        (this.handlers.get(msg.method) || []).forEach((fn) => fn(msg.params));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener('open', () => resolve(new CDP(ws)));
    ws.addEventListener('error', reject);
  });
}

/* ---------------- main ---------------- */
const argv = process.argv.slice(2);
const stepsFlagIdx = argv.indexOf('--steps');
const STEPS = stepsFlagIdx >= 0 ? parseInt(argv[stepsFlagIdx + 1], 10) : 99;
const pages = argv
  .filter((a, i) => /^\d+$/.test(a) && !(stepsFlagIdx >= 0 && i === stepsFlagIdx + 1))
  .map(Number);
const TARGETS = pages.length ? pages : Array.from({ length: 24 }, (_, i) => i + 1);

/* --url 이 주어지면 로컬 서버 대신 실제 배포본을 검증한다 */
const urlFlagIdx = process.argv.indexOf('--url');
const REMOTE = urlFlagIdx >= 0 ? process.argv[urlFlagIdx + 1].replace(/\/$/, '') : null;
const baseUrl = REMOTE || `http://127.0.0.1:${PORT}`;

const server = REMOTE ? null : await serve();
fs.mkdirSync(OUT, { recursive: true });
if (REMOTE) console.log(`대상: ${REMOTE}\n`);

const bin = findBrowser();
if (!bin) { console.error('Chrome/Edge 를 찾지 못했습니다.'); process.exit(1); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ppt-shoot-'));
const chrome = spawn(bin, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--mute-audio',
  '--force-device-scale-factor=1',
  '--window-size=1920,1080',
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${CDP_PORT}`,
  'about:blank',
], { stdio: 'ignore' });

const target = await cdpTargets();
const cdp = await connect(target.webSocketDebuggerUrl);

const problems = [];
await cdp.send('Runtime.enable');
await cdp.send('Log.enable');
await cdp.send('Page.enable');
cdp.on('Runtime.exceptionThrown', (p) => {
  const d = p.exceptionDetails;
  problems.push(`EXCEPTION @${current}: ${d.exception?.description || d.text}`);
});
cdp.on('Runtime.consoleAPICalled', (p) => {
  if (p.type === 'error' || p.type === 'warning') {
    problems.push(`${p.type.toUpperCase()} @${current}: ${p.args.map((a) => a.value ?? a.description ?? '').join(' ')}`);
  }
});
cdp.on('Log.entryAdded', (p) => {
  if (p.entry.level === 'error') problems.push(`LOG @${current}: ${p.entry.text} ${p.entry.url || ''}`);
});

await cdp.send('Emulation.setDeviceMetricsOverride', {
  width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false,
});

let current = '-';

for (const n of TARGETS) {
  current = `S${String(n).padStart(2, '0')}`;
  await cdp.send('Page.navigate', { url: `${baseUrl}/index.html#${n}` });
  await sleep(3000); // 폰트 로딩 + 진입 연출

  // 스텝(클릭) 진행
  const info = await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const d = window.deck;
      if (!d) return JSON.stringify({ error: 'deck 없음' });
      let n = 0;
      while (d.stepsLeft > 0 && n < ${STEPS}) { d.next(); n += 1; }
      return JSON.stringify({ steps: d.stepsTotal, ran: n, id: d.meta.id, part: d.meta.part });
    })()`,
    returnByValue: true,
  });
  await sleep(7000); // 스텝 연출 + 자동 연출(최장 S16 2막) 완료 대기

  const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, `${current}.png`), Buffer.from(shot.data, 'base64'));
  console.log(`${current}  ${info.result.value}`);
}

/* 발표 전 교체 대기 항목 때문에 예상되는 요청 실패는 실패로 치지 않는다.
   (S14 데모 영상은 없으면 이미지 슬라이드로 자동 폴백하도록 설계되어 있다) */
const EXPECTED = [/assets\/video\/[^\s]*\.(mp4|webm)/];
const expected = problems.filter((p) => EXPECTED.some((re) => re.test(p)));
const real = problems.filter((p) => !EXPECTED.some((re) => re.test(p)));

console.log('\n--- 콘솔 진단 ---');
if (real.length === 0) console.log('오류/경고 없음');
else real.forEach((p) => console.log(p));

if (expected.length) {
  console.log('\n--- 예상된 미확보 에셋 (폴백 동작) ---');
  expected.forEach((p) => console.log(p));
}

chrome.kill();
if (server) server.close();
process.exit(real.length ? 1 : 0);
