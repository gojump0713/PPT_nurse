/**
 * SCREEN 18 — 글로벌 병원의 VDI 운영 사례
 * 지도 탐색형 특별 화면(클릭 2회 · 정책 허용 범위).
 *
 * 주의: 수치는 재검증 대상이다. CONFIG.globalFiguresVerified 가 false 인 동안
 * 각주에 재검증 문구를 유지한다. 검증 실패 시 수치를 제거하고 정성 서술로 대체한다.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, Popover, SourceFooter } from '../components/index.js';
import { WorldMap } from '../components/worldmap.js';
import { CONFIG } from '../../data/config.js';

const meta = metaOf(18);

const HOSPITALS = [
  {
    name: 'Cleveland Clinic',
    meta: '미국 오하이오 · 클리블랜드',
    lat: 41.5, lon: -81.7,
    pos: { left: '4%', top: '8%' },
    rows: [
      { label: '가상데스크톱 운영', display: 'VDI' },
      { label: '운영계 · 재해복구(DR) 접근 환경', display: '이중화' },
    ],
  },
  {
    name: 'Mass General Brigham',
    meta: '미국 매사추세츠 · 보스턴',
    lat: 42.36, lon: -71.06,
    pos: { right: '4%', top: '8%' },
    rows: [
      { label: '전체 직원', value: 78000, suffix: '명' },
      { label: '원격근무', value: 26000, suffix: '명' },
      { label: '가상진료 (월) · 9,000 건에서', value: 250000, suffix: '+' },
    ],
  },
];

const PURPOSE = ['의료정보 보호', '의료진 이동성', '업무 연속성', '표준 업무환경'];

export function create() {
  const gov = Governing(meta.governing, { size: 'sm' });

  const map = WorldMap({
    markers: HOSPITALS.map((hh, i) => ({ lat: hh.lat, lon: hh.lon, labelBelow: i === 1 })),
  });

  const pops = HOSPITALS.map((hh, i) =>
    Popover({
      name: [h('span.pop__no', String(i + 1).padStart(2, '0')), hh.name],
      meta: hh.meta,
      rows: hh.rows,
      style: hh.pos,
    })
  );

  const mapWrap = rv('scale', 'div.s18__map', map, ...pops);

  const purposeEls = PURPOSE.map((p, i) =>
    h('div.s18__purpose', h('span.s18__purpose-no', String(i + 1).padStart(2, '0')), p)
  );
  const purposes = h('div.s18__purposes',
    h('span.s18__purposes-label', '공통 목적'),
    ...purposeEls
  );

  const foot = SourceFooter(
    CONFIG.globalFiguresVerified
      ? '출처: 각 사 공개자료 · Citrix 고객사례'
      : '출처: 각 사 공개자료 · Citrix 고객사례 — 발표 전 재검증 필요'
  );

  const el = ScreenRoot(meta, { className: 's18' },
    gov,
    mapWrap,
    purposes,
    foot
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => mapWrap.classList.add('is-in'));
      sch.at(1200, () => map.classList.add('is-pulsing'));
      sch.at(1400, () => foot.classList.add('is-in'));
    },
    steps: [
      // 클릭 1회: Cleveland 카드 팝업
      (sch) => {
        map.markerEls[0].classList.add('is-active');
        pops[0].open(sch);
      },
      // 클릭 2회: MGB 카드 팝업 + 숫자 카운트업 → 하단 공통 목적 4개 점등
      (sch) => {
        map.markerEls[1].classList.add('is-active');
        pops[1].open(sch);
        sch.at(900, () => purposes.classList.add('is-in'));
        sch.stagger(purposeEls, (p) => p.classList.add('is-lit'), { start: 1100, gap: 260 });
      },
    ],
  };
}
