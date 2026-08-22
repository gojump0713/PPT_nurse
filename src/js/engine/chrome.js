/**
 * chrome.js — 발표용 고정 UI
 *  - 우하단 페이지 인디케이터 (NN / 24 + PART 라벨)
 *  - 클릭 인디케이터 (§3: 잔여 ▸ / 소진 「다음 페이지 →」 / 5초 펄스)
 *  - 상단 진행 바
 *  - 커서 자동 숨김 (3초)
 */

import { h, pad2 } from '../lib/dom.js';
import { PARTS } from '../../data/screens.js';

const IDLE_CURSOR_MS = 3000;
const PULSE_AFTER_MS = 5000;

export function mountChrome(stageEl, deck) {
  /* ---------- 진행 바 ---------- */
  const progFill = h('div.deck-progress__fill');
  stageEl.appendChild(h('div.deck-progress', progFill));

  /* ---------- 페이지 인디케이터 ---------- */
  const partEl = h('span.page-indicator__part');
  const numEl = h('span.page-indicator__num');
  const totalEl = h('span.page-indicator__total');
  stageEl.appendChild(
    h('div.chrome.page-indicator', partEl, h('div', numEl, totalEl))
  );

  /* ---------- 클릭 인디케이터 ---------- */
  const dotsEl = h('div.click-indicator__dots');
  const textEl = h('span');
  const clickEl = h('div.chrome.click-indicator', dotsEl, textEl);
  stageEl.appendChild(clickEl);

  let pulseTimer = null;

  const renderClickIndicator = () => {
    const total = deck.stepsTotal;
    const left = deck.stepsLeft;

    dotsEl.replaceChildren(
      ...Array.from({ length: total }, (_, i) =>
        h(`div.click-indicator__dot${i >= total - left ? '.is-left' : ''}`)
      )
    );

    if (left > 0) {
      textEl.textContent = '▸';
      clickEl.classList.add('is-remaining');
    } else {
      textEl.textContent = deck.index < deck.total - 1 ? '다음 페이지 →' : '발표 종료';
      clickEl.classList.remove('is-remaining');
    }
    clickEl.classList.add('is-visible');

    // 5초 무동작 시 미세 펄스 (발표자 리마인드)
    clickEl.classList.remove('is-pulse');
    clearTimeout(pulseTimer);
    pulseTimer = setTimeout(() => clickEl.classList.add('is-pulse'), PULSE_AFTER_MS);
  };

  const render = () => {
    const meta = deck.meta;
    const part = PARTS[meta.part];
    partEl.textContent = part.label;
    numEl.textContent = pad2(meta.id);
    totalEl.textContent = ` / ${pad2(deck.total)}`;
    progFill.style.width = `${((deck.index + 1) / deck.total) * 100}%`;
    renderClickIndicator();
  };

  deck.onChange(render);
  render();

  /* ---------- 커서 자동 숨김 ---------- */
  let idleTimer = null;
  const wake = () => {
    document.body.classList.remove('is-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => document.body.classList.add('is-idle'), IDLE_CURSOR_MS);
  };
  ['mousemove', 'mousedown', 'wheel', 'touchstart'].forEach((evt) =>
    window.addEventListener(evt, wake, { passive: true })
  );
  wake();

  return { render };
}

/** 첫 진입 조작 안내 토스트 */
export function mountHelpToast() {
  const el = h('div.help-toast',
    h('span', h('kbd', '→'), '다음'),
    h('span', h('kbd', '←'), '이전'),
    h('span', h('kbd', 'ESC'), '목차'),
    h('span', h('kbd', 'N'), '발표자 노트'),
    h('span', h('kbd', 'F'), '전체화면')
  );
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('is-visible'), 900);
  setTimeout(() => el.classList.remove('is-visible'), 7200);
  setTimeout(() => el.remove(), 8000);
  return el;
}
