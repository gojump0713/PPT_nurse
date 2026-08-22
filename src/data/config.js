/**
 * config.js — 발표 전 교체가 필요한 항목의 스위치
 *
 * 작업지시서 PART C-D/E 에는 "매뉴얼 PDF 캡처", "영상 제작", "수치 재검증"처럼
 * 발표 전에 실물로 교체해야 하는 항목이 있다. 아직 교체되지 않은 자리에는
 * 화면에 눈에 띄는 배지를 띄워 두어, 리허설 때 반드시 확인하게 만든다.
 *
 * 교체가 끝나면 해당 플래그를 true 로 바꾸면 배지가 사라진다.
 */

export const CONFIG = {
  /** S03 · S10 · S14 — 제주대 매뉴얼 실제 화면 캡처로 교체 완료 여부 */
  assetsFinal: false,

  /** S14 — CBT 운영 데모 영상 경로. 파일을 넣고 경로를 지정하면 자동 재생된다. */
  demoVideo: 'assets/video/cbt-demo.mp4',

  /** SCREEN 00(표지) — 배경 루프 영상. 12~15초 무음. 없으면 정지 화면으로 폴백. */
  coverVideo: 'assets/video/cover-loop.mp4',

  /** S18 — 글로벌 병원 수치 재검증 완료 여부 (미완료 시 각주에 재검증 표기 유지) */
  globalFiguresVerified: false,

  /** S20 — 국내 구축 실적 수치 영업부서 확정 여부 */
  domesticFiguresConfirmed: false,

  /** S23 — 회사 연혁·인증 수치 확정 여부 */
  companyFiguresConfirmed: false,
};

/** 교체 대기 배지 — 발표 전 확인용 */
export function pendingBadge(text) {
  if (CONFIG.assetsFinal) return null;
  const el = document.createElement('div');
  el.className = 'pending-badge';
  el.textContent = text;
  return el;
}
