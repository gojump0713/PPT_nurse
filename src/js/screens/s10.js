/**
 * SCREEN 10 — 문제은행 기반 교수 업무 전환
 * 자동 캐러셀. 발표자가 클릭에 신경 쓰지 않도록 0회.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, SourceFooter } from '../components/index.js';
import { CbtProfessorMock, profCaption, PROF_VIEW_KEYS } from '../components/mocks.js';
import { pendingBadge } from '../../data/config.js';

const meta = metaOf(10);

const TAGS = [
  '문제은행 관리', '기존 문항 재활용', '카테고리 관리', '시험 구성·등록',
  '자동채점', '시험 이력', '학생별 결과', '문항별 분석',
];

/** 슬라이드별로 점등할 태그 인덱스 */
const TAG_MAP = {
  bank: [0, 2],
  create: [1, 0],
  exam: [3, 5],
  score: [4, 6, 7],
};

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const slides = PROF_VIEW_KEYS.map((k, i) =>
    h(`div.s10__slide${i === 0 ? '.is-active' : ''}`, { dataset: { view: k } }, CbtProfessorMock(k))
  );

  // 캡션은 현재 보고 있는 화면 이름만 남긴다.
  // (기관명·"실제 업무 화면" 문구는 발주 측 지시로 삭제)
  const captionEl = h('div.s10__caption', h('strong', profCaption(PROF_VIEW_KEYS[0])));

  const dots = PROF_VIEW_KEYS.map((_, i) => h(`span.s10__dot${i === 0 ? '.is-on' : ''}`));

  const badge = pendingBadge('매뉴얼 캡처 교체 예정');
  const viewer = rv('up', 'div.s10__viewer', ...slides, badge, h('div.s10__dots', ...dots));

  const tagEls = TAGS.map((t) => h('li.s10__tag', h('span.s10__tag-dot'), t));
  const tagList = rv('left', 'ul.s10__tags',
    h('li.s10__tags-head', '교수자 기능 8가지'),
    ...tagEls
  );

  const foot = SourceFooter('쌓인 시험 문항과 각종 데이터는, 시험이 끝나도 사라지지 않습니다.');

  const el = ScreenRoot(meta, { className: 's10' },
    gov,
    h('div.s10__body', h('div.s10__left', viewer, captionEl), tagList),
    foot
  );

  let index = 0;
  const showSlide = (i) => {
    index = i % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === index));
    const key = PROF_VIEW_KEYS[index];
    captionEl.firstElementChild.textContent = profCaption(key);
    const on = new Set(TAG_MAP[key] || []);
    tagEls.forEach((t, k) => t.classList.toggle('is-lit', on.has(k)));
  };

  const startCarousel = (sch) => {
    showSlide(0);
    // 발주 측 수정 지시 — 화면(막) 전환을 기존 4초보다 1.5배 빠르게
    sch.every(2667, () => showSlide(index + 1));
  };

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(800, () => {
        viewer.classList.add('is-in');
        tagList.classList.add('is-in');
        captionEl.classList.add('is-in');
      });
      sch.at(1200, () => startCarousel(sch));
      sch.at(1600, () => foot.classList.add('is-in'));
    },
    resume(sch) {
      // 뒤로 이동으로 복원된 경우에도 캐러셀은 계속 돈다
      sch.at(200, () => startCarousel(sch));
    },
    steps: [],
  };
}
