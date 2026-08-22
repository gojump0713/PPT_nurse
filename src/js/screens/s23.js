/**
 * SCREEN 23 — VDI 5개 기능의 진료 효과 전환
 * 플립은 "번역"이라는 행위의 물리적 은유. 자동 순차 진행.
 */

import { h } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, FlipCard, BgVideo } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(23);

const CARDS = [
  { front: 'VDI', back: '장소가 달라도 같은 업무환경', icon: 'monitor' },
  { front: '중앙관리', back: 'PC를 한 대씩 관리하지 않는 운영', icon: 'gear' },
  { front: '접근통제', back: '필요한 사람에게 필요한 정보만', icon: 'lock' },
  { front: '데이터 중앙화', back: '환자정보의 단말 저장 위험 감소', icon: 'server' },
  { front: 'DR', back: '장애 상황에서도 진료 지속', icon: 'shield' },
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg', center: true });

  const cards = CARDS.map((c) =>
    FlipCard({
      front: c.front,
      back: c.back,
      icon: icons[c.icon]({ size: 44, className: 'flip__icon' }),
    })
  );

  const row = h('div.s23__row', ...cards);

  const hint = h('p.s23__hint', '카드에 마우스를 올리면 기술 용어를 다시 확인할 수 있습니다 (Q&A용)');

  // 하단 삽입 문구 (발주 측 수정 지시)
  const closing = h('p.s23__closing', '의료진이 진료에 집중할 수 있는 환경을 제공해 드립니다.');

  // 병원 무드 배경 영상 — 튀지 않게 저채도·저투명 (경로 리터럴 유지)
  const bg = BgVideo('assets/video/bg-hospital.mp4', { opacity: 0.24 });

  const el = ScreenRoot(meta, { className: 's23 has-bgvid' }, gov, row, closing, hint);
  el.appendChild(bg);

  return {
    el,
    enter(sch) {
      sch.at(0, () => { el.headerEl.classList.add('is-in'); bg.play(sch); });
      sch.at(400, () => gov.classList.add('is-in'));
      sch.stagger(cards, (c) => c.classList.add('is-in'), { start: 800, gap: 130 });
      // 좌측부터 0.8s 간격 순차 플립
      sch.stagger(cards, (c) => c.flip(), { start: 1700, gap: 800 });
      // 플립 완료 후 하단 문구 + 거버닝 메시지 최종 강조 펄스
      sch.at(1700 + 800 * cards.length + 300, () => {
        gov.classList.add('is-pulse');
        closing.classList.add('is-in');
        hint.classList.add('is-in');
      });
      sch.at(1700 + 800 * cards.length + 1500, () => gov.classList.remove('is-pulse'));
    },
    leave() {
      bg.stop();
    },
    steps: [],
  };
}
