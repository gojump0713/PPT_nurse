/**
 * SCREEN 17 — 학생 — CBT 응시 ①
 * 실제 운영 화면 녹화본. 구현은 demo.js 공용 팩토리 참조.
 */

import { createDemo } from './demo.js';

export function create() {
  // 경로는 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  return createDemo(17, 'assets/video/demo-cbt-001.mp4', 'CBT 학생 화면 · 로그인부터 문항 풀이까지');
}