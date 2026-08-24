/**
 * SCREEN 12 — 시험 시스템과 시험환경의 분리
 * 불안한 상태를 먼저 보여주고, 해결을 발표자가 터뜨린다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, BgVideo } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(12);

const L1 = ['문제은행', '출제', '응시', '채점', '분석'];
const L2 = ['PC 표준화', '인터넷 통제', '프로그램 통제', '사용자 인증', '중앙관리', '장애대응'];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const layer1 = rv('down', 'div.s12__layer.s12__layer--1',
    h('div.s12__layer-head',
      h('span.s12__layer-no', 'LAYER 1'),
      h('span.s12__layer-title', 'CBT System'),
      h('span.s12__layer-note', '어느 CBT 프로그램이든 제공하는 영역')
    ),
    h('div.s12__chips', ...L1.map((t) => h('span.s12__chip', t)))
  );

  const warnEls = [0, 1, 2].map((i) =>
    h('div.s12__warn', { style: { left: `${18 + i * 32}%` } },
      icons.alert({ size: 26 }),
      h('span', ['시험 중 단말 장애', '우회 · 부정 가능성', '환경 편차'][i])
    )
  );
  const gap = h('div.s12__gap', h('div.s12__crack'), ...warnEls);

  const l2chips = L2.map((t) => h('span.s12__chip.s12__chip--2', t));
  const layer2 = h('div.s12__layer.s12__layer--2',
    h('div.s12__layer-head',
      h('span.s12__layer-no.is-accent', 'LAYER 2'),
      h('span.s12__layer-title', 'Secure Exam Environment'),
      h('span.s12__layer-count', '6가지')
    ),
    h('div.s12__chips', ...l2chips)
  );

  // 발주 측 수정 지시 — 2번째 박스(Secure Exam Environment) 아래 문구
  const note = h('p.s12__note',
    '시험 시스템보다 더 중요한 것은 ', h('em', '‘시험환경을 보장하는 기술’'), '입니다.'
  );

  const formula = h('div.s12__formula',
    h('span.s12__f', 'CBT System'),
    h('span.s12__f-op', '+'),
    h('span.s12__f.is-accent', 'Secure Exam Environment'),
    h('span.s12__f-op', '='),
    h('span.s12__f.is-result', 'University CBT Platform')
  );

  // 배경 영상 — 시험을 떠받치는 인프라(데이터센터) 무드 (경로 리터럴: 빌드 정적 스캔 대상)
  const bg = BgVideo('assets/video/bg-datacenter.mp4', { opacity: 0.85, bright: true });

  const el = ScreenRoot(meta, { className: 's12 has-bgvid' },
    gov,
    h('div.s12__body', layer1, gap, layer2, note),
    formula
  );
  el.appendChild(bg); // 풀블리드 배경 — 콘텐츠(z-index 1) 뒤(z-index 0)에 깔린다

  return {
    el,
    enter(sch) {
      sch.at(0, () => bg.play(sch));
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      // ① 층 1만 공중에 뜬 상태
      sch.at(820, () => layer1.classList.add('is-in'));
      // ② 하부 균열 · 경고 점멸
      sch.at(1500, () => gap.classList.add('is-cracked'));
      sch.stagger(warnEls, (w) => w.classList.add('is-in'), { start: 1900, gap: 380 });
    },
    leave() {
      bg.stop();
    },
    steps: [
      // 클릭 1회: 층 2 결합 + 안정화 + 결합식 점등
      (sch) => {
        el.classList.add('is-bonded');
        sch.stagger(l2chips, (c) => c.classList.add('is-in'), { start: 500, gap: 90 });
        sch.at(1200, () => note.classList.add('is-in'));
        sch.at(1600, () => formula.classList.add('is-in'));
      },
    ],
  };
}
