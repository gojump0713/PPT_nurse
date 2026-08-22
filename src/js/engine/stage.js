/**
 * stage.js — 1920×1080 고정 스테이지의 transform:scale() 반응 축소 (§1)
 * 16:9 비율을 항상 유지하고, 화면비가 다르면 레터박스로 남긴다.
 */

const BASE_W = 1920;
const BASE_H = 1080;

export function mountStage(stageEl) {
  const apply = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / BASE_W, vh / BASE_H);
    stageEl.style.transform = `scale(${scale})`;
  };

  apply();
  window.addEventListener('resize', apply, { passive: true });
  window.addEventListener('orientationchange', apply);
  if (document.fullscreenEnabled) {
    document.addEventListener('fullscreenchange', () => setTimeout(apply, 60));
  }
  return apply;
}

export async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    /* 사용자 제스처 없이 호출된 경우 등 — 무시 */
  }
}
