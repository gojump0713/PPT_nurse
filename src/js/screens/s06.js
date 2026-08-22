/**
 * SCREEN 06 — 간호학과 → 보건계열 확장 모델
 * 동심원의 물리적 확장이 곧 "확장"의 의미.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, SourceFooter } from '../components/index.js';

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
  const gov = Governing(meta.governing, { size: 'lg', center: true });

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

  const note = SourceFooter(
    '확장 시 신규 구축이 아닌 기존 플랫폼 증설 · 학과별 시스템 난립 방지',
    { inline: true }
  );
  note.classList.add('s06__note');

  const el = ScreenRoot(meta, { className: 's06' },
    gov,
    h('div.s06__body', diagram),
    note
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
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
    steps: [],
  };
}
