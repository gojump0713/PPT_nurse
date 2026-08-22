/**
 * SCREEN 23 — 가상화 원천기술 25년, 틸론
 * 시간의 길이는 선의 길이로 전달한다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, BigNumber, SourceFooter } from '../components/index.js';
import { icons } from '../components/icons.js';
import { CONFIG } from '../../data/config.js';

const meta = metaOf(23);

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
  const numPanel = rv('up', 'div.s23__num',
    h('div.s23__num-label', '가상화 원천기술'),
    big,
    h('img.s23__ci', { src: 'assets/images/brand/tilon-ci.png', alt: 'TILON' })
  );

  const eraEls = ERAS.map((e) =>
    h(`div.s23__era${e.now ? '.is-now' : ''}`,
      h('span.s23__era-dot'),
      h('div.s23__era-year', e.year),
      h('div.s23__era-label', e.label),
      h('div.s23__era-sub', e.sub)
    )
  );
  const line = h('span.s23__line');
  const timeline = h('div.s23__timeline', line, h('div.s23__eras', ...eraEls));

  const indEls = INDUSTRIES.map((i) =>
    h('div.s23__ind', icons[i.icon]({ size: 30, className: 's23__ind-icon' }), i.name)
  );
  const inds = h('div.s23__inds', ...indEls);

  const prodEls = PRODUCTS.map((p) =>
    h('div.s23__prod',
      h('span.s23__prod-name', p.name),
      h('span.s23__prod-desc', p.desc)
    )
  );
  const prods = h('div.s23__prods', ...prodEls);

  const foot = SourceFooter(
    CONFIG.companyFiguresConfirmed
      ? '틸론 회사소개서 기준'
      : '연혁 · 인증 수치는 최신 회사소개서 기준으로 확정 삽입 필요 [확인 필요]'
  );

  const el = ScreenRoot(meta, { className: 's23' },
    gov,
    h('div.s23__body', numPanel, timeline),
    h('div.s23__bottom', inds, prods),
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
