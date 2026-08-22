/**
 * SCREEN 17 — 데이터 중앙화 VDI 업무환경
 * 분실 시나리오는 VDI를 체감시키는 가장 짧은 이야기. 발표자가 터뜨린다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(17);

const PATH = [
  { title: '사용자 단말', sub: 'PC · 노트북 · 씬클라이언트', icon: 'laptop' },
  { title: '인증', sub: '사용자 · 단말 · 정책', icon: 'lock' },
  { title: '가상 업무환경', sub: '표준 데스크톱 이미지', icon: 'cloud' },
  { title: 'EMR · PACS · 업무시스템', sub: '데이터는 중앙에만', icon: 'server' },
];

const EFFECTS = [
  '데이터 중앙관리', '단말 저장 최소화', '접근통제', '표준 업무환경',
  'SW · 패치 중앙관리', '장애대응', '업무연속성',
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const stepEls = PATH.map((p, i) =>
    h('div.s17__step', { dataset: { i: String(i) } },
      h('span.s17__step-no', String(i + 1).padStart(2, '0')),
      icons[p.icon]({ size: 40, className: 's17__step-icon' }),
      h('div.s17__step-title', p.title),
      h('div.s17__step-sub', p.sub),
      i === 0 ? h('div.s17__lost', h('span.s17__lost-x', '✕'), h('span', '분실')) : null
    )
  );

  const links = [0, 1, 2].map(() => h('div.s17__link', h('span')));
  const chain = h('div.s17__chain',
    ...stepEls.flatMap((s, i) => (i > 0 ? [links[i - 1], s] : [s]))
  );

  const effectEls = EFFECTS.map((t, i) =>
    h('div.s17__effect', h('span.s17__effect-no', String(i + 1)), t)
  );
  const effects = h('div.s17__effects', ...effectEls);

  const verdict = h('div.s17__verdict',
    icons.shieldCheck({ size: 34, className: 's17__verdict-icon' }),
    h('div',
      h('div.s17__verdict-title', '단말 분실 — 유출될 데이터 없음'),
      h('div.s17__verdict-sub', '문서 · 영상 · 환자정보는 단말이 아니라 중앙에 있습니다')
    )
  );

  const el = ScreenRoot(meta, { className: 's17' },
    gov,
    rv('up', 'div.s17__body', chain, verdict),
    effects
  );

  const body = el.querySelector('.s17__body');

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => body.classList.add('is-in'));
      // 4단계 순차 점등 (0.5s 간격)
      stepEls.forEach((s, i) => {
        sch.at(1000 + i * 500, () => {
          s.classList.add('is-lit');
          if (i > 0) links[i - 1].classList.add('is-lit');
        });
      });
      // 효과 7개 태그 등장
      sch.stagger(effectEls, (e) => e.classList.add('is-in'), { start: 3100, gap: 120 });
    },
    steps: [
      // 클릭 1회: 단말 분실 시나리오 재생 (2s)
      (sch) => {
        el.classList.add('is-lost');
        sch.at(1200, () => el.classList.add('is-safe'));
      },
    ],
  };
}
