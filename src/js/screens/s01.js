/**
 * SCREEN 01 — 2028년 간호사 국시 CBT 전환
 * 타이포그래피 온리. 연도 → 사실 → 질문의 3박자.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { BigNumber, Governing, SourceFooter } from '../components/index.js';

const meta = metaOf(1);

export function create() {
  const num = BigNumber('2028', { reveal: false, gradient: true });
  const numWrap = h('div.s01__num', num);

  const sub = rv('up', 'p.s01__sub', '제68회 간호사 국가시험 · CBT 전환');
  const gov = Governing(meta.governing, { size: 'lg', center: true });
  const lines = h('div.s01__lines', sub, gov);

  const ask = rv('up', 'p.s01__ask',
    h('span.s01__ask-q', 'Q.'),
    '우리 학생들은 국가시험 전에 CBT를 몇 번 경험하게 됩니까?'
  );

  const foot = SourceFooter([
    h('span.s01__foot-line', '한국보건의료인국가시험원, 2025년 11월 17일 발표'),
    h('span.s01__foot-line', '간호법 시행규칙 부칙, 2028년 1월 1일 이후 시험부터 새 과목체계 적용 명시'),
  ]);

  const stage = h('div.s01__stage', numWrap, lines, ask);
  const el = ScreenRoot(meta, { header: false, className: 's01' }, stage, foot);

  return {
    el,
    enter(sch) {
      // ① 어두운 배경에서 2028 페이드인 (1.2s)
      sch.at(60, () => numWrap.classList.add('is-in'));
      // ② 자동: 서브 텍스트  ③ 자동: 거버닝 메시지
      sch.at(1800, () => sub.classList.add('is-in'));
      sch.at(2800, () => gov.classList.add('is-in'));
      sch.at(3400, () => foot.classList.add('is-in'));
    },
    steps: [
      // ④ 클릭 1회: 2028 축소·좌상단 이동 + 핵심 질문 등장
      (sch) => {
        el.classList.add('is-asked');
        sch.at(520, () => ask.classList.add('is-in'));
      },
    ],
  };
}
