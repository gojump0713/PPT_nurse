/**
 * SCREEN 18 — 학생 — CBT 응시 ②
 * 실제 운영 화면 녹화본. 구현은 demo.js 공용 팩토리 참조.
 */

import { createDemo } from './demo.js';

export function create() {
  // 경로는 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  return createDemo(18, 'assets/video/demo-cbt-002.mp4', 'CBT 학생 화면 · 검토와 최종 제출까지');
}