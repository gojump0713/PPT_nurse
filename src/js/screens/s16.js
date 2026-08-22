/**
 * SCREEN 16 — 교수 — 문제 배포
 * 실제 운영 화면 녹화본. 구현은 demo.js 공용 팩토리 참조.
 */

import { createDemo } from './demo.js';

export function create() {
  // 경로는 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  return createDemo(16, 'assets/video/demo-prof-deploy.mp4', 'CBT 교수 화면 · 시험을 구성하고 응시자에게 배포하는 실제 과정');
}