/**
 * SCREEN 33 — 가상화 원천기술 25년, 틸론
 * 시간의 길이는 선의 길이로 전달한다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, BigNumber } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(33);

const ERAS = [
  { year: '2001', label: '창업', sub: '가상화 원천기술 자체 개발 시작' },
  { year: '기술 축적', label: '가상화 · VDI · DaaS · 클라우드 · 보안', sub: '공공 · 금융 · 교육 · 의료 · 기업 적용' },
  { year: '현재', label: 'AI · GPU 인프라 · Web3', sub: '축적된 기반 위의 확장', now: true },
];

const INDUSTRIES = [
  { name: '공공', icon: 'bank' },
  { name: '금융', icon: 'chart' },
  { name: '교육', icon: 'monitor' },
  { name: '의료', icon: 'stethoscope' },
  { name: '기업', icon: 'building' },
];

const PRODUCTS = [
  { name: 'Dstation', desc: 'VDI · 가상 데스크톱 인프라' },
  { name: 'TILON ABT', desc: 'AI 기반 CBT 평가 플랫폼' },
];

export function create() {
  const gov = Governing(meta.governing, { size: 'sm' });

  const big = BigNumber(0, { size: 'sm', unit: '년', reveal: false, accent: true });
  const numPanel = rv('up', 'div.s33__num',
    h('div.s33__num-label', '가상화 원천기술'),
    big,
    h('img.s33__ci', { src: 'assets/images/brand/tilon-ci.png', alt: 'TILON' })
  );

  const eraEls = ERAS.map((e) =>
    h(`div.s33__era${e.now ? '.is-now' : ''}`,
      h('span.s33__era-dot'),
      h('div.s33__era-year', e.year),
      h('div.s33__era-label', e.label),
      h('div.s33__era-sub', e.sub)
    )
  );
  const line = h('span.s33__line');
  const timeline = h('div.s33__timeline', line, h('div.s33__eras', ...eraEls));

  const indEls = INDUSTRIES.map((i) =>
    h('div.s33__ind', icons[i.icon]({ size: 30, className: 's33__ind-icon' }), i.name)
  );
  const inds = h('div.s33__inds', ...indEls);

  const prodEls = PRODUCTS.map((p) =>
    h('div.s33__prod',
      h('span.s33__prod-name', p.name),
      h('span.s33__prod-desc', p.desc)
    )
  );
  const prods = h('div.s33__prods', ...prodEls);

  // 발주 측 수정 지시 — 확인 필요 문구 삭제, 회사소개 웹페이지 링크로 대체
  // (클릭 시 별도 창으로 열리고, 페이지는 넘어가지 않는다 — nav 가 a 클릭을 무시)
  const foot = rv('fade', 'p.srcfoot.s33__foot',
    h('a.s33__link', {
      href: 'https://kwon007009-stack.github.io/jiwon13/',
      target: '_blank',
      rel: 'noopener noreferrer',
    }, '틸론 회사소개 자세히 보기', h('span.s33__link-arrow', '↗'))
  );

  const el = ScreenRoot(meta, { className: 's33' },
    gov,
    h('div.s33__body', numPanel, timeline),
    h('div.s33__bottom', inds, prods),
    foot
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => numPanel.classList.add('is-in'));
      sch.at(900, () => big.countUp(sch, 25, { duration: 1400 }));
      // 타임라인 좌 → 우 드로잉
      sch.at(1000, () => line.classList.add('is-drawn'));
      sch.stagger(eraEls, (e) => e.classList.add('is-in'), { start: 1300, gap: 500 });
      // 산업 아이콘 순차 점등 → 제품 라벨
      sch.stagger(indEls, (i) => i.classList.add('is-in'), { start: 3100, gap: 180 });
      sch.stagger(prodEls, (p) => p.classList.add('is-in'), { start: 4100, gap: 240 });
      sch.at(4700, () => foot.classList.add('is-in'));
    },
    steps: [],
  };
}
