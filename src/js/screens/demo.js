/**
 * demo.js — CBT 실제 구동 영상 화면 공용 팩토리 (SCREEN 15 ~ 18)
 *
 * 발주 측이 전달한 실제 운영 화면 녹화본을 한 편씩 배치한다.
 * 자동 재생 · 반복 없음. 브라우저 정책상 자동재생은 무음이어야 하므로
 * 음소거로 시작하되, 발표자가 필요하면 우하단 버튼으로 소리를 켤 수 있게 한다.
 * (자막이 영상에 박혀 있어 무음으로도 내용 전달에는 지장이 없다)
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';

/**
 * @param {number} id      SCREEN 번호
 * @param {string} src     영상 경로 — 빌드 정적 스캔을 위해 호출부에서 리터럴로 넘긴다
 * @param {string} caption 화면 하단 캡션
 */
export function createDemo(id, src, caption) {
  const meta = metaOf(id);

  const video = h('video.demo__video', {
    src,
    muted: true,
    autoplay: true,
    playsInline: true,
    preload: 'auto',
    controls: false,
  });
  video.setAttribute('muted', '');
  video.loop = false; // 반복 없음

  const progress = h('div.demo__progress-fill');
  const timeEl = h('span.demo__time', '0:00');
  const endBadge = h('div.demo__end', '재생 완료');

  const soundBtn = h('button.demo__sound', {
    type: 'button',
    dataset: { noAdvance: '1' },
    title: '소리 켜기 / 끄기',
    on: {
      click: (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        soundBtn.classList.toggle('is-on', !video.muted);
        soundBtn.firstChild.textContent = video.muted ? '🔇' : '🔊';
      },
    },
  }, h('span', '🔇'), h('small', '소리'));

  const stage = rv('scale', 'div.demo__stage',
    video,
    h('div.demo__bar',
      h('div.demo__progress', progress),
      timeEl
    ),
    endBadge,
    soundBtn
  );

  const cap = rv('fade', 'p.demo__caption', caption);

  const el = ScreenRoot(meta, { className: 'demo' },
    stage,
    cap
  );

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const onTime = () => {
    if (!video.duration) return;
    progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
    timeEl.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
  };
  const onEnd = () => el.classList.add('is-ended');

  const play = () => {
    el.classList.remove('is-ended');
    try { video.currentTime = 0; } catch { /* 아직 메타데이터 전 */ }
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => { /* 정책상 차단되면 정지 상태 유지 */ });
  };

  video.addEventListener('timeupdate', onTime);
  video.addEventListener('loadedmetadata', onTime);
  video.addEventListener('ended', onEnd);

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(260, () => stage.classList.add('is-in'));
      sch.at(400, play);
      sch.at(900, () => cap.classList.add('is-in'));
    },
    resume(sch) {
      sch.at(120, play);
    },
    leave() {
      video.pause();
    },
    steps: [],
  };
}
