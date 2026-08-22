/**
 * SCREEN 09 — 응시 결과의 학습데이터 전환
 * "같은 숫자 → 다른 얼굴"의 반전. 반전 타이밍은 발표자가 쥔다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, SourceFooter } from '../components/index.js';
import { Radar } from '../components/radar.js';
import { countTo } from '../lib/anim.js';

const meta = metaOf(9);

/** 축 순서: 약물계산 · 감염관리 · 성인간호 · 법규 · 시간관리 */
const STUDENTS = [
  { name: '학생 A', weak: '약물계산 취약', values: [30, 82, 78, 74, 80] },
  { name: '학생 B', weak: '감염관리 취약', values: [78, 27, 80, 76, 78] },
  { name: '학생 C', weak: '문항유형 취약', values: [74, 76, 40, 72, 66] },
  { name: '학생 D', weak: '시간관리 문제', values: [76, 74, 79, 73, 29] },
];

const AXES = ['학생별', '과목별', '단원별', '문항별', '회차별'];
const CYCLE = ['시험', '분석', '취약영역', '맞춤학습', '재평가'];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const cards = STUDENTS.map((s) => {
    const numEl = h('span.s09__num', '0');
    const radar = Radar(s.values, { size: 240 });
    const card = rv('up', 'div.s09__card',
      h('div.flip__inner',
        h('div.flip__face.flip__face--front',
          h('div.s09__front', numEl, h('span.s09__unit', '점')),
          h('div.s09__name', s.name)
        ),
        h('div.flip__face.flip__face--back',
          h('div.s09__name', s.name),
          h('div.s09__weak', s.weak),
          radar
        )
      )
    );
    card.numEl = numEl;
    card.radar = radar;
    return card;
  });

  const grid = h('div.s09__grid', ...cards);

  const axisBand = h('div.s09__axes',
    h('span.s09__axes-label', '데이터 축'),
    ...AXES.map((a) => h('span.s09__axis', a))
  );

  const cycle = h('div.s09__cycle',
    ...CYCLE.flatMap((c, i) => [
      i > 0 ? h('span.s09__cycle-arrow', '→') : null,
      h('span.s09__cycle-node', c),
    ].filter(Boolean)),
    h('span.s09__cycle-loop', '↺')
  );

  const foot = SourceFooter('※ 예시 데이터 — 실제 응시 결과가 아닌 설명용 프로필입니다');

  const el = ScreenRoot(meta, { className: 's09' },
    gov,
    grid,
    h('div.s09__bottom', axisBand, cycle),
    foot
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      // 70 4개 동시 카운트업
      sch.at(820, () => {
        cards.forEach((c) => {
          c.classList.add('is-in');
          countTo(sch, c.numEl, { from: 0, to: 70, duration: 1200, format: (v) => String(Math.round(v)) });
        });
      });
      sch.at(2300, () => foot.classList.add('is-in'));
    },
    steps: [
      // 클릭 1회: 4장 동시 플립 → 레이더 드로잉 → 하단 데이터 축·순환 등장
      (sch) => {
        cards.forEach((c, i) => {
          sch.at(i * 90, () => c.classList.add('is-flipped'));
          sch.at(500 + i * 90, () => c.radar.draw());
        });
        sch.at(1100, () => el.classList.add('is-revealed'));
      },
    ],
  };
}
