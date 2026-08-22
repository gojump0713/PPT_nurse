/**
 * main.js — 부트스트랩
 */

import { Deck } from './engine/deck.js';
import { mountStage } from './engine/stage.js';
import { mountChrome, mountHelpToast } from './engine/chrome.js';
import { mountTOC } from './engine/toc.js';
import { mountNotes } from './engine/notes.js';
import { mountNav } from './engine/nav.js';
import { screens } from './screens/index.js';
import { META, TOTAL_CLICKS } from '../data/screens.js';

async function boot() {
  const bootEl = document.getElementById('boot');
  const stage = document.getElementById('stage');

  // 폰트가 로드된 뒤에 첫 화면을 그린다 (FOUT 방지 — Big Number 는 폰트 교체가 크게 튄다)
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 4000)),
    ]);
  } catch { /* noop */ }

  mountStage(stage);

  const deck = new Deck(stage, screens);
  mountChrome(stage, deck);
  const toc = mountTOC(deck);
  const notes = mountNotes(deck);
  const { initialIndex } = mountNav(deck, { toc, notes });

  deck.goTo(initialIndex || 0, { immediate: true });

  bootEl.classList.add('is-done');
  setTimeout(() => bootEl.remove(), 600);
  mountHelpToast();

  // 콘솔 안내 — 클릭 합계는 tools/check.mjs 가 설계값과 구현값을 대조한다.
  // (여기서 전 화면을 미리 생성해 세면 영상·이미지까지 선요청되므로 하지 않는다)
  console.info(
    `%c영남이공대·영남대병원 발표 %c${META.length}화면 · 클릭 합계 ${TOTAL_CLICKS}회 (기준 13회 이하) · N: 발표자 노트`,
    'font-weight:700;color:#1c60ef', 'color:#95a3ab'
  );

  window.deck = deck; // 리허설 중 콘솔 조작용
}

boot();
