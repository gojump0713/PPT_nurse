/**
 * case.js — 구축사례 이미지 화면 공용 팩토리 (SCREEN 21 ~ 26)
 *
 * 발주 측이 전달한 기존 「주요 구축사례」 슬라이드 6장을 한 장씩 배치한다.
 * 슬라이드가 이미 완성된 16:9 디자인(밝은 톤)이라 별도 레이아웃을 얹지 않고
 * 스테이지에 full-bleed 로 깐다. 다만 이 덱의 UI(페이지 인디케이터 등)는
 * 밝은 배경 위에서 안 보이므로, 우하단에만 얇은 스크림을 깔아 가독성을 지킨다.
 *
 * S20(의료기관 26곳 실적) 바로 뒤에 놓여 "숫자 → 실제 사례"로 이어진다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';

/** SCREEN id → 이미지 파일 */
export const CASE_IMAGES = {
  21: 'assets/images/ref/case-hira.webp',
  22: 'assets/images/ref/case-gilhospital.webp',
  23: 'assets/images/ref/case-ilsan.webp',
  24: 'assets/images/ref/case-cauh.webp',
  25: 'assets/images/ref/case-seongnam.webp',
  26: 'assets/images/ref/case-myongji.webp',
};

/**
 * @param {number} id  SCREEN 번호 (21~26)
 * @param {string} src 이미지 경로 — 빌드가 정적 스캔하므로 호출부에서 리터럴로 넘긴다
 */
export function createCase(id, src) {
  const meta = metaOf(id);

  const img = h('img.case__img', { src, alt: meta.title, loading: 'eager' });
  const frame = rv('scale', 'div.case__frame', img);

  const el = ScreenRoot(meta, { header: false, className: 'case', pad: 'none' },
    frame,
    h('div.case__scrim')
  );

  return {
    el,
    enter(sch) {
      sch.at(60, () => frame.classList.add('is-in'));
    },
    steps: [],
  };
}
