/**
 * anim.js — 애니메이션 유틸
 * 화면 이탈 시 예약된 모든 타이머·rAF가 확실히 취소되도록 Scheduler 로 일원화한다.
 * (같은 화면을 다시 방문하면 연출이 처음부터 재생되어야 하기 때문)
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** ease-out cubic — 작업지시서의 "ease-out 통일" 원칙 */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export class Scheduler {
  /**
   * @param {{instant?: boolean}} opts
   *   instant: 뒤로 이동 시 "이미 진행된 상태"를 즉시 복원하기 위한 모드.
   *   예약된 콜백을 시간 순으로 정렬해 한 번에 실행한다.
   */
  constructor({ instant = false } = {}) {
    this.timers = new Set();
    this.rafs = new Set();
    this.intervals = new Set();
    this.killed = false;
    this.instant = instant;
    this.queue = [];
    this.seq = 0;
  }

  /** ms 후 1회 실행 */
  at(ms, fn) {
    if (this.killed) return;
    if (this.instant) {
      this.queue.push({ ms, seq: this.seq++, fn });
      return;
    }
    if (REDUCED) ms = Math.min(ms, 120);
    const id = setTimeout(() => {
      this.timers.delete(id);
      if (!this.killed) fn();
    }, ms);
    this.timers.add(id);
    return id;
  }

  /** instant 모드에서 예약분을 시간 순으로 실행 (중첩 예약은 라운드 반복으로 처리) */
  flush() {
    if (!this.instant) return;
    for (let round = 0; round < 12 && this.queue.length; round += 1) {
      const batch = this.queue.sort((a, b) => a.ms - b.ms || a.seq - b.seq);
      this.queue = [];
      batch.forEach(({ fn }) => {
        if (!this.killed) fn();
      });
    }
    this.queue = [];
  }

  /** 연속 실행: start 부터 gap 간격으로 items 를 순회 */
  stagger(items, fn, { start = 0, gap = 150 } = {}) {
    items.forEach((item, i) => this.at(start + gap * i, () => fn(item, i)));
    return start + gap * Math.max(0, items.length - 1);
  }

  /** 반복 실행 */
  every(ms, fn) {
    if (this.killed || this.instant) return;
    const id = setInterval(() => {
      if (this.killed) return clearInterval(id);
      fn();
    }, ms);
    this.intervals.add(id);
    return id;
  }

  raf(fn) {
    if (this.killed) return;
    const id = requestAnimationFrame((t) => {
      this.rafs.delete(id);
      if (!this.killed) fn(t);
    });
    this.rafs.add(id);
    return id;
  }

  /** duration 동안 0→1 진행값을 콜백으로 전달 */
  tween(duration, onUpdate, { ease = easeOutCubic, onDone } = {}) {
    if (this.killed) return;
    if (REDUCED || this.instant) {
      onUpdate(1);
      onDone && onDone();
      return;
    }
    const t0 = performance.now();
    const step = (now) => {
      if (this.killed) return;
      const raw = Math.min(1, (now - t0) / duration);
      onUpdate(ease(raw), raw);
      if (raw < 1) this.raf(step);
      else onDone && onDone();
    };
    this.raf(step);
  }

  clear() {
    this.killed = true;
    this.timers.forEach(clearTimeout);
    this.intervals.forEach(clearInterval);
    this.rafs.forEach(cancelAnimationFrame);
    this.timers.clear();
    this.intervals.clear();
    this.rafs.clear();
  }
}

/** 요소 등장 */
export function show(el) {
  if (el) el.classList.add('is-in');
}
export function hide(el) {
  if (el) el.classList.remove('is-in');
}
export function lit(el, on = true) {
  if (el) el.classList.toggle('is-lit', on);
}

/**
 * .rv 요소들을 순차 등장시킨다.
 * 작업지시서 §2: 제목(0s) → 거버닝(0.4s) → 본문(0.8s~, 0.15s 간격)
 */
export function revealSeq(scheduler, nodes, { start = 0, gap = 150 } = {}) {
  const list = nodes.filter(Boolean);
  return scheduler.stagger(list, (el) => show(el), { start, gap });
}

/** 숫자 카운트업/다운 */
export function countTo(scheduler, el, { from = 0, to = 0, duration = 1500, format, ease = easeOutCubic } = {}) {
  const fmt = format || ((v) => Math.round(v).toLocaleString('ko-KR'));
  el.textContent = fmt(from);
  scheduler.tween(
    duration,
    (p) => { el.textContent = fmt(from + (to - from) * p); },
    { ease, onDone: () => { el.textContent = fmt(to); } }
  );
}

/** SVG path 드로잉 */
export function drawPath(scheduler, path, { duration = 900, delay = 0 } = {}) {
  const len = path.getTotalLength();
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  scheduler.at(delay, () => {
    path.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(.16,.84,.44,1)`;
    path.style.strokeDashoffset = '0';
  });
}

export const prefersReducedMotion = REDUCED;
