/**
 * SCREEN 21 — 데이터 중앙화 VDI 업무환경
 * 분실 시나리오는 VDI를 체감시키는 가장 짧은 이야기. 발표자가 터뜨린다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(21);

const PATH = [
  { title: '사용자 단말', sub: 'PC · 노트북 · 씬클라이언트', icon: 'laptop' },
  { title: '인증', sub: '사용자 · 단말 · 정책', icon: 'lock' },
  { title: '가상 업무환경', sub: '표준 데스크톱 이미지', icon: 'cloud' },
  { title: 'EMR · PACS · 업무시스템', sub: '데이터는 중앙에만', icon: 'server' },
];

const EFFECTS = [
  '데이터 중앙관리', '단말 저장 최소화', '접근통제', '표준 업무환경',
  'SW · 패치 중앙관리', '장애대응', '업무연속성',
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  const stepEls = PATH.map((p, i) =>
    h('div.s21__step', { dataset: { i: String(i) } },
      h('span.s21__step-no', String(i + 1).padStart(2, '0')),
      icons[p.icon]({ size: 40, className: 's21__step-icon' }),
      h('div.s21__step-title', p.title),
      h('div.s21__step-sub', p.sub),
      i === 0 ? h('div.s21__lost', h('span.s21__lost-x', '✕'), h('span', '분실')) : null
    )
  );

  const links = [0, 1, 2].map(() => h('div.s21__link', h('span')));
  const chain = h('div.s21__chain',
    ...stepEls.flatMap((s, i) => (i > 0 ? [links[i - 1], s] : [s]))
  );

  const effectEls = EFFECTS.map((t, i) =>
    h('div.s21__effect', h('span.s21__effect-no', String(i + 1)), t)
  );
  const effects = h('div.s21__effects', ...effectEls);

  // 1막 중간 삽입 문구 (발주 측 수정 지시) — 분실 시나리오(클릭) 재생 시 사라진다
  const insight = h('div.s21__insight',
    h('p.s21__insight-lead',
      'VDI는 ', h('em', '‘원격접속 기술’'), '이 아니라 의료정보를 중앙에 두고 사용하는 업무환경 기술입니다.'
    ),
    h('p.s21__insight-sub',
      '사람을 믿지 않는 보안이 아니라, 사람이 실수해도 데이터를 보호할 수 있는 환경을 만드는 것'
    )
  );

  const verdict = h('div.s21__verdict',
    icons.shieldCheck({ size: 34, className: 's21__verdict-icon' }),
    h('div',
      h('div.s21__verdict-title', '단말 분실 — 유출될 데이터 없음'),
      h('div.s21__verdict-sub', '문서 · 영상 · 환자정보는 단말이 아니라 중앙에 있습니다')
    )
  );

  const el = ScreenRoot(meta, { className: 's21' },
    gov,
    // 삽입 문구와 분실 판정 배지는 같은 자리를 나눠 쓴다 (1막 = 문구 · 클릭 후 = 배지)
    rv('up', 'div.s21__body', chain, h('div.s21__swap', insight, verdict)),
    effects
  );

  const body = el.querySelector('.s21__body');

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => body.classList.add('is-in'));
      // 4단계 순차 점등 (0.5s 간격)
      stepEls.forEach((s, i) => {
        sch.at(1000 + i * 500, () => {
          s.classList.add('is-lit');
          if (i > 0) links[i - 1].classList.add('is-lit');
        });
      });
      // 1막 삽입 문구 → 효과 7개 태그 등장
      sch.at(3100, () => insight.classList.add('is-in'));
      sch.stagger(effectEls, (e) => e.classList.add('is-in'), { start: 3300, gap: 120 });
    },
    steps: [
      // 클릭 1회: 단말 분실 시나리오 재생 (2s)
      (sch) => {
        el.classList.add('is-lost');
        sch.at(1200, () => el.classList.add('is-safe'));
      },
    ],
  };
}
