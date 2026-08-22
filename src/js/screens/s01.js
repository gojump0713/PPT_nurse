/**
 * SCREEN 01 — 2028년 간호사 국시 CBT 전환
 * 타이포그래피 온리. 연도 → 사실 → 평가체계 변화의 3박자.
 * (발주 측 수정 지시 — 질문 2막 삭제 · 평가체계 변화 문구 추가 · 배경 영상 삽입)
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { BigNumber, Governing, SourceFooter, BgVideo } from '../components/index.js';

const meta = metaOf(1);

export function create() {
  // 빠르게 변화하는 교육환경 — 무드용 배경 영상 (경로는 리터럴로: 빌드 정적 스캔 대상)
  const bg = BgVideo('assets/video/bg-edu-change.mp4', { opacity: 0.55 });

  const num = BigNumber('2028', { reveal: false, gradient: true });
  const numWrap = h('div.s01__num', num);

  const sub = rv('up', 'p.s01__sub', '제68회 간호사 국가시험 · CBT 전환');
  const gov = Governing(meta.governing, { size: 'lg', center: true });
  const shift = rv('up', 'p.s01__shift',
    '기존 과목 중심 평가 ', h('span.s01__shift-arrow', '→'), ' 통합적 간호역량 중심 평가체계로 변화'
  );
  const lines = h('div.s01__lines', sub, gov, shift);

  const foot = SourceFooter([
    h('span.s01__foot-line', '한국보건의료인국가시험원, 2025년 11월 17일 발표'),
    h('span.s01__foot-line', '간호법 시행규칙 부칙, 2028년 1월 1일 이후 시험부터 새 과목체계 적용 명시'),
  ]);

  const stage = h('div.s01__stage', numWrap, lines);
  const el = ScreenRoot(meta, { header: false, className: 's01 has-bgvid' }, stage, foot);
  el.appendChild(bg); // 풀블리드 — body 패딩 밖까지 깔리도록 화면 루트에 붙인다


  return {
    el,
    enter(sch) {
      sch.at(0, () => bg.play(sch));
      // ① 어두운 배경에서 2028 페이드인 (1.2s)
      sch.at(60, () => numWrap.classList.add('is-in'));
      // ② 자동: 서브 텍스트  ③ 자동: 거버닝 메시지  ④ 자동: 평가체계 변화
      sch.at(1800, () => sub.classList.add('is-in'));
      sch.at(2800, () => gov.classList.add('is-in'));
      sch.at(3600, () => shift.classList.add('is-in'));
      sch.at(4200, () => foot.classList.add('is-in'));
    },
    leave() {
      bg.stop();
    },
    steps: [],
  };
}
