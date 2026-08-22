/**
 * deck.js — 프레젠테이션 코어
 *
 * 책임
 *  - 화면 생성/파괴 (같은 화면 재방문 시 연출이 처음부터 재생되도록 매번 새로 만든다)
 *  - 페이지 전환 (기본 0.6s / PART 브리지 1.2s)
 *  - 스텝(클릭) 진행 관리
 *  - PART 컬러 스와핑
 */

import { Scheduler } from '../lib/anim.js';
import { META, PARTS } from '../../data/screens.js';

/**
 * PART 브리지: 1.2초 전용 전환을 쓰는 "출발 화면 번호" (§2)
 *   18 → 19 (CBT → VDI),  31 → 32 (VDI → TILON)
 * 배열 인덱스가 아니라 SCREEN 번호로 판정한다. 표지·구축사례가 끼어들면서
 * 인덱스가 밀려도 흔들리지 않게 하기 위함.
 */
const BRIDGE_FROM = new Set([18, 31]);

export class Deck {
  /**
   * @param {HTMLElement} stage  #stage
   * @param {Array} modules      화면 모듈 배열 (index 0 == SCREEN 01)
   */
  constructor(stage, modules) {
    this.stage = stage;
    this.modules = modules;
    this.index = 0;
    this.step = 0;
    this.instance = null;
    this.sch = new Scheduler();
    this.busy = false;
    this.listeners = new Set();
  }

  get meta() {
    return META[this.index];
  }
  get part() {
    return PARTS[this.meta.part];
  }
  get total() {
    return META.length;
  }
  get stepsLeft() {
    const total = this.instance ? this.instance.steps.length : 0;
    return Math.max(0, total - this.step);
  }
  get stepsTotal() {
    return this.instance ? this.instance.steps.length : 0;
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  emit() {
    this.listeners.forEach((fn) => fn(this));
  }

  /* --------------------------------------------------------- */

  /**
   * @param {number} index
   * @param {{steps?: number, immediate?: boolean, direction?: 1|-1}} opts
   *   steps: 진입 직후 즉시 소비할 스텝 수 (뒤로 이동 시 "완료된 상태"로 복원)
   */
  goTo(index, opts = {}) {
    const target = Math.max(0, Math.min(this.total - 1, index));
    const { steps = 0, immediate = false } = opts;
    if (this.busy && !immediate) return;

    const fromIndex = this.index;
    const prev = this.instance;
    const isBridge =
      !immediate &&
      prev !== null &&
      target === fromIndex + 1 &&
      BRIDGE_FROM.has(META[fromIndex].id);

    // 이전 화면 정리
    this.sch.clear();
    if (prev) {
      if (prev.leave) prev.leave();
      const el = prev.el;
      el.classList.remove('is-active');
      el.classList.add(isBridge ? 'is-bridge-out' : 'is-leaving');
      const wait = isBridge ? 1200 : 600;
      setTimeout(() => el.remove(), wait);
    }

    this.index = target;
    this.step = 0;
    this.sch = new Scheduler();

    // PART 컬러 스와핑
    document.body.dataset.part = this.meta.part;

    // 새 화면 생성
    const mod = this.modules[target];
    const inst = mod.create({ deck: this });
    inst.steps = inst.steps || [];
    this.instance = inst;
    if (isBridge) inst.el.classList.add('is-bridge-in');
    this.stage.appendChild(inst.el);

    // 강제 리플로우 후 활성화 → transition 이 확실히 걸리도록
    void inst.el.offsetWidth;
    inst.el.classList.add('is-active');

    this.busy = true;
    setTimeout(() => { this.busy = false; }, isBridge ? 900 : 380);

    // 진입 연출
    if (steps > 0) {
      // 뒤로 이동: 즉시 완료 상태로 복원
      const fast = new Scheduler({ instant: true });
      if (inst.enter) inst.enter(fast);
      for (let i = 0; i < Math.min(steps, inst.steps.length); i += 1) {
        inst.steps[i](fast);
        this.step = i + 1;
      }
      fast.flush();
      fast.clear();
      // 복원 이후에도 자동 연출(캐러셀 등)이 계속 돌아야 하므로 루프성 항목만 다시 붙인다
      if (inst.resume) inst.resume(this.sch);
    } else if (inst.enter) {
      inst.enter(this.sch);
    }

    this.emit();
  }

  /** → / Space / 클릭 : 다음 스텝 또는 다음 페이지 */
  next() {
    const inst = this.instance;
    if (inst && this.step < inst.steps.length) {
      inst.steps[this.step](this.sch);
      this.step += 1;
      this.emit();
      return;
    }
    if (this.index < this.total - 1) this.goTo(this.index + 1);
  }

  /** ← : 스텝이 소비되었으면 한 스텝 되돌리고, 아니면 이전 페이지(완료 상태) */
  prev() {
    if (this.step > 0) {
      this.goTo(this.index, { steps: this.step - 1, immediate: true });
      return;
    }
    if (this.index > 0) {
      const prevMeta = META[this.index - 1];
      this.goTo(this.index - 1, { steps: prevMeta.clicks });
    }
  }

  first() { this.goTo(0); }
  last() { this.goTo(this.total - 1); }

  /**
   * SCREEN 번호로 점프. 0 = 표지, 1~34 = 본편.
   * 배열 맨 앞에 인트로(id -1)가 있으므로 인덱스는 번호 + 1 이다.
   */
  jump(pageNo) {
    const n = Number(pageNo);
    const i = Math.max(0, Math.min(this.total - 1, (Number.isFinite(n) ? n : 0) + 1));
    this.goTo(i, { immediate: true });
  }
}
