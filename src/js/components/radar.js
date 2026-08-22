/**
 * radar.js — 소형 레이더 차트 (S09)
 * 5축 취약영역 프로필. 값은 0~100.
 */

import { h } from '../lib/dom.js';

const AXES = ['약물계산', '감염관리', '성인간호', '법규', '시간관리'];

export function Radar(values, { size = 190, axes = AXES } = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  const n = axes.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, v) => [cx + Math.cos(angle(i)) * r * (v / 100), cy + Math.sin(angle(i)) * r * (v / 100)];

  const gridRings = [0.25, 0.5, 0.75, 1].map((k) =>
    h('polygon', {
      points: axes.map((_, i) => pt(i, k * 100).join(',')).join(' '),
      fill: 'none',
      stroke: 'rgba(149,163,171,.22)',
      'stroke-width': 1,
    })
  );

  const spokes = axes.map((_, i) =>
    h('line', {
      x1: cx, y1: cy,
      x2: pt(i, 100)[0], y2: pt(i, 100)[1],
      stroke: 'rgba(149,163,171,.18)', 'stroke-width': 1,
    })
  );

  const shape = h('polygon', {
    points: values.map((v, i) => pt(i, v).join(',')).join(' '),
    fill: 'var(--c-accent-soft)',
    stroke: 'var(--c-accent)',
    'stroke-width': 2,
    'stroke-linejoin': 'round',
    class: 'radar__shape',
    style: `transform-origin:${cx}px ${cy}px`,
  });

  const dots = values.map((v, i) => {
    const [x, y] = pt(i, v);
    const weak = v <= 45;
    return h('circle', {
      cx: x, cy: y, r: weak ? 4.6 : 2.8,
      fill: weak ? 'var(--c-danger)' : 'var(--c-accent)',
      class: weak ? 'radar__dot radar__dot--weak' : 'radar__dot',
    });
  });

  const labels = axes.map((label, i) => {
    const [x, y] = pt(i, 128);
    return h('text', {
      x, y: y + 4,
      'text-anchor': Math.abs(x - cx) < 6 ? 'middle' : x > cx ? 'start' : 'end',
      class: values[i] <= 45 ? 'radar__label is-weak' : 'radar__label',
    }, label);
  });

  const svg = h('svg.radar', {
    viewBox: `0 0 ${size} ${size}`,
    width: size, height: size,
  }, ...gridRings, ...spokes, shape, ...dots, ...labels);

  svg.shapeEl = shape;
  svg.draw = () => svg.classList.add('is-drawn');
  return svg;
}

export const RADAR_AXES = AXES;
