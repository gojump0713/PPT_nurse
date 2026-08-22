/**
 * SCREEN 14 — 제주대 약학대학 CBT 운영 사례
 * 실제 구동 영상보다 강한 증거는 없다. 클릭·연출을 걷어내 "실물"에 집중.
 * 영상 미확보 시 학생 매뉴얼 캡처 3장 자동 슬라이드로 대체된다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, VideoPlayer } from '../components/index.js';
import { CbtStudentMock } from '../components/mocks.js';
import { CONFIG, pendingBadge } from '../../data/config.js';

const meta = metaOf(14);

const SUMMARY = [
  { role: '교수', text: '출제부터 채점까지' },
  { role: '학생', text: '체험부터 제출까지' },
  { role: '시스템', text: '시험관리 + 가상환경 + 결과관리' },
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg', center: true });

  // 영상 미확보 시 폴백: 학생 매뉴얼 캡처 3장에 대응하는 목업 3화면
  const slides = [
    h('div.s14__frame', CbtStudentMock({ variant: 'tutorial' })),
    h('div.s14__frame', CbtStudentMock({ variant: 'solve' })),
    h('div.s14__frame', CbtStudentMock({ variant: 'submit' })),
  ];

  const player = VideoPlayer({
    src: CONFIG.demoVideo,
    slides,
    captions: ['체험', '응시', '제출', '채점'].map((c, i, arr) => `${arr.join(' → ')}   ·   지금: ${c}`),
    badge: 'LIVE DEMO',
  });

  const badge = pendingBadge('CBT 운영 데모 영상 제작 예정 — 현재는 대체 화면');
  if (badge) player.appendChild(badge);

  const cards = SUMMARY.map((s) =>
    rv('up', 'div.s14__card',
      h('span.s14__card-role', s.role),
      h('span.s14__card-text', s.text)
    )
  );

  const caption = rv('fade', 'p.s14__caption', '제주대학교 × TILON — 학생 · 교수용 CBT 매뉴얼 기반');

  const el = ScreenRoot(meta, { className: 's14' },
    gov,
    rv('scale', 'div.s14__stage', player),
    h('div.s14__bottom', ...cards),
    caption
  );

  const stage = el.querySelector('.s14__stage');

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => stage.classList.add('is-in'));
      sch.at(900, () => player.play(sch));
      sch.stagger(cards, (c) => c.classList.add('is-in'), { start: 1300, gap: 150 });
      sch.at(1900, () => caption.classList.add('is-in'));
    },
    resume(sch) {
      sch.at(100, () => player.play(sch));
    },
    leave() {
      if (player.videoEl) player.videoEl.pause();
    },
    steps: [],
  };
}
