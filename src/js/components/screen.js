/**
 * screen.js — <PageShell> 상당의 화면 뼈대
 * 1920×1080 스테이지 안에 들어가는 한 장의 SCREEN 을 만든다.
 */

import { h } from '../lib/dom.js';
import { Header } from './index.js';
import { PARTS } from '../../data/screens.js';

/**
 * @param {object} meta      data/screens.js 의 메타
 * @param {object} opts
 *   header: false 로 주면 헤더 없이 (S01 오프닝 등 풀블리드 화면)
 *   className: 추가 클래스
 *   pad: 'none' | 'tight' 로 패딩 조정
 */
export function ScreenRoot(meta, opts = {}, ...children) {
  const { header = true, className = '', pad } = opts;
  const part = PARTS[meta.part];

  const body = h('div.screen__body', ...children);
  const el = h(`section.screen${className ? '.' + className.split(/\s+/).join('.') : ''}`, {
    dataset: { id: meta.id, part: meta.part },
    style: pad === 'none'
      ? { padding: '0' }
      : pad === 'tight'
        ? { padding: '48px 88px' }
        : null,
  },
    header ? Header({ title: meta.title, part: part.label, partNo: part.no }) : null,
    body
  );

  el.bodyEl = body;
  // 헤더 엘리먼트(있으면) — enter() 에서 첫 등장 대상으로 사용
  el.headerEl = header ? el.firstElementChild : null;
  return el;
}

/**
 * 화면 표준 등장 시퀀스 (작업지시서 §2)
 *   제목 0s → 거버닝 0.4s → 본문 0.8s~ (0.15s 간격)
 * @returns 마지막 요소 등장 시각(ms)
 */
export function standardIntro(sch, { header, gov, body = [], start = 0, gap = 150 } = {}) {
  if (header) sch.at(start + 0, () => header.classList.add('is-in'));
  if (gov) sch.at(start + 400, () => gov.classList.add('is-in'));
  let last = start + 400;
  body.filter(Boolean).forEach((el, i) => {
    const t = start + 800 + gap * i;
    last = t;
    sch.at(t, () => el.classList.add('is-in'));
  });
  return last;
}
