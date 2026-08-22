/**
 * components/index.js — 공통 컴포넌트 (작업지시서 PART C-F)
 *
 * 모든 팩토리는 DOM 엘리먼트를 반환한다. 애니메이션 제어가 필요한 컴포넌트는
 * 엘리먼트에 메서드를 붙여서 노출한다 (예: bignum.countUp(sch), timeline.play(sch)).
 */

import { h, rv } from '../lib/dom.js';
import { countTo, show, lit } from '../lib/anim.js';

/* ---------------------------------------------------------------
   Header — 좌: 제목(28px/600) / 우: PART 라벨
   --------------------------------------------------------------- */
export function Header({ title, part, partNo }) {
  return rv('down', 'header.hdr',
    h('h1.hdr__title', title),
    h('div.hdr__part',
      h('span', `PART ${partNo}`),
      part
    )
  );
}

/* ---------------------------------------------------------------
   GoverningMessage — 화면 내 최대 문장 (44~56px / 700 / 최대 2줄)
   html 을 넘기면 <em>(포인트) / <mark>(밑줄 강조) 사용 가능
   --------------------------------------------------------------- */
export function Governing(content, { size = '', center = false, dir = 'up', style } = {}) {
  const cls = ['gov', size && `gov--${size}`, center && 'gov--center'].filter(Boolean).join('.');
  const el = rv(dir, `p.${cls}`, { style });
  if (typeof content === 'string' && /[<>]/.test(content)) el.innerHTML = content;
  else el.append(content);
  return el;
}

/* ---------------------------------------------------------------
   BigNumber — 정적 / 카운트업 / 모핑
   --------------------------------------------------------------- */
export function BigNumber(value, {
  size = '',            // '', 'xl', 'sm', 'md'
  unit = null,
  accent = false,
  gradient = false,
  format = null,
  dir = 'scale',
  reveal = true,
  style,
} = {}) {
  const fmt = format || ((v) => Math.round(v).toLocaleString('ko-KR'));
  const cls = [
    'bignum',
    size && `bignum--${size}`,
    accent && 'bignum--accent',
    gradient && 'bignum--gradient',
  ].filter(Boolean).join('.');

  const valEl = h('span.bignum__val', typeof value === 'number' ? fmt(value) : String(value));
  const el = reveal
    ? rv(dir, `span.${cls}`, { style }, valEl, unit && h('span.bignum__unit', unit))
    : h(`span.${cls}`, { style }, valEl, unit && h('span.bignum__unit', unit));

  el.valueEl = valEl;
  /** 0 → to 카운트업 */
  el.countUp = (sch, to, opts = {}) =>
    countTo(sch, valEl, { from: opts.from ?? 0, to, duration: opts.duration ?? 1500, format: fmt });
  /** 값 모핑 (블러 전환 + 카운트) */
  el.morphTo = (sch, to, opts = {}) => {
    const parsed = parseFloat(String(valEl.textContent).replace(/[^\d.-]/g, ''));
    const from = opts.from ?? (Number.isFinite(parsed) ? parsed : 0);
    el.classList.add('is-morphing');
    sch.at(620, () => el.classList.remove('is-morphing'));
    countTo(sch, valEl, { from, to, duration: opts.duration ?? 900, format: fmt });
  };
  /** 텍스트 즉시 교체 (블러 전환 포함) */
  el.swapText = (sch, text) => {
    el.classList.add('is-morphing');
    sch.at(260, () => { valEl.textContent = text; });
    sch.at(620, () => el.classList.remove('is-morphing'));
  };
  return el;
}

/* ---------------------------------------------------------------
   ComparisonCard — Before/After 2컬럼
   --------------------------------------------------------------- */
export function Comparison({ beforeHead, afterHead, beforeBody, afterBody, arrow = '→' }) {
  const before = h('div.cmp__col.cmp__col--before',
    h('div.cmp__head', beforeHead),
    beforeBody
  );
  const after = h('div.cmp__col.cmp__col--after',
    h('div.cmp__head', afterHead),
    afterBody
  );
  const arr = h('div.cmp__arrow', arrow);
  const el = h('div.cmp', before, arr, after);
  el.beforeCol = before;
  el.afterCol = after;
  /** 우측(After) 컬럼 점등 */
  el.light = () => { after.classList.add('is-lit'); arr.classList.add('is-lit'); };
  return el;
}

/* ---------------------------------------------------------------
   DataCard — 숫자 + 라벨 (+ 보조문)
   --------------------------------------------------------------- */
export function DataCard({ label, value, sub, lit: isLit = false, dir = 'up', style }) {
  const valEl = h('div.dcard__value', value ?? '');
  const el = rv(dir, `div.dcard${isLit ? '.dcard--lit' : ''}`, { style },
    label && h('div.dcard__label', label),
    valEl,
    sub && h('div.dcard__sub', sub)
  );
  el.valueEl = valEl;
  return el;
}

/* ---------------------------------------------------------------
   KeywordCard — 핵심 키워드 (24~32px / 600)
   --------------------------------------------------------------- */
export function KeyCard(title, desc, { dir = 'up', style, lit: isLit = false } = {}) {
  return rv(dir, `div.kcard${isLit ? '.is-lit' : ''}`, { style },
    h('div.kcard__title', title),
    desc && h('div.kcard__desc', desc)
  );
}

/* ---------------------------------------------------------------
   Tag — 칩형 라벨 (인덱스 옵션)
   --------------------------------------------------------------- */
export function Tag(text, { idx = null, danger = false, dir = 'up', style } = {}) {
  const cls = ['tag', danger && 'tag--danger'].filter(Boolean).join('.');
  return rv(dir, `span.${cls}`, { style },
    idx !== null && h('span.tag__idx', idx),
    text
  );
}

/* ---------------------------------------------------------------
   Counter — "N가지" 카운터 배지
   --------------------------------------------------------------- */
export function Counter(total, suffix = '가지', { dir = 'fade', style } = {}) {
  const numEl = h('span.counter__num', '0');
  const el = rv(dir, 'span.counter', { style }, numEl, suffix);
  el.numEl = numEl;
  el.set = (n) => { numEl.textContent = String(n); };
  el.countUp = (sch, to, duration = 1200) =>
    countTo(sch, numEl, { from: 0, to, duration, format: (v) => String(Math.round(v)) });
  return el;
}

/* ---------------------------------------------------------------
   Timeline — 가로 노드 순차 점등 + Progress
   nodes: [{ label, desc, goal }]
   --------------------------------------------------------------- */
export function Timeline(nodes, { axis = 46, style } = {}) {
  const fill = h('div.tl__fill');
  const nodeEls = nodes.map((n) =>
    h(`div.tl__node${n.goal ? '.is-goal' : ''}`,
      h('div.tl__dot'),
      h('div.tl__label', n.label),
      n.desc && h('div.tl__desc', n.desc)
    )
  );
  const el = h('div.tl', { style: { '--tl-axis': `${axis}px`, ...(style || {}) } },
    h('div.tl__track', fill),
    h('div.tl__nodes', ...nodeEls)
  );
  el.nodeEls = nodeEls;
  el.fillEl = fill;
  /** start 부터 gap 간격으로 순차 점등 */
  el.play = (sch, { start = 0, gap = 800, onNode } = {}) => {
    const n = nodeEls.length;
    sch.stagger(nodeEls, (nodeEl, i) => {
      nodeEl.classList.add('is-lit');
      fill.style.width = `${((i + 0.5) / n) * 100}%`;
      onNode && onNode(i, nodeEl);
    }, { start, gap });
    sch.at(start + gap * n, () => { fill.style.width = '100%'; });
    return start + gap * n;
  };
  return el;
}

/* ---------------------------------------------------------------
   ProcessBand — 단계 띠 (누적 등장 + 아코디언 압축)
   --------------------------------------------------------------- */
export function ProcessBand(steps, { accent = false, numbered = true, style } = {}) {
  const stepEls = steps.map((s, i) =>
    h('div.band__step',
      numbered && h('span.band__step-idx', String(i + 1).padStart(2, '0')),
      h('span', s)
    )
  );
  const el = h(`div.band${accent ? '.band--accent' : ''}`, { style }, ...stepEls);
  el.stepEls = stepEls;
  el.play = (sch, { start = 0, gap = 200 } = {}) => {
    sch.stagger(stepEls, (s) => s.classList.add('is-in'), { start, gap });
    return start + gap * stepEls.length;
  };
  el.showAll = () => stepEls.forEach((s) => s.classList.add('is-in'));
  el.collapse = () => el.classList.add('is-collapsed');
  return el;
}

/* ---------------------------------------------------------------
   Track — 라벨 + 노드 체인 (S04 평행 2트랙)
   --------------------------------------------------------------- */
export function Track(label, nodes, { style } = {}) {
  const nodeEls = [];
  const linkEls = [];
  const children = [];
  nodes.forEach((n, i) => {
    if (i > 0) {
      const link = h('div.track__link');
      linkEls.push(link);
      children.push(link);
    }
    const node = h('div.track__node', n);
    nodeEls.push(node);
    children.push(node);
  });
  const el = h('div.track', { style },
    h('div.track__label', label),
    h('div.track__nodes', ...children)
  );
  el.nodeEls = nodeEls;
  el.play = (sch, { start = 0, gap = 600, onNode } = {}) => {
    nodeEls.forEach((node, i) => {
      sch.at(start + gap * i, () => {
        node.classList.add('is-lit');
        if (i > 0) linkEls[i - 1].classList.add('is-lit');
        onNode && onNode(i, node);
      });
    });
    return start + gap * nodeEls.length;
  };
  return el;
}

/* ---------------------------------------------------------------
   FlipCard — 앞/뒷면
   --------------------------------------------------------------- */
export function FlipCard({ front, back, icon, hoverReflip = true, dir = 'up', style }) {
  const el = rv(dir, 'div.flip', { style },
    h('div.flip__inner',
      h('div.flip__face.flip__face--front', h('div.flip__front-label', front)),
      h('div.flip__face.flip__face--back',
        icon || null,
        h('div.flip__back-label', back)
      )
    )
  );
  el.flip = () => el.classList.add('is-flipped');
  el.unflip = () => el.classList.remove('is-flipped');
  if (hoverReflip) {
    // Q&A 대비: 플립 완료 후 hover 하면 앞면을 다시 보여준다
    el.addEventListener('mouseenter', () => {
      if (el.classList.contains('is-flipped')) el.dataset.peek = '1', el.classList.remove('is-flipped');
    });
    el.addEventListener('mouseleave', () => {
      if (el.dataset.peek === '1') { delete el.dataset.peek; el.classList.add('is-flipped'); }
    });
  }
  return el;
}

/* ---------------------------------------------------------------
   Hotspot — 핫스팟 핀 + 라벨 (S03)
   --------------------------------------------------------------- */
export function Hotspot({ idx, label, top, left, right, side = 'right' }) {
  const el = h(`div.hot${side === 'left' ? '.hot--left' : ''}`, {
    style: {
      top: typeof top === 'number' ? `${top}px` : top,
      left: left !== undefined ? (typeof left === 'number' ? `${left}px` : left) : null,
      right: right !== undefined ? (typeof right === 'number' ? `${right}px` : right) : null,
    },
  },
    h('div.hot__pin', String(idx)),
    h('div.hot__label', label)
  );
  return el;
}

/* ---------------------------------------------------------------
   Popover — 지도 마커 팝업 카드 (S18)
   --------------------------------------------------------------- */
export function Popover({ name, meta, rows, style }) {
  const rowEls = (rows || []).map((r) => {
    const val = h('div.pop__row-val', r.display ?? String(r.value ?? ''));
    const row = h('div.pop__row', h('div.pop__row-label', r.label), val);
    row.valEl = val;
    row.spec = r;
    return row;
  });
  const el = h('div.pop', { style },
    h('div.pop__name', name),
    meta && h('div.pop__meta', meta),
    h('div.pop__rows', ...rowEls)
  );
  el.rowEls = rowEls;
  el.open = (sch) => {
    el.classList.add('is-open');
    rowEls.forEach((row, i) => {
      const spec = row.spec;
      if (typeof spec.value === 'number') {
        sch.at(200 + i * 160, () =>
          countTo(sch, row.valEl, {
            from: 0,
            to: spec.value,
            duration: 1200,
            format: (v) => Math.round(v).toLocaleString('ko-KR') + (spec.suffix || ''),
          })
        );
      }
    });
  };
  el.close = () => el.classList.remove('is-open');
  return el;
}

/* ---------------------------------------------------------------
   VideoPlayer — 무음 자동재생 루프 + 폴백 이미지 슬라이드 (S14)
   --------------------------------------------------------------- */
export function VideoPlayer({ src, poster, slides = [], captions = [], badge, style }) {
  const captionEl = h('div.vplayer__caption', captions[0] || '');
  const slideEls = slides.map((s, i) =>
    h(`div.vplayer__slide${i === 0 ? '.is-active' : ''}`,
      typeof s === 'string' ? h('img', { src: s, alt: '' }) : s
    )
  );

  const video = src
    ? h('video', { src, poster, muted: true, loop: true, autoplay: true, playsInline: true, preload: 'auto' })
    : null;
  if (video) video.setAttribute('muted', '');

  const badgeEl = badge ? h('div.vplayer__badge', h('i'), badge) : null;
  const el = h('div.vplayer', { style },
    video,
    ...slideEls,
    badgeEl,
    captionEl
  );

  el.videoEl = video;
  el.captionEl = captionEl;

  el.play = (sch) => {
    let ok = false;
    if (video) {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => { el.fallback(sch); });
      video.addEventListener('error', () => el.fallback(sch), { once: true });
      video.addEventListener('playing', () => { ok = true; }, { once: true });
      // 소스가 아예 없으면 loadeddata 가 오지 않는다 → 짧은 타임아웃으로 폴백
      sch.at(1200, () => { if (!ok) el.fallback(sch); });
    } else {
      el.fallback(sch);
    }
    // 구간 자막 순환
    if (captions.length > 1) {
      let ci = 0;
      sch.every(5000, () => {
        ci = (ci + 1) % captions.length;
        captionEl.textContent = captions[ci];
      });
    }
  };

  /** 영상 미확보 시 이미지 슬라이드로 대체 (작업지시서 S14 대체안) */
  el.fallback = (sch) => {
    if (el.dataset.fallback === '1') return;
    el.dataset.fallback = '1';
    if (video) video.remove();
    // 실제 영상이 아니면 "LIVE DEMO" 배지는 사실과 다르므로 제거한다
    if (badgeEl) badgeEl.remove();
    if (!slideEls.length) return;
    let i = 0;
    slideEls[0].classList.add('is-active');
    if (captions[0]) captionEl.textContent = captions[0];
    sch.every(4000, () => {
      slideEls[i].classList.remove('is-active');
      i = (i + 1) % slideEls.length;
      slideEls[i].classList.add('is-active');
      if (captions[i]) captionEl.textContent = captions[i];
    });
  };

  return el;
}

/* ---------------------------------------------------------------
   BgVideo — 화면 전체 배경 영상 레이어 (무음 루프 · 어둡게 눌러 콘텐츠 뒤에 깐다)
   실패(파일 없음 · 자동재생 차단) 시 조용히 제거되어 기존 배경으로 폴백된다.
   호출부에서 src 를 리터럴로 넘겨야 빌드 정적 스캔에 잡힌다.
   --------------------------------------------------------------- */
export function BgVideo(src, { opacity = 0.34, bright = false } = {}) {
  const video = h('video', {
    src, muted: true, loop: true, autoplay: true, playsInline: true, preload: 'auto',
  });
  video.setAttribute('muted', '');
  const el = h('div.bgvid', { style: { '--bgvid-opacity': String(opacity) } },
    video, h('div.bgvid__scrim'));
  if (bright) el.classList.add('bgvid--bright'); // 밝기 필터·스크림 완화

  el.play = (sch) => {
    let ok = false;
    const drop = () => el.remove();
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(drop);
    video.addEventListener('error', drop, { once: true });
    video.addEventListener('playing', () => { ok = true; el.classList.add('is-in'); }, { once: true });
    if (sch) sch.at(1600, () => { if (!ok) drop(); });
  };
  el.stop = () => { if (video.parentNode) video.pause(); };
  return el;
}

/* ---------------------------------------------------------------
   CTAButton — 골드 포인트 (S21 · S24)
   --------------------------------------------------------------- */
export function CTA(label, { solid = false, dir = 'up', style, onClick } = {}) {
  return rv(dir, `button.cta${solid ? '.cta--solid' : ''}`, {
    type: 'button',
    style,
    on: { click: (e) => { e.stopPropagation(); onClick && onClick(e); } },
  }, label, h('span.cta__arrow', '→'));
}

/* ---------------------------------------------------------------
   SourceFooter — 출처·각주 (14px / 60%)
   --------------------------------------------------------------- */
export function SourceFooter(text, { inline = false, dir = 'fade', style } = {}) {
  return rv(dir, `p.srcfoot${inline ? '.srcfoot--inline' : ''}`, { style }, text);
}

/* ---------------------------------------------------------------
   구조 다이어그램 조각
   --------------------------------------------------------------- */
export function DNode(title, sub, { accent = false, ghost = false, style, className } = {}) {
  const cls = ['node', accent && 'node--accent', ghost && 'node--ghost', className]
    .filter(Boolean).join('.');
  return h(`div.${cls}`, { style },
    h('div.node__title', title),
    sub && h('div.node__sub', sub)
  );
}

export function Arrow(glyph = '→', style) {
  return h('div.arrow', { style }, glyph);
}

export function SectionLabel(text, { dir = 'up', style } = {}) {
  return rv(dir, 'div.slabel', { style }, text);
}

export function BodyText(text, { lg = false, dir = 'up', style } = {}) {
  return rv(dir, `p.body-text${lg ? '.body-text--lg' : ''}`, { style }, text);
}

export { show, lit };
