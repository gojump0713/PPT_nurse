/**
 * SCREEN 31 — 영남대병원 우선 적용업무 선정
 * 판매가 아닌 진단 제안. "영역 → 구체 업무" 전개가 진단 프로세스의 미리보기.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, CTA } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(31);

const AREAS = [
  {
    key: '의료진', icon: 'stethoscope',
    items: ['병동 · 진료실 동일 환경', 'PACS · EMR 활용', '협진', '당직', '승인된 외부 업무'],
  },
  {
    key: '연구', icon: 'flask',
    items: ['민감데이터 격리', '임상 연구환경', '외부 연구자 협업', '반출 최소화'],
  },
  {
    key: '행정', icon: 'doc',
    items: ['개인정보 처리', '인터넷 · 업무망 분리', '출장 · 재택'],
  },
  {
    key: 'IT', icon: 'gear',
    items: ['표준 이미지', 'SW · 패치 중앙관리', '정책관리', '단말관리', '환경 재배포'],
  },
];

const TOTAL = AREAS.reduce((n, a) => n + a.items.length, 0); // 17

export function create() {
  const gov = Governing(meta.governing, { size: 'sm' });

  const cards = AREAS.map((a) => {
    const itemEls = a.items.map((t) =>
      h('li.s31__item', h('span.s31__check', '✓'), t)
    );
    const card = rv('up', 'div.s31__card',
      h('div.s31__card-head',
        icons[a.icon]({ size: 34, className: 's31__icon' }),
        h('span.s31__card-title', a.key),
        h('span.s31__card-count', `${a.items.length}`)
      ),
      h('ul.s31__items', ...itemEls)
    );
    card.itemEls = itemEls;
    return card;
  });

  const grid = h('div.s31__grid', ...cards);

  const counter = h('div.s31__counter',
    h('span.s31__counter-n', '4'), '개 영역 · 후보 업무 ',
    h('span.s31__counter-n', String(TOTAL)), '개'
  );

  const cta = CTA('우선순위 진단 미팅 — 전산부서와 함께', { solid: false });
  const ctaBar = h('div.s31__cta', cta);

  const el = ScreenRoot(meta, { className: 's31' },
    h('div.s31__top', gov, counter),
    grid,
    ctaBar
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.stagger(cards, (c) => c.classList.add('is-in'), { start: 800, gap: 140 });
      sch.at(1400, () => counter.classList.add('is-in'));
    },
    steps: [
      // 클릭 1회: 4장 동시 전개 + 체크리스트 순차 체크 → CTA 슬라이드업
      (sch) => {
        el.classList.add('is-expanded');
        cards.forEach((c) => {
          sch.stagger(c.itemEls, (i) => i.classList.add('is-in'), { start: 260, gap: 110 });
        });
        sch.at(1500, () => {
          ctaBar.classList.add('is-in');
          cta.classList.add('is-in');
        });
      },
    ],
  };
}
