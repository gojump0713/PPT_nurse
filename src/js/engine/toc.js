/**
 * toc.js — ESC 목차 오버레이 (24 썸네일 그리드, PART 색 구분)
 */

import { h, pad2 } from '../lib/dom.js';
import { META, PARTS } from '../../data/screens.js';

export function mountTOC(deck) {
  const items = META.map((m, i) =>
    h(`button.toc__item${m.cover ? '.toc__item--cover' : ''}`, {
      type: 'button',
      dataset: { part: m.part, id: m.id },
      on: {
        click: (e) => {
          e.stopPropagation();
          close();
          deck.goTo(i, { immediate: true });
        },
      },
    },
      h('div.toc__num', m.cover ? '표지' : pad2(m.id)),
      h('div.toc__label', m.cover ? '국시 시험도, 진료도 이제 ‘환경’이 경쟁력입니다' : m.title),
      h('div.toc__badge', m.cover ? 'COVER' : `${PARTS[m.part].label}${m.clicks ? ` · 클릭 ${m.clicks}` : ''}`)
    )
  );

  const el = h('div.toc', {
    on: { click: (e) => { if (e.target === el) close(); } },
  },
    h('div.toc__head',
      h('div.toc__title', '영남이공대 · 영남대병원 발표 — 전체 목차'),
      h('div.toc__hint',
        h('span', h('kbd', 'ESC'), '닫기'),
        h('span', h('kbd', '숫자 + Enter'), '페이지 점프'),
        h('span', h('kbd', 'N'), '발표자 노트')
      )
    ),
    h('div.toc__grid', ...items)
  );
  document.body.appendChild(el);

  const sync = () => {
    items.forEach((it, i) => it.classList.toggle('is-current', i === deck.index));
  };
  deck.onChange(sync);
  sync();

  const isOpen = () => el.classList.contains('is-open');
  const open = () => { sync(); el.classList.add('is-open'); };
  const close = () => el.classList.remove('is-open');
  const toggle = () => (isOpen() ? close() : open());

  return { el, open, close, toggle, isOpen };
}
