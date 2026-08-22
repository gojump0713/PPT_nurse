/**
 * SCREEN 04 — 시뮬레이션 실습 원리의 시험 적용
 * 두 트랙이 "동시에" 진행되어야 유추가 성립한다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, Track } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(4);

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const clinical = Track('임상 교육', ['교육', '실습', '시뮬레이션', '반복', '임상']);
  const exam = Track('시험 준비', ['학습', 'CBT 체험', '과목시험', '모의시험', '국가시험']);

  clinical.classList.add('s04__track', 's04__track--clinical');
  exam.classList.add('s04__track', 's04__track--exam');

  // 각 트랙 마지막 노드 아이콘 — 임상(청진기) / 국가시험(모니터)
  clinical.nodeEls[4].prepend(icons.stethoscope({ size: 30, className: 's04__node-icon' }));
  exam.nodeEls[4].prepend(icons.monitor({ size: 30, className: 's04__node-icon' }));

  const principle = rv('scale', 'div.s04__principle',
    h('span.s04__principle-line'),
    h('p.s04__principle-text', '실전에서 처음 경험하지 않도록, ', h('em', '사전에 반복한다')),
    h('span.s04__principle-line')
  );

  const el = ScreenRoot(meta, { className: 's04' },
    gov,
    h('div.s04__body', clinical, principle, exam)
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      // 두 트랙 동시 진행 — 나란히 움직여야 같은 원리임이 말 없이 전달된다
      const end = Math.max(
        clinical.play(sch, { start: 900, gap: 600 }),
        exam.play(sch, { start: 900, gap: 600 })
      );
      sch.at(end + 300, () => principle.classList.add('is-in'));
    },
    steps: [],
  };
}
