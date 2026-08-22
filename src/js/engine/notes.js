/**
 * notes.js — 발표자 노트 패널 (N 키, 기본 숨김)
 * 작업지시서의 「주요 발표 멘트」·「다음 화면 연결 멘트」를 원문 그대로 노출한다.
 * 발표 화면 자체에는 아무 UI도 추가하지 않으므로 §1 "불필요 UI 없음"과 충돌하지 않는다.
 */

import { h, pad2 } from '../lib/dom.js';
import { PARTS } from '../../data/screens.js';

export function mountNotes(deck) {
  const el = h('div.notes', { on: { click: (e) => e.stopPropagation() } });
  document.body.appendChild(el);

  const render = () => {
    const m = deck.meta;
    const part = PARTS[m.part];
    el.replaceChildren(
      h('div.notes__part', `PART ${part.no}. ${part.label} — ${part.name}`),
      h('h2.notes__title', `${pad2(m.id)}. ${m.title}`),
      h('div.notes__gov', m.governing),
      h('p.notes__h', '주요 발표 멘트'),
      h('div.notes__list',
        ...m.notes.map((t, i) => h('div.notes__item', h('i', `${i + 1}`), h('span', t)))
      ),
      h('p.notes__h', '다음 화면 연결 멘트'),
      h('div.notes__next', m.next),
      h('div.notes__meta',
        h('span', `클릭 ${m.clicks}회`),
        h('span', `${pad2(m.id)} / ${pad2(deck.total)}`)
      )
    );
  };

  deck.onChange(render);
  render();

  const toggle = () => el.classList.toggle('is-open');
  const close = () => el.classList.remove('is-open');
  const isOpen = () => el.classList.contains('is-open');

  return { el, toggle, close, isOpen };
}
