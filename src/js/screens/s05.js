/**
 * SCREEN 05 — 재학 4년 전체의 CBT 상시화
 * Progress 채움 + 역산 배지로 "지금"이라는 결론을 만든다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, Timeline, SourceFooter } from '../components/index.js';

const meta = metaOf(5);

const NODES = [
  { label: '1학년', desc: 'CBT 체험 · 기초과목 평가' },
  { label: '2학년', desc: '중간 · 기말 CBT 전환' },
  { label: '3학년', desc: '통합형 · 반복 모의 CBT' },
  { label: '4학년', desc: '2교시 95분 실전 모의' },
  { label: '국가시험', desc: '이미 익숙한 환경', goal: true },
];

export function create() {
  const gov = Governing(meta.governing, { size: 'sm' });

  const tl = Timeline(NODES, { axis: 46 });
  tl.classList.add('s05__tl');

  const badge = rv('left', 'div.s05__badge',
    h('span.s05__badge-label', '역산'),
    h('span.s05__badge-body',
      h('strong', '2028'), ' 응시',
      h('span.s05__badge-arrow', '←'),
      '준비 시작 ', h('strong.is-now', '2026')
    )
  );

  const foot = SourceFooter(
    '2028년 응시생 기준으로 역산해 보면, 이 설계의 시작점은 2026년, 바로 지금입니다.'
  );

  const el = ScreenRoot(meta, { className: 's05' },
    h('div.s05__top', gov, badge),
    h('div.s05__body', tl),
    foot
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      const end = tl.play(sch, { start: 900, gap: 800 });
      // 역산 배지가 마지막에 등장 + 펄스 1회 → "지금"이라는 결론
      sch.at(end + 200, () => {
        badge.classList.add('is-in');
        badge.classList.add('is-pulse');
      });
      sch.at(end + 1600, () => badge.classList.remove('is-pulse'));
      sch.at(end + 700, () => foot.classList.add('is-in'));
    },
    steps: [],
  };
}
