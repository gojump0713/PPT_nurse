/**
 * SCREEN 07 — 시험 운영 9단계 → 6단계 전환
 * 9단계가 쌓이는 잔상 후 접히는 물리적 압축이 "업무가 줄어든다"의 체감.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, ProcessBand, SourceFooter, BigNumber } from '../components/index.js';

const meta = metaOf(7);

const PBT = ['문항작성', '편집', '출력', '분류', '배포', '회수', '채점', '성적입력', '보관'];
const CBT = ['문제은행', '시험구성', '배포', '응시', '자동채점', '분석'];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const numFrom = BigNumber(9, { size: 'md', reveal: false });
  // 클릭 전에는 감춰져 있다가, 9에서 6으로 카운트다운 모핑하며 등장
  const numTo = BigNumber(9, { size: 'md', reveal: false, accent: true });
  const numBlock = rv('up', 'div.s07__nums',
    h('div.s07__num-item', numFrom, h('span.s07__num-cap', '단계')),
    h('div.s07__num-arrow', '→'),
    h('div.s07__num-item.s07__num-item--to', numTo, h('span.s07__num-cap', '단계'))
  );

  const pbtBand = ProcessBand(PBT, { accent: false });
  const cbtBand = ProcessBand(CBT, { accent: true });
  cbtBand.classList.add('s07__band-cbt');

  const pbtRow = h('div.s07__row',
    h('div.s07__row-label', h('span.s07__tagline', '현행 PBT'), '지필시험 운영'),
    pbtBand
  );
  const cbtRow = h('div.s07__row.s07__row--cbt',
    h('div.s07__row-label', h('span.s07__tagline.is-accent', '2028 CBT'), '문제은행 기반 운영'),
    cbtBand
  );

  const foot = SourceFooter('초기 인프라 투자 필요 · 절감은 반복 운영에서 누적');

  const el = ScreenRoot(meta, { className: 's07' },
    gov,
    h('div.s07__body', numBlock, h('div.s07__bands', pbtRow, cbtRow)),
    foot
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(800, () => numBlock.classList.add('is-in'));
      // 9단계가 한 칸씩 빠르게 쌓이며 "많음"을 체감시킨다
      pbtBand.play(sch, { start: 950, gap: 200 });
      sch.at(3200, () => foot.classList.add('is-in'));
    },
    steps: [
      // 클릭 1회: 9단계 띠 아코디언 압축 + 6단계 전개 + 숫자 모핑
      (sch) => {
        el.classList.add('is-folded');
        pbtBand.collapse();
        sch.at(300, () => {
          cbtRow.classList.add('is-in');
          cbtBand.play(sch, { start: 0, gap: 130 });
        });
        sch.at(420, () => numTo.morphTo(sch, 6, { from: 9, duration: 800 }));
      },
    ],
  };
}
