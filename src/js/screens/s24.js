/**
 * SCREEN 24 (클로징) — 학생 · 의료진 디지털 환경 제안
 * S01 의 2028 단독 오프닝과 수미상관. 양 트랙 동시 완성 → 틸론 수렴 → CTA.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { CTA } from '../components/index.js';

const meta = metaOf(24);

const LEFT = { org: '영남이공대학교', nodes: ['학생', '반복 CBT', '데이터 기반 학습', '2028 국가시험 대응'] };
const RIGHT = { org: '영남대학교병원', nodes: ['의료진', '안전한 VDI', '의료정보 보호', '업무 연속성'] };

export function create() {
  const makeTrack = (spec, side) => {
    const nodeEls = spec.nodes.map((t, i) =>
      h(`div.s24__node${i === spec.nodes.length - 1 ? '.is-last' : ''}`, t)
    );
    const track = h(`div.s24__track.s24__track--${side}`,
      h('div.s24__org', spec.org),
      h('div.s24__nodes',
        ...nodeEls.flatMap((n, i) => (i > 0 ? [h('span.s24__node-arrow', '→'), n] : [n]))
      )
    );
    track.nodeEls = nodeEls;
    return track;
  };

  const left = makeTrack(LEFT, 'l');
  const right = makeTrack(RIGHT, 'r');

  const logo = h('div.s24__logo',
    h('img', { src: 'assets/images/brand/tilon-ci.png', alt: 'TILON' })
  );

  const converge = h('svg.s24__converge', { viewBox: '0 0 1680 200', preserveAspectRatio: 'none' },
    h('path.s24__cline', { d: 'M120,20 C 480,20 620,150 840,150', fill: 'none' }),
    h('path.s24__cline', { d: 'M1560,20 C 1200,20 1060,150 840,150', fill: 'none' })
  );

  const msg1 = rv('up', 'p.s24__msg',
    '학생에게는, 국가시험에서 처음 만나는 CBT가 아니라 ',
    h('em', '이미 익숙한 시험환경'), '을.'
  );
  const msg2 = rv('up', 'p.s24__msg',
    '의료진에게는, 보안 때문에 불편한 환경이 아니라 ',
    h('em', '보안되어 있기에 자유로운 업무환경'), '을.'
  );

  const ending = rv('up', 'div.s24__ending',
    h('span.s24__ending-lead', 'Digital & AI Transformation'),
    h('span.s24__ending-main', '일하고 배우는 방식을 바꿉니다.'),
    h('span.s24__ending-brand', 'TILON')
  );

  const ctas = h('div.s24__ctas',
    CTA('보건계열 CBT 데모 신청', { solid: true }),
    CTA('병원 전산부서 기술 미팅')
  );

  const el = ScreenRoot(meta, { header: false, className: 's24' },
    h('div.s24__tracks', left, converge, right, logo),
    h('div.s24__msgs', msg1, msg2),
    ending,
    ctas
  );

  return {
    el,
    enter(sch) {
      document.body.dataset.part = 'TILON';
      // ① 좌우 트랙 노드 동시 진행
      sch.at(300, () => {
        left.classList.add('is-in');
        right.classList.add('is-in');
      });
      const gap = 420;
      for (let i = 0; i < LEFT.nodes.length; i += 1) {
        sch.at(700 + gap * i, () => {
          left.nodeEls[i].classList.add('is-lit');
          right.nodeEls[i].classList.add('is-lit');
        });
      }
      // ② 중앙 수렴선 드로잉 + 로고 등장
      const after = 700 + gap * LEFT.nodes.length;
      sch.at(after, () => el.classList.add('is-converged'));
      sch.at(after + 900, () => logo.classList.add('is-in'));
      // ③ 최종 메시지 2행 → 엔딩 타이포 → CTA
      sch.at(after + 1500, () => msg1.classList.add('is-in'));
      sch.at(after + 2000, () => msg2.classList.add('is-in'));
      sch.at(after + 2700, () => ending.classList.add('is-in'));
      sch.at(after + 3300, () => {
        ctas.classList.add('is-in');
        Array.from(ctas.children).forEach((c, i) =>
          sch.at(i * 160, () => c.classList.add('is-in'))
        );
      });
    },
    steps: [],
  };
}
