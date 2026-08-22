/**
 * SCREEN 35 — 틸론 브랜드 필름 (발주 측 수정 지시로 추가된 마지막 화면)
 * 로컬 mov 폴더에서 전달받은 brand-city.mp4 를 전체화면으로 재생한다.
 * 소리를 켠 채 재생을 시도하고, 정책상 차단되면 음소거로 폴백한다.
 * 영상이 끝나면 자동 반복 — Q&A 배경 화면으로 그대로 둘 수 있다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';

const meta = metaOf(35);

export function create() {
  // 경로는 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  const video = h('video.s35__video', {
    src: 'assets/video/brand-city.mp4',
    autoplay: true, loop: true, playsInline: true, preload: 'auto', controls: false,
  });

  const syncSoundBtn = () => {
    soundBtn.classList.toggle('is-on', !video.muted);
    soundBtn.firstChild.textContent = video.muted ? '🔇' : '🔊';
  };
  const soundBtn = h('button.s35__sound', {
    type: 'button',
    dataset: { noAdvance: '1' },
    title: '소리 켜기 / 끄기',
    on: {
      click: (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        syncSoundBtn();
      },
    },
  }, h('span', '🔊'), h('small', '소리'));

  const brand = rv('fade', 'div.s35__brand',
    h('img', { src: 'assets/images/brand/tilon-ci.png', alt: 'TILON' })
  );

  const el = ScreenRoot(meta, { header: false, className: 's35', pad: 'none' },
    video, h('div.s35__scrim'), brand, soundBtn
  );

  const play = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // 유음 자동재생이 차단된 경우 — 음소거로 폴백해 재생은 이어간다
        video.muted = true;
        syncSoundBtn();
        const p2 = video.play();
        if (p2 && typeof p2.catch === 'function') p2.catch(() => { /* 정지 상태 유지 */ });
      });
    }
  };

  return {
    el,
    enter(sch) {
      sch.at(0, play);
      sch.at(1200, () => brand.classList.add('is-in'));
    },
    resume(sch) {
      sch.at(100, play);
    },
    leave() {
      video.pause();
    },
    steps: [],
  };
}
