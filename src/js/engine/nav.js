/**
 * nav.js — 조작 (§1)
 *   → / Space / 화면 클릭 = 다음 단계 또는 다음 페이지
 *   ←                      = 이전
 *   ESC                    = 전체 목차 오버레이
 *   숫자 + Enter           = 페이지 점프
 *   추가: F 전체화면 · N 발표자 노트 · Home/End
 */

import { h } from '../lib/dom.js';
import { toggleFullscreen } from './stage.js';

export function mountNav(deck, { toc, notes }) {
  /* ---------- 숫자 점프 HUD ---------- */
  const hudNum = h('span');
  const hud = h('div.jump-hud', hudNum, h('small', 'Enter 로 이동'));
  document.body.appendChild(hud);

  let buffer = '';
  let bufferTimer = null;

  const showBuffer = () => {
    hudNum.textContent = buffer.padStart(2, '0');
    hud.classList.add('is-open');
    clearTimeout(bufferTimer);
    bufferTimer = setTimeout(clearBuffer, 2400);
  };
  const clearBuffer = () => {
    buffer = '';
    hud.classList.remove('is-open');
    clearTimeout(bufferTimer);
  };

  /* ---------- 키보드 ---------- */
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key;

    // 숫자 입력 (목차가 열려 있어도 동작)
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      buffer = (buffer + key).slice(-2);
      showBuffer();
      return;
    }

    if (key === 'Enter') {
      if (buffer) {
        e.preventDefault();
        deck.jump(parseInt(buffer, 10));
        clearBuffer();
        toc.close();
        return;
      }
    }

    if (key === 'Escape') {
      e.preventDefault();
      clearBuffer();
      if (notes.isOpen()) { notes.close(); return; }
      toc.toggle();
      return;
    }

    if (toc.isOpen()) {
      // 목차가 열린 상태에서는 좌우로 목차를 닫고 이동하지 않는다
      return;
    }

    switch (key) {
      case 'ArrowRight':
      case ' ':
      case 'Spacebar':
      case 'PageDown':
        e.preventDefault();
        clearBuffer();
        deck.next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        clearBuffer();
        deck.prev();
        break;
      case 'ArrowDown':
        e.preventDefault();
        deck.goTo(deck.index + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        deck.goTo(deck.index - 1, { steps: 0 });
        break;
      case 'Home':
        e.preventDefault();
        deck.first();
        break;
      case 'End':
        e.preventDefault();
        deck.last();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'n':
      case 'N':
        e.preventDefault();
        notes.toggle();
        break;
      default:
        break;
    }
  });

  /* ---------- 클릭 / 터치 ---------- */
  const viewport = document.getElementById('viewport');
  viewport.addEventListener('click', (e) => {
    if (toc.isOpen() || notes.isOpen()) return;
    // 버튼·링크 등 인터랙티브 요소 클릭은 페이지를 넘기지 않는다
    if (e.target.closest('button, a, [data-no-advance]')) return;
    deck.next();
  });

  // 마우스 우클릭 = 이전 (프리젠터 리모컨 호환)
  viewport.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (toc.isOpen() || notes.isOpen()) return;
    deck.prev();
  });

  /* ---------- 터치 스와이프 ---------- */
  let touchX = null;
  viewport.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) < 60) return;
    if (dx < 0) deck.next();
    else deck.prev();
  }, { passive: true });

  /* ---------- 해시 딥링크 (#0 → 표지, #7 → SCREEN 07) ---------- */
  const fromHash = () => {
    const raw = String(location.hash).replace('#', '');
    if (raw === '') return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 && n < deck.total ? n : null;
  };
  window.addEventListener('hashchange', () => {
    const n = fromHash();
    if (n !== null && n !== deck.index) deck.goTo(n, { immediate: true });
  });
  deck.onChange(() => {
    const want = `#${deck.index}`;
    if (location.hash !== want) history.replaceState(null, '', want);
  });

  return { initialIndex: fromHash() ?? 0 };
}
