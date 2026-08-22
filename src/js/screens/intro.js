/**
 * INTRO — 표지 앞 오프닝 영상 (SCREEN 번호 밖)
 *
 * 발주 측 제공 컷 8편(각 6초)을 이어서 자동 재생하고, 8번째가 끝나면 1번으로 돌아가
 * 무한 반복한다. 청중 입장 시간에 틀어 두는 어트랙트 루프 역할.
 *
 * 하나의 <video> 로 src 를 바꿔가며 재생한다. 8개를 동시에 띄우면 디코더를 8개
 * 물게 되어 발표용 노트북에서 불안정하다. 대신 다음 컷을 미리 프리로드해
 * 컷 사이가 끊기지 않게 한다.
 */

import { h } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';

const meta = metaOf(-1);

/** 재생 순서. 경로는 리터럴이어야 빌드 정적 스캔에 잡힌다. */
export const INTRO_CUTS = [
  'assets/video/intro-cut1.mp4',
  'assets/video/intro-cut2.mp4',
  'assets/video/intro-cut3.mp4',
  'assets/video/intro-cut4.mp4',
  'assets/video/intro-cut5.mp4',
  'assets/video/intro-cut6.mp4',
  'assets/video/intro-cut7.mp4',
  'assets/video/intro-cut8.mp4',
];

export function create() {
  // 컷 전환 시 검은 화면이 스치지 않도록 두 장을 교차시킨다
  const vA = h('video.intro__video.is-front', { muted: true, playsInline: true, preload: 'auto' });
  const vB = h('video.intro__video', { muted: true, playsInline: true, preload: 'auto' });
  [vA, vB].forEach((v) => v.setAttribute('muted', ''));

  const dots = INTRO_CUTS.map(() => h('span.intro__dot'));
  const hint = h('div.intro__hint', '클릭하면 발표를 시작합니다');

  const el = ScreenRoot(meta, { header: false, className: 'intro', pad: 'none' },
    h('div.intro__stage', vA, vB),
    h('div.intro__dots', ...dots),
    hint
  );

  let idx = 0;
  let front = vA;
  let back = vB;
  let stopped = false;

  const mark = () => dots.forEach((d, i) => d.classList.toggle('is-on', i === idx));

  const playNext = () => {
    if (stopped) return;
    const next = (idx + 1) % INTRO_CUTS.length;
    back.src = INTRO_CUTS[next];
    back.load();

    const swap = () => {
      if (stopped) return;
      idx = next;
      mark();
      back.classList.add('is-front');
      front.classList.remove('is-front');
      const p = back.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
      const tmp = front;
      front = back;
      back = tmp;
      front.addEventListener('ended', playNext, { once: true });
    };

    // 다음 컷이 재생 가능한 시점에 교체
    if (back.readyState >= 3) swap();
    else back.addEventListener('canplay', swap, { once: true });
  };

  const start = () => {
    stopped = false;
    idx = 0;
    mark();
    front.src = INTRO_CUTS[0];
    front.load();
    const p = front.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    front.addEventListener('ended', playNext, { once: true });
  };

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.classList.add('is-in'));
      sch.at(60, start);
      sch.at(4000, () => hint.classList.add('is-in'));
    },
    resume(sch) {
      sch.at(80, start);
    },
    leave() {
      stopped = true;
      vA.pause();
      vB.pause();
    },
    steps: [],
  };
}
