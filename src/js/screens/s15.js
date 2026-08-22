/**
 * SCREEN 15 (PART 전환 · 브리지 ①) — 시험정보 보호 → 의료정보 보호
 *
 * 발표 전체에서 가장 극적인 전환. 두 세계가 하나의 구조로 합쳐지는 모핑이
 * 3부 구성을 하나의 이야기로 묶는다. (개발 리소스 최우선 투입 화면)
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(15);

const UNI = ['시험문제', '성적', '평가데이터'];
const HOS = ['EMR', 'PACS', '환자정보', '연구데이터'];
const CORE = [
  { title: '데이터 중앙 보관', icon: 'server' },
  { title: '화면 전송', icon: 'monitor' },
  { title: '접근 통제', icon: 'lock' },
];

/** 대학 시험실 실루엣 (책상 그리드) */
function UniSilhouette() {
  const rows = [];
  for (let r = 0; r < 4; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      const scale = 1 - r * 0.13;
      rows.push(h('rect', {
        x: 60 + c * 76 + r * 16, y: 150 + r * 66,
        width: 58 * scale, height: 26 * scale, rx: 4,
        fill: 'currentColor',
      }));
    }
  }
  return h('svg.s15__silhouette', { viewBox: '0 0 520 420', preserveAspectRatio: 'xMidYMid meet' },
    h('rect', { x: 40, y: 60, width: 440, height: 60, rx: 6, fill: 'currentColor', opacity: 0.5 }),
    ...rows
  );
}

/** 병원 복도 실루엣 (원근 복도) */
function HosSilhouette() {
  return h('svg.s15__silhouette', { viewBox: '0 0 520 420', preserveAspectRatio: 'xMidYMid meet' },
    h('path', { d: 'M20 400 L170 150 L350 150 L500 400 Z', fill: 'currentColor', opacity: 0.28 }),
    h('path', { d: 'M170 150 L350 150 L350 60 L170 60 Z', fill: 'currentColor', opacity: 0.45 }),
    ...[0, 1, 2].map((i) =>
      h('rect', { x: 40 + i * 26, y: 250 + i * 40, width: 70 - i * 12, height: 120 - i * 22, rx: 5, fill: 'currentColor', opacity: 0.5 })
    ),
    ...[0, 1, 2].map((i) =>
      h('rect', { x: 410 - i * 22, y: 250 + i * 40, width: 70 - i * 12, height: 120 - i * 22, rx: 5, fill: 'currentColor', opacity: 0.5 })
    )
  );
}

function Panel(kind, title, items, result, silhouette) {
  return h(`div.s15__panel.s15__panel--${kind}`,
    h('div.s15__panel-bg', silhouette),
    h('div.s15__panel-inner',
      h('div.s15__panel-title', title),
      h('ul.s15__items', ...items.map((t) => h('li.s15__item', t))),
      h('div.s15__panel-arrow', '↓'),
      h('div.s15__panel-result', result)
    )
  );
}

export function create() {
  /* PART 인디케이터: PART 1 → PART 2 로 교체되는 전용 헤더 */
  const partFrom = h('span.s15__part.is-from', h('b', 'PART 1'), 'CBT');
  const partTo = h('span.s15__part.is-to', h('b', 'PART 2'), 'VDI');
  const header = rv('down', 'header.hdr.s15__hdr',
    h('h1.hdr__title', meta.title),
    h('div.s15__parts', partFrom, h('span.s15__part-arrow', '→'), partTo)
  );

  const uni = Panel('uni', '대학', UNI, '안전한 시험환경', UniSilhouette());
  const hos = Panel('hos', '병원', HOS, '안전한 의료 업무환경', HosSilhouette());

  const coreEls = CORE.map((c, i) =>
    h('div.s15__core-node', { style: { '--i': String(i) } },
      icons[c.icon]({ size: 34, className: 's15__core-icon' }),
      h('span', c.title)
    )
  );

  const gov = Governing(meta.governing, { size: 'lg', center: true });
  gov.classList.add('s15__gov');

  const merged = h('div.s15__merged',
    h('div.s15__core',
      ...coreEls.flatMap((n, i) => (i > 0 ? [h('span.s15__core-plus', '+'), n] : [n]))
    ),
    gov
  );

  const el = ScreenRoot(meta, { header: false, className: 's15' },
    header,
    h('div.s15__split', uni, h('div.s15__seam'), hos),
    merged
  );

  return {
    el,
    enter(sch) {
      // 진입 시점에는 아직 PART 1 — 클릭으로 PART 2 로 넘어간다
      document.body.dataset.part = 'CBT';
      sch.at(0, () => header.classList.add('is-in'));
      sch.at(500, () => uni.classList.add('is-in'));
      sch.at(700, () => hos.classList.add('is-in'));
      sch.stagger(
        Array.from(el.querySelectorAll('.s15__item')),
        (li) => li.classList.add('is-in'),
        { start: 1100, gap: 130 }
      );
      sch.at(2200, () => {
        uni.querySelector('.s15__panel-result').classList.add('is-in');
        hos.querySelector('.s15__panel-result').classList.add('is-in');
      });
    },
    steps: [
      // 클릭 1회: 패널 수렴 모핑(1.2s) + 공통 구조 등장 + 배경 톤 전환 + PART 교체
      (sch) => {
        el.classList.add('is-merging');
        document.body.dataset.part = 'VDI';
        sch.at(1200, () => el.classList.add('is-merged'));
        sch.stagger(coreEls, (n) => n.classList.add('is-in'), { start: 1350, gap: 200 });
        sch.at(2100, () => gov.classList.add('is-in'));
      },
    ],
  };
}
