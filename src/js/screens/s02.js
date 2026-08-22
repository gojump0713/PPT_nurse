/**
 * SCREEN 02 — 8과목 295문항 → 2과목 200문항
 * 현행 PBT 를 먼저 보여주고, 클릭 시 숫자 모핑 + CBT 점등 + 행동 띠.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, SourceFooter } from '../components/index.js';
import { countTo } from '../lib/anim.js';

const meta = metaOf(2);

const ROWS = [
  { key: '과목', from: 8, to: 2, unit: '과목' },
  { key: '문항', from: 295, to: 200, unit: '문항' },
  { key: '교시', from: 3, to: 2, unit: '교시', extra: '각 95분' },
];

function Row(spec) {
  const fromEl = h('span.s02__n', String(spec.from));
  const toEl = h('span.s02__n.s02__n--to', String(spec.from));
  const extra = spec.extra ? h('span.s02__extra', spec.extra) : null;
  const row = rv('up', 'div.s02__row',
    h('div.s02__key', spec.key),
    h('div.s02__cell.s02__cell--before', fromEl, h('span.s02__unit', spec.unit)),
    h('div.s02__mid', h('span.s02__arrow', '→')),
    h('div.s02__cell.s02__cell--after', toEl, h('span.s02__unit', spec.unit), extra)
  );
  row.toEl = toEl;
  row.extraEl = extra;
  row.spec = spec;
  return row;
}

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const rows = ROWS.map(Row);

  const headBefore = rv('up', 'div.s02__head.s02__head--before', h('span.s02__head-dot'), '현행 PBT');
  const headAfter = rv('up', 'div.s02__head.s02__head--after', h('span.s02__head-dot'), '2028 CBT');

  const table = h('div.s02__table',
    h('div.s02__heads', h('div'), headBefore, h('div'), headAfter),
    ...rows
  );

  const aside = rv('up', 'div.s02__aside',
    h('div.s02__aside-item', h('strong', '간호학총론'), ' 7분야 47영역'),
    h('div.s02__aside-item', h('strong', '보건의약관계법규'), ' 13개 법 19영역 · ', h('em', '간호법 신설'))
  );

  const behavior = h('div.s02__behavior',
    h('div.s02__bh.s02__bh--before',
      h('span.s02__bh-label', '응시 행동'),
      h('span.s02__bh-text', '문제지 · 마킹 · 정해진 순서')
    ),
    h('div.s02__bh-arrow', '→'),
    h('div.s02__bh.s02__bh--after',
      h('span.s02__bh-label', '응시 행동'),
      h('span.s02__bh-text', '화면 판독 · 문항 이동 · 답안 수정 · 시간 관리')
    )
  );

  const el = ScreenRoot(meta, { className: 's02' },
    gov,
    table,
    aside,
    behavior
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(800, () => headBefore.classList.add('is-in'));
      sch.stagger(rows, (r) => r.classList.add('is-in'), { start: 950, gap: 150 });
    },
    steps: [
      // 클릭 1회: 숫자 모핑 + CBT 컬럼 점등 + 행동 띠 슬라이드인
      (sch) => {
        el.classList.add('is-after');
        headAfter.classList.add('is-in');
        rows.forEach((row, i) => {
          sch.at(120 + i * 160, () => {
            row.classList.add('is-morph');
            countTo(sch, row.toEl, {
              from: row.spec.from,
              to: row.spec.to,
              duration: 900,
              format: (v) => String(Math.round(v)),
            });
            if (row.extraEl) sch.at(500, () => row.extraEl.classList.add('is-in'));
          });
        });
        sch.at(700, () => aside.classList.add('is-in'));
        sch.at(900, () => behavior.classList.add('is-in'));
      },
    ],
  };
}
