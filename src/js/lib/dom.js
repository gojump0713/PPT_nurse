/**
 * dom.js — 초경량 하이퍼스크립트
 * 빌드 도구 없이 24개 화면을 선언적으로 구성하기 위한 최소 도구.
 *
 *   h('div.card#main', { style: { gap: '10px' }, on: { click } }, '텍스트', child)
 *
 * 선택자 문법: tag(.class)*(#id)?  — tag 생략 시 div
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const SVG_TAGS = new Set([
  'svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon',
  'text', 'tspan', 'defs', 'linearGradient', 'radialGradient', 'stop', 'clipPath',
  'mask', 'filter', 'feGaussianBlur', 'feOffset', 'feMerge', 'feMergeNode',
  'marker', 'use', 'symbol', 'foreignObject', 'animate', 'animateTransform',
]);

function parseSelector(sel) {
  const idMatch = sel.match(/#([\w-]+)/);
  const classes = [...sel.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
  const tag = (sel.match(/^([\w-]+)/) || [, 'div'])[1];
  return { tag, id: idMatch ? idMatch[1] : null, classes };
}

function appendChild(parent, child) {
  if (child === null || child === undefined || child === false || child === true) return;
  if (Array.isArray(child)) {
    child.forEach((c) => appendChild(parent, c));
    return;
  }
  if (child instanceof Node) {
    parent.appendChild(child);
    return;
  }
  parent.appendChild(document.createTextNode(String(child)));
}

/** 엘리먼트 생성 */
export function h(sel, props, ...children) {
  const { tag, id, classes } = parseSelector(sel);
  const isSvg = SVG_TAGS.has(tag);
  const el = isSvg
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);

  if (id) el.id = id;
  if (classes.length) {
    if (isSvg) el.setAttribute('class', classes.join(' '));
    else el.classList.add(...classes);
  }

  // props 자리에 자식이 바로 온 경우 허용
  if (props instanceof Node || Array.isArray(props) || typeof props === 'string' || typeof props === 'number') {
    children.unshift(props);
    props = null;
  }

  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;

      if (key === 'class' || key === 'className') {
        const list = String(value).split(/\s+/).filter(Boolean);
        if (isSvg) el.setAttribute('class', [...classes, ...list].join(' '));
        else el.classList.add(...list);
      } else if (key === 'style') {
        if (typeof value === 'string') el.setAttribute('style', value);
        else Object.entries(value).forEach(([k, v]) => {
          if (v === null || v === undefined) return;
          if (k.startsWith('--')) el.style.setProperty(k, String(v));
          else el.style[k] = v;
        });
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([k, v]) => {
          if (v !== null && v !== undefined) el.dataset[k] = v;
        });
      } else if (key === 'on') {
        Object.entries(value).forEach(([evt, fn]) => {
          if (typeof fn === 'function') el.addEventListener(evt, fn);
        });
      } else if (key === 'html') {
        el.innerHTML = value;
      } else if (key === 'text') {
        el.textContent = value;
      } else if (key === 'ref' && typeof value === 'function') {
        value(el);
      } else if (!isSvg && key in el && key !== 'list' && key !== 'form') {
        try { el[key] = value; } catch { el.setAttribute(key, value); }
      } else {
        el.setAttribute(key, value === true ? '' : value);
      }
    }
  }

  children.forEach((c) => appendChild(el, c));
  return el;
}

/** DocumentFragment */
export function frag(...children) {
  const f = document.createDocumentFragment();
  children.forEach((c) => appendChild(f, c));
  return f;
}

/** reveal 대상 엘리먼트 — data-rv 방향을 지정한 .rv 요소 */
export function rv(dir, sel, props, ...children) {
  const el = h(sel, props, ...children);
  el.classList.add('rv');
  el.dataset.rv = dir || 'up';
  return el;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** 클래스 토글 헬퍼 */
export function setClass(el, name, on) {
  if (!el) return;
  el.classList.toggle(name, !!on);
}

/** 2자리 0패딩 */
export const pad2 = (n) => String(n).padStart(2, '0');
