/**
 * SCREEN 03 — 시험 당일 첫 CBT 경험 차단
 * 실제 CBT 응시 화면 위에서 "사전에 익숙해져야 할 9가지"를 순차 점등.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, Counter, Hotspot } from '../components/index.js';
import { CbtStudentMock } from '../components/mocks.js';

const meta = metaOf(3);

/** 좌/우 배치는 실제 UI 요소 위치에 맞춘다 (타이머·도구는 우상단, 문항은 좌측 …) */
const SPOTS = [
  { idx: '①', label: 'PC 기반 문제풀이', side: 'left', top: 14 },
  { idx: '②', label: '장문 문항 화면 판독', side: 'left', top: 188 },
  { idx: '③', label: '문항 이동', side: 'right', top: 236 },
  { idx: '④', label: '문항 체크', side: 'right', top: 306 },
  { idx: '⑤', label: '미응답 확인', side: 'right', top: 462 },
  { idx: '⑥', label: '답안 수정', side: 'left', top: 540 },
  { idx: '⑦', label: '제한시간 관리', side: 'right', top: 14 },
  { idx: '⑧', label: '계산기 · 메모 도구', side: 'right', top: 82 },
  { idx: '⑨', label: '장시간 화면 집중', side: 'left', top: 340 },
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });
  const counter = Counter(9, '가지');

  const spots = SPOTS.map((s) =>
    Hotspot({
      idx: s.idx,
      label: s.label,
      top: s.top,
      side: s.side,
      left: s.side === 'right' ? 1332 : undefined,
      right: s.side === 'left' ? 1332 : undefined,
    })
  );

  const mock = h('div.s03__mock', CbtStudentMock());
  const center = h('div.s03__center', mock, ...spots);

  const ask = rv('up', 'p.s03__ask',
    '내용은 아는데 환경이 낯설어 실력을 못 냈다면, ',
    h('em', '그것도 학생의 실력입니까?')
  );

  const el = ScreenRoot(meta, { className: 's03' },
    h('div.s03__top', gov, counter),
    center,
    ask
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(700, () => {
        counter.classList.add('is-in');
        mock.classList.add('is-in');
      });
      // 9개 핫스팟 0.5s 간격 순차 점등 + 카운터 1→9
      sch.stagger(spots, (spot, i) => {
        spot.classList.add('is-in');
        counter.set(i + 1);
      }, { start: 1700, gap: 500 });
      sch.at(1700 + 500 * 9 + 400, () => ask.classList.add('is-in'));
    },
    steps: [],
  };
}
