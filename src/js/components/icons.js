/**
 * icons.js — 라인 아이콘 (SVG 인라인, 외부 의존 없음)
 * currentColor 를 따르므로 부모의 color 로 색을 제어한다.
 */

import { h } from '../lib/dom.js';

const wrap = (paths, { size = 46, className = '', stroke = 1.6 } = {}) =>
  h('svg', {
    class: className,
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, ...paths.map((d) => (typeof d === 'string' ? h('path', { d }) : d)));

export const icons = {
  monitor: (o) => wrap([
    'M3 4.5h18v11H3z', 'M8.5 20h7', 'M12 15.5V20',
  ], o),
  gear: (o) => wrap([
    h('circle', { cx: 12, cy: 12, r: 3 }),
    'M19.4 14.5a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-.97H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 .97-1.47V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47.97H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5.97z',
  ], o),
  lock: (o) => wrap([
    h('rect', { x: 4, y: 10, width: 16, height: 10, rx: 2 }),
    'M8 10V7a4 4 0 0 1 8 0v3',
  ], o),
  server: (o) => wrap([
    h('rect', { x: 3, y: 3.5, width: 18, height: 7, rx: 1.6 }),
    h('rect', { x: 3, y: 13.5, width: 18, height: 7, rx: 1.6 }),
    'M7 7h.01', 'M7 17h.01',
  ], o),
  shield: (o) => wrap([
    'M12 3l7.5 3v5.5c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5V6z',
  ], o),
  shieldCheck: (o) => wrap([
    'M12 3l7.5 3v5.5c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5V6z',
    'M9 12l2 2 4-4',
  ], o),
  stethoscope: (o) => wrap([
    'M6 3v5a4 4 0 0 0 8 0V3',
    'M6 3H4.5', 'M14 3h1.5',
    'M10 12v2.5a5 5 0 0 0 5 5 4 4 0 0 0 4-4V14',
    h('circle', { cx: 19, cy: 12.5, r: 1.8 }),
  ], o),
  flask: (o) => wrap([
    'M9 3v6.2L4.6 17.4A2 2 0 0 0 6.4 20.5h11.2a2 2 0 0 0 1.8-3.1L15 9.2V3',
    'M8 3h8', 'M7.4 14.5h9.2',
  ], o),
  doc: (o) => wrap([
    'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z',
    'M14 3v5h5', 'M9 13h6', 'M9 17h4',
  ], o),
  laptop: (o) => wrap([
    h('rect', { x: 4, y: 5, width: 16, height: 10, rx: 1.6 }),
    'M2.5 18.5h19',
  ], o),
  cloud: (o) => wrap([
    'M7 18a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17.5 10.5 3.75 3.75 0 0 1 17 18z',
  ], o),
  chart: (o) => wrap([
    'M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2',
  ], o),
  users: (o) => wrap([
    h('circle', { cx: 9, cy: 8, r: 3.2 }),
    'M3 20a6 6 0 0 1 12 0',
    'M16.5 5.3a3.2 3.2 0 0 1 0 6.2', 'M17.5 14.4A6 6 0 0 1 21 20',
  ], o),
  bed: (o) => wrap([
    'M3 19v-9', 'M3 13h18a0 0 0 0 1 0 0v6', h('circle', { cx: 7.5, cy: 10, r: 2 }),
    'M11 13v-2.5h10V19',
  ], o),
  building: (o) => wrap([
    h('rect', { x: 4, y: 3, width: 16, height: 18, rx: 1.6 }),
    'M9 7h.01', 'M15 7h.01', 'M9 11h.01', 'M15 11h.01', 'M10.5 21v-4h3v4',
  ], o),
  clock: (o) => wrap([
    h('circle', { cx: 12, cy: 12, r: 8.5 }), 'M12 7.5V12l3 2',
  ], o),
  alert: (o) => wrap([
    'M10.3 4.3 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z',
    'M12 9.5v4', 'M12 17.2h.01',
  ], o),
  bank: (o) => wrap([
    'M3 10h18', 'M12 3 3 7.5V10h18V7.5z', 'M6 10v7', 'M10 10v7', 'M14 10v7', 'M18 10v7', 'M3 20.5h18',
  ], o),
  brain: (o) => wrap([
    'M9.5 3.5A2.8 2.8 0 0 0 7 6.3 2.6 2.6 0 0 0 5 9c0 .9.4 1.7 1 2.2A2.8 2.8 0 0 0 5.4 16 2.7 2.7 0 0 0 8 19.6a2.6 2.6 0 0 0 4 .4V4.6a2.6 2.6 0 0 0-2.5-1.1z',
    'M14.5 3.5A2.8 2.8 0 0 1 17 6.3 2.6 2.6 0 0 1 19 9c0 .9-.4 1.7-1 2.2a2.8 2.8 0 0 1 .6 4.8A2.7 2.7 0 0 1 16 19.6a2.6 2.6 0 0 1-4 .4',
  ], o),
  calc: (o) => wrap([
    h('rect', { x: 5, y: 3, width: 14, height: 18, rx: 2 }),
    'M8.5 7h7', 'M9 12h.01', 'M12 12h.01', 'M15 12h.01', 'M9 16h.01', 'M12 16h.01', 'M15 16h.01',
  ], o),
  refresh: (o) => wrap([
    'M20 11a8 8 0 1 0-.7 4.4', 'M20 5.5V11h-5.5',
  ], o),
  globe: (o) => wrap([
    h('circle', { cx: 12, cy: 12, r: 8.5 }), 'M3.5 12h17',
    'M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5z',
  ], o),
};

export function Icon(name, opts) {
  const fn = icons[name];
  return fn ? fn({ className: 'flip__icon', ...(opts || {}) }) : null;
}
