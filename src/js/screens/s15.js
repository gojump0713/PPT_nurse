/**
 * SCREEN 15 — 교수 — 문제 등록
 * 실제 운영 화면 녹화본. 구현은 demo.js 공용 팩토리 참조.
 */

import { createDemo } from './demo.js';

export function create() {
  // 경로는 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  return createDemo(15, 'assets/video/demo-prof-register.mp4', 'CBT 교수 화면 · 문제은행에 신규 문항을 등록하는 실제 과정');
}