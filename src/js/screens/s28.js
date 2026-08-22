/**
 * SCREEN 28 (PART 전환 · 브리지 ②) — CBT · VDI 공통 기반 구조
 * 떠 있던 가치들이 기반 위에 안착하는 모션이 이 페이지의 논지 그 자체.
 * S15 와 대구를 이루는 극적 연출 지점.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(28);

const USERS = [
  { role: '학생', value: '공정하고 안전한 디지털 평가환경', icon: 'users', part: 'CBT' },
  { role: '교수', value: '데이터 기반 교육 · 평가환경', icon: 'chart', part: 'CBT' },
  { role: '의료진', value: '안전하고 연속적인 업무환경', icon: 'stethoscope', part: 'VDI' },
  { role: 'IT 관리자', value: '중앙 통제 표준화 환경', icon: 'gear', part: 'VDI' },
];

const BASE = ['Virtualization', 'Cloud', 'Security', 'AI'];

export function create() {
  /* PART 인디케이터: PART 2 → PART 3 */
  const header = rv('down', 'header.hdr.s28__hdr',
    h('h1.hdr__title', meta.title),
    h('div.s28__parts',
      h('span.s28__part.is-from', h('b', 'PART 2'), 'VDI'),
      h('span.s28__part-arrow', '→'),
      h('span.s28__part.is-to', h('b', 'PART 3'), 'TILON')
    )
  );

  const cards = USERS.map((u, i) =>
    h('div.s28__card', { dataset: { i: String(i), part: u.part } },
      icons[u.icon]({ size: 36, className: 's28__card-icon' }),
      h('div.s28__card-role', u.role),
      h('div.s28__card-value', u.value)
    )
  );

  const keyEls = BASE.map((b) => h('span.s28__key', b));
  const plate = h('div.s28__plate',
    h('div.s28__plate-inner', ...keyEls.flatMap((k, i) => (i > 0 ? [h('span.s28__plus', '+'), k] : [k]))),
    h('div.s28__plate-label', 'TILON Technology Base')
  );

  const gov = Governing(meta.governing, { size: 'sm', center: true });

  const el = ScreenRoot(meta, { header: false, className: 's28' },
    header,
    h('div.s28__body',
      h('div.s28__cards', ...cards),
      plate,
      gov
    )
  );

  return {
    el,
    enter(sch) {
      document.body.dataset.part = 'VDI';
      sch.at(0, () => header.classList.add('is-in'));
      // ① 카드 4장 순차 등장 (공중에 떠 있는 상태)
      sch.stagger(cards, (c) => c.classList.add('is-in'), { start: 500, gap: 220 });
      // ② 자동(2s 후): 하강 정렬 + 플레이트 점등 (1.2s 모션) + 배경 톤 PART 3 전환
      sch.at(2400, () => {
        el.classList.add('is-landing');
        document.body.dataset.part = 'TILON';
      });
      sch.at(3200, () => plate.classList.add('is-lit'));
      sch.stagger(keyEls, (k) => k.classList.add('is-in'), { start: 3400, gap: 200 });
      sch.at(4400, () => gov.classList.add('is-in'));
    },
    steps: [],
  };
}
