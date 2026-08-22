/**
 * SCREEN 06 — 간호학과 → 보건계열 확장 모델
 * 동심원의 물리적 확장이 곧 "확장"의 의미.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, BgVideo } from '../components/index.js';

const meta = metaOf(6);

/** 안 → 밖. size 는 원의 지름(px), 스테이지 좌표 기준 */
const RINGS = [
  { label: '간호', size: 156, tone: 'core' },
  { label: '물리치료', size: 266 },
  { label: '치위생', size: 376 },
  { label: '보건의료 관련 학과', size: 486 },
  { label: '영남이공대 전체', size: 596, tone: 'outer' },
];

export function create() {
  // 지정된 위치에서 단락을 나눈다 (자동 줄바꿈에 맡기지 않음)
  const gov = Governing(
    '간호학과 CBT는 단일 학과 시스템이 아니라,<br>대학 디지털 평가환경의 시작점입니다.',
    { size: 'lg', center: true }
  );

  const ringEls = RINGS.map((r, i) =>
    h(`div.s06__ring${r.tone ? '.s06__ring--' + r.tone : ''}`, {
      style: { width: `${r.size}px`, height: `${r.size}px`, zIndex: String(10 - i) },
    })
  );

  const labelEls = RINGS.map((r, i) =>
    h('div.s06__label', {
      style: i === 0
        ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
        : { top: '50%', left: '50%', transform: `translate(-50%,-50%) translateY(-${r.size / 2 - 22}px)` },
    }, r.label)
  );

  const diagram = h('div.s06__diagram', ...ringEls, ...labelEls);

  // 발주 측 수정 지시 — 하단 문구 3줄로 교체
  const note = rv('fade', 'div.s06__note',
    h('p.s06__note-lead', '보건계열 전체가 같은 변화 앞에 있습니다'),
    h('p.s06__note-main', 'CBT는 한 학과 시스템이 아니라 보건계열 디지털 평가환경이 될 수 있습니다.'),
    h('p.s06__note-sub', '확장 시 구축이 아닌 기존 플랫폼 증설, 학과별 시스템 난립 방지')
  );

  // 중심에서 도는 은하수 — 동심원 확장과 겹치는 무드 배경 (경로 리터럴 유지)
  const bg = BgVideo('assets/video/bg-galaxy.mp4', { opacity: 0.32 });

  const el = ScreenRoot(meta, { className: 's06 has-bgvid' },
    gov,
    h('div.s06__body', diagram),
    note
  );
  el.appendChild(bg);

  return {
    el,
    enter(sch) {
      sch.at(0, () => { el.headerEl.classList.add('is-in'); bg.play(sch); });
      sch.at(400, () => gov.classList.add('is-in'));
      // 중심원(간호)만 먼저 → 바깥 원이 0.5s 간격으로 ripple 확장
      sch.at(900, () => {
        ringEls[0].classList.add('is-in');
        labelEls[0].classList.add('is-in');
      });
      for (let i = 1; i < RINGS.length; i += 1) {
        sch.at(900 + 500 * i, () => {
          ringEls[i].classList.add('is-in');
          labelEls[i].classList.add('is-in');
        });
      }
      sch.at(900 + 500 * RINGS.length + 200, () => note.classList.add('is-in'));
    },
    leave() {
      bg.stop();
    },
    steps: [],
  };
}
