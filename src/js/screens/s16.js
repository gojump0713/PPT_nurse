/**
 * SCREEN 16 — 이동하는 진료, 상주하는 데이터
 * 1막: 데이터가 단말과 함께 따라다닌다 → 2막(자동): 데이터는 중앙에 고정되고 화면만 동행.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(16);

const ROOMS = [
  { name: '진료실', icon: 'stethoscope', x: 60, y: 46, w: 200, h: 150 },
  { name: '병동', icon: 'bed', x: 300, y: 30, w: 250, h: 165 },
  { name: '검사실', icon: 'flask', x: 590, y: 46, w: 200, h: 150 },
  { name: '회의실', icon: 'users', x: 330, y: 250, w: 230, h: 150 },
  { name: '연구실', icon: 'brain', x: 620, y: 250, w: 230, h: 150 },
];

const DATA = ['EMR', 'PACS', 'OCS', '의료영상', '개인정보', '연구정보'];

const ROUTE =
  'M160,150 C 230,215 300,205 425,140 C 520,210 590,205 690,150 ' +
  'C 620,265 540,300 445,325 C 580,362 660,350 735,325';

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const roomEls = ROOMS.map((r) =>
    h('div.s16__room', { style: { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` } },
      icons[r.icon]({ size: 34, className: 's16__room-icon' }),
      h('span.s16__room-name', r.name)
    )
  );

  const trailTags = DATA.map((t, i) =>
    h('span.s16__trail-tag', { style: { '--d': `${i * 0.11}s` } }, t)
  );

  const doctor = h('div.s16__doctor',
    h('div.s16__doctor-pin', icons.users({ size: 22 })),
    h('div.s16__doctor-trail', ...trailTags),
    h('div.s16__doctor-screen', icons.monitor({ size: 16 }), '화면')
  );

  const routeSvg = h('svg.s16__route', { viewBox: '0 0 900 440', preserveAspectRatio: 'none' },
    h('path.s16__route-ghost', { d: ROUTE, fill: 'none' }),
    h('path.s16__route-line', { d: ROUTE, fill: 'none' })
  );

  // 동선 애니메이션은 CSS motion path 로 처리 — 경로 문자열은 한 곳에서만 정의한다
  doctor.style.offsetPath = `path('${ROUTE}')`;
  doctor.style.offsetRotate = '0deg';

  const plan = h('div.s16__plan', routeSvg, ...roomEls, doctor);

  const dockTags = DATA.map((t, i) =>
    h('span.s16__dock-tag', { style: { '--i': String(i) } }, t)
  );
  const dock = h('div.s16__dock',
    h('div.s16__dock-server',
      icons.server({ size: 34, className: 's16__dock-icon' }),
      h('div',
        h('div.s16__dock-title', '중앙 서버'),
        h('div.s16__dock-sub', '민감정보 6종 상주')
      )
    ),
    h('div.s16__dock-tags', ...dockTags)
  );

  const acts = h('div.s16__acts',
    h('div.s16__act.is-a1', h('b', '1막'), '데이터가 단말과 함께 따라다닌다'),
    h('div.s16__act.is-a2', h('b', '2막'), '데이터는 중앙에, 의료진에게는 화면만')
  );

  const el = ScreenRoot(meta, { className: 's16' },
    h('div.s16__top', gov, acts),
    h('div.s16__body', rv('up', 'div.s16__planwrap', plan), dock)
  );

  const planwrap = el.querySelector('.s16__planwrap');

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => planwrap.classList.add('is-in'));
      sch.stagger(roomEls, (r) => r.classList.add('is-in'), { start: 900, gap: 130 });
      // 1막 시작 — 의료진 이동 + 데이터 꼬리 잔상
      sch.at(1600, () => el.classList.add('is-act1'));
      // 2막(자동) — 데이터 회수 → 중앙 고정 → 화면만 동행
      sch.at(1600 + 6000, () => el.classList.add('is-act2'));
      sch.stagger(dockTags, (t) => t.classList.add('is-in'), { start: 8000, gap: 130 });
    },
    steps: [],
  };
}
