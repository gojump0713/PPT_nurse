/**
 * SCREEN 14 — 제주대 약학대학 CBT 운영 사례
 *
 * 실제 운영 현장 사진으로 교체(발주 측 제공). 목업/생성 이미지가 아니라
 * 실물이므로, 이 화면의 거버닝 메시지 「제안이 아니라, 이미 운영 중인 환경」이
 * 비로소 근거를 갖는다.
 *
 * 개인정보 처리: 원본에는 응시생 34명의 실명·학번이 모니터링 화면에 노출되어 있어
 * 해당 영역만 모자이크했다. "34대를 실시간 감시 중"이라는 구조는 그대로 남는다.
 * 상세는 docs/ASSETS.md 참조.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';

const meta = metaOf(14);

const SUMMARY = [
  { role: '교수', text: '출제부터 채점까지' },
  { role: '학생', text: '체험부터 제출까지' },
  { role: '시스템', text: '시험관리 + 가상환경 + 결과관리' },
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg', center: true });

  const photo = rv('scale', 'div.s14__photo',
    h('img', {
      src: 'assets/images/ref/jeju-pharm-cbt.webp',
      alt: '제주대학교 약학대학 CBT 운영 현장',
      loading: 'eager',
    })
  );

  const cards = SUMMARY.map((s) =>
    rv('up', 'div.s14__card',
      h('span.s14__card-role', s.role),
      h('span.s14__card-text', s.text)
    )
  );

  const caption = rv('fade', 'p.s14__caption',
    '제주대학교 약학대학 CBT 운영 현장 · 부정행위 감지 시 감독 교수 확인 절차 포함',
    h('span.s14__caption-note', '응시생 식별정보는 마스킹 처리')
  );

  const el = ScreenRoot(meta, { className: 's14' },
    gov,
    photo,
    h('div.s14__bottom', ...cards),
    caption
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => photo.classList.add('is-in'));
      sch.stagger(cards, (c) => c.classList.add('is-in'), { start: 1300, gap: 150 });
      sch.at(1900, () => caption.classList.add('is-in'));
    },
    steps: [],
  };
}
