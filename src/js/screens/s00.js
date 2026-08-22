/**
 * SCREEN 00 (COVER) — 국시 시험도, 진료도 이제 ‘환경’이 경쟁력입니다
 *
 * 별도 사양서(표지.pdf) 기준 구현.
 *   §3  레이아웃: 상단 보조 카피 / 좌측 3줄 제목 / 서브타이틀 / 우하단 TILON
 *   §4  제목은 좌측 10~12%, 세로 중앙보다 약간 아래, 3줄
 *   §5  ‘환경’만 최대 크기(84~96px) — 나머지 64~72px. 시험·진료가 먼저, 0.5초 후 환경 강조
 *   §8  배경 영상 12~15초 무음 자동 루프
 *   §11 좌측 강한 / 우측 약한 Dark Gradient Overlay
 *   §12 진입 애니메이션: 0.0 영상 → 0.8 상단 → 1.2/1.5/1.9 제목 3행 → 2.4 서브 → 3.0 로고
 *   §13 클릭 0회
 *   §18 전환: 배경 Fade-out → ‘환경’만 남음 → 다음 화면(2028)
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { CONFIG } from '../../data/config.js';

const meta = metaOf(0);

export function create() {
  /* ---------- 배경 영상 (§8) ---------- */
  const video = h('video.cover__video', {
    src: CONFIG.coverVideo,
    muted: true, loop: true, autoplay: true, playsInline: true, preload: 'auto',
  });
  video.setAttribute('muted', '');

  // 영상 미확보 시 폴백: 정지 이미지 두 장을 아주 느리게 교차 (§17 "빠른 Cut" 금지)
  const fallback = h('div.cover__fallback',
    h('div.cover__fallback-a'),
    h('div.cover__fallback-b')
  );

  const stage = h('div.cover__bg', video, fallback, h('div.cover__scrim'));

  /* ---------- 상단 보조 카피 (§7) ---------- */
  const kicker = rv('down', 'div.cover__kicker', 'DIGITAL EDUCATION', h('em', '×'), 'DIGITAL HEALTHCARE');

  /* ---------- 제목 2행 ----------
     사양서 §4는 3행 + ‘환경’만 확대(§5)였으나, 발주 측 수정 지시에 따라
     2행 · 같은 폰트 · 같은 크기로 통일한다. ‘환경’은 크기 대신 색으로만 강조. */
  const line1 = rv('up', 'div.cover__line', '국시 ', h('b', '시험'), '도, ', h('b', '진료'), '도');
  const keyword = h('span.cover__keyword', '‘환경’');
  const line2 = rv('up', 'div.cover__line', '이제 ', keyword, '이 경쟁력입니다.');

  /* ---------- 서브타이틀 (§6) ---------- */
  const sub = rv('up', 'p.cover__sub',
    h('b', 'CBT'), '와 ', h('b', 'VDI'), '로 다시 설계하는', h('br'), '대학 · 병원의 디지털 전환'
  );

  /* ---------- 하단 보조 문구 (§14) ---------- */
  const hint = rv('fade', 'p.cover__hint',
    '시험을 보는 환경과 진료하는 환경, 디지털 전환의 경쟁력은 결국 ‘환경’에서 시작됩니다.'
  );

  /* ---------- 우하단 로고 (§3) ---------- */
  const logo = rv('fade', 'div.cover__logo',
    h('img', { src: 'assets/images/brand/tilon-ci.png', alt: 'TILON' })
  );

  const el = ScreenRoot(meta, { header: false, className: 'cover', pad: 'none' },
    stage,
    h('div.cover__content',
      kicker,
      h('div.cover__title', line1, line2),
      sub,
      hint
    ),
    logo
  );

  let usedFallback = false;
  const toFallback = () => {
    if (usedFallback) return;
    usedFallback = true;
    video.remove();
    el.classList.add('is-fallback');
    // 배지는 영상이 실제로 없을 때만 — 영상이 붙으면 아무 표시도 남지 않는다
    const badge = h('div.pending-badge', '표지 배경 영상 없음 — 정지 화면으로 대체 중');
    el.appendChild(badge);
  };

  const playVideo = (sch) => {
    if (!CONFIG.coverVideo) return toFallback();
    let playing = false;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(toFallback);
    video.addEventListener('error', toFallback, { once: true });
    video.addEventListener('playing', () => { playing = true; }, { once: true });
    sch.at(1400, () => { if (!playing) toFallback(); });
  };

  return {
    el,
    enter(sch) {
      // §12 진입 타임라인 — 클릭 없이 자동 실행
      sch.at(0, () => { stage.classList.add('is-in'); playVideo(sch); });
      sch.at(800, () => kicker.classList.add('is-in'));
      sch.at(1200, () => line1.classList.add('is-in'));
      sch.at(1600, () => line2.classList.add('is-in'));
      // §5 ‘환경’은 나머지보다 0.5초 늦게 — 크기는 같고 색으로만 강조
      sch.at(2100, () => keyword.classList.add('is-lit'));
      sch.at(2400, () => sub.classList.add('is-in'));
      sch.at(3000, () => logo.classList.add('is-in'));
      sch.at(3600, () => hint.classList.add('is-in'));
    },
    resume(sch) {
      sch.at(100, () => playVideo(sch));
    },
    /**
     * §18 다음 화면 전환: 배경이 Fade-out 되고 ‘환경’ 단어만 남은 채 SCREEN 01 의 2028 로 이어진다.
     * deck 이 화면을 제거하기까지의 600ms 안에 끝나도록 구성.
     */
    leave() {
      el.classList.add('is-exiting');
      if (video.parentNode) video.pause();
    },
    steps: [],
  };
}
