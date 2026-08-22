/**
 * SCREEN 28 — 주요 구축사례 · 중앙대학교병원
 * 발주 측 제공 슬라이드를 한 장으로 배치한다. 구현은 case.js 공용 팩토리 참조.
 */

import { createCase } from './case.js';

export function create() {
  // 경로는 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  return createCase(28, 'assets/images/ref/case-cauh.webp');
}