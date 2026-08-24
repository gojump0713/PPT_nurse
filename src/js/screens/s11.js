/**
 * SCREEN 11 — 개인 문항의 대학 교육자산화
 * "흩어짐 → 수렴 → 축적"의 모션이 자산화 개념을 언어 없이 전달한다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, SourceFooter } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(11);

/** 좌측에 흩어진 파일들 — 목적지(저장소)까지의 이동량을 각자 갖는다 */
const FILES = [
  { type: 'HWP', t: 4, l: 6, rot: -8 },
  { type: 'XLS', t: 30, l: 44, rot: 6 },
  { type: 'HWP', t: 58, l: 12, rot: 4 },
  { type: 'HWP', t: 18, l: 62, rot: -5 },
  { type: 'XLS', t: 72, l: 52, rot: 9 },
  { type: 'HWP', t: 44, l: 26, rot: -3 },
  { type: 'XLS', t: 6, l: 34, rot: 11 },
  { type: 'HWP', t: 82, l: 28, rot: -7 },
];

const CHAIN = ['교수 PC', 'HWP / Excel', '시험', '개인 보관'];
const FLOW = ['문제은행', '과목별 축적', '재활용', '결과 축적', '문항 개선'];
const EXPAND = ['간호학과', '보건계열', '자격시험 학과', '대학 전체'];
const BARS = [8, 14, 23, 31, 44, 56, 71, 84, 96, 112];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const fileEls = FILES.map((f) =>
    h(`div.s11__file.is-${f.type.toLowerCase()}`, {
      style: { top: `${f.t}%`, left: `${f.l}%`, '--rot': `${f.rot}deg` },
    }, f.type)
  );

  const left = h('div.s11__left',
    h('div.s11__panel-head', h('span.s11__badge', '현재'), '문항이 있는 곳'),
    h('div.s11__scatter',
      ...fileEls,
      h('div.s11__empty', h('span', '담당 교수가 바뀌면'), h('strong', '남는 자산이 없습니다'))
    ),
    h('div.s11__chain',
      ...CHAIN.flatMap((c, i) => [
        i > 0 ? h('span.s11__chain-arrow', '→') : null,
        h('span.s11__chain-node', c),
      ].filter(Boolean))
    ),
    h('div.s11__warn', icons.alert({ size: 20 }), '퇴직 · 이직 시 유실')
  );

  const barEls = BARS.map((v, i) =>
    h('span.s11__bar', { style: { '--h': `${(v / 112) * 100}%` } }, h('i', `${i + 1}`))
  );

  const right = h('div.s11__right',
    h('div.s11__panel-head', h('span.s11__badge.is-accent', '전환'), '대학의 평가자산'),
    h('div.s11__vault',
      icons.server({ size: 46, className: 's11__vault-icon' }),
      h('div.s11__vault-title', '문제은행'),
      h('div.s11__vault-sub', '문항 + 응시 데이터')
    ),
    h('div.s11__flow',
      ...FLOW.flatMap((c, i) => [
        i > 0 ? h('span.s11__flow-arrow', '→') : null,
        h('span.s11__flow-node', c),
      ].filter(Boolean))
    ),
    h('div.s11__graph',
      h('div.s11__graph-head', h('span', '데이터로 검증된 문항 수'), h('span.s11__graph-x', '시험 회차 1 → 10')),
      h('div.s11__bars', ...barEls)
    )
  );

  const expand = h('div.s11__expand',
    ...EXPAND.flatMap((c, i) => [
      i > 0 ? h('span.s11__expand-arrow', '→') : null,
      h('span.s11__expand-node', c),
    ].filter(Boolean))
  );

  const foot = SourceFooter('시험이 끝나도 문제와 데이터는 대학에 남아야 합니다');

  const closing = h('div.s11__closing',
    h('strong.s11__closing-key', '문제은행'),
    ' - 문항이 과목별로 쌓이고, 재활용되고, 응시 결과 쌓이면서 좋은 문항을 데이터로 검증, 쓸수록 좋아지는 대학의 평가자산으로 축적'
  );

  const el = ScreenRoot(meta, { className: 's11' },
    gov,
    h('div.s11__body', left, h('div.s11__bridge', h('span.s11__bridge-line')), right),
    expand,
    foot,
    closing
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => left.classList.add('is-in'));
      sch.stagger(fileEls, (f) => f.classList.add('is-in'), { start: 900, gap: 90 });
      sch.at(1900, () => right.classList.add('is-in'));
      // 파일들이 저장소로 빨려들어간다
      sch.at(2300, () => el.classList.add('is-converging'));
      // 그래프가 계단식으로 상승
      sch.stagger(barEls, (b) => b.classList.add('is-in'), { start: 2900, gap: 110 });
      sch.stagger(
        Array.from(expand.querySelectorAll('.s11__expand-node')),
        (n) => n.classList.add('is-lit'),
        { start: 4200, gap: 300 }
      );
      sch.at(4200, () => expand.classList.add('is-in'));
      sch.at(5600, () => foot.classList.add('is-in'));
      sch.at(5900, () => closing.classList.add('is-in'));
    },
    steps: [],
  };
}
