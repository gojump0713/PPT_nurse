/**
 * SCREEN 08 — 동일 시험환경 기반 공정성 확보
 * 제각각인 6대 PC → 표준 시험화면으로 스냅 정렬. 하단 공식이 항별로 등장.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, Counter } from '../components/index.js';
import { PcMock, PcStandard } from '../components/mocks.js';

const meta = metaOf(8);

/** 6가지 편차 — 각기 다른 배경·창 배치로 "제각각"을 만든다 */
const PCS = [
  {
    label: 'OS · 버전 차이', os: 'Windows 10 (21H2)', badge: '업데이트 대기',
    wallpaper: 'linear-gradient(140deg,#2c4b7c,#16233a)',
    windows: [{ t: 12, l: 8, w: 60, h: 46, label: '업데이트' }],
    rot: -2.4, dy: 12,
  },
  {
    label: '설치 프로그램 차이', os: '메신저 · 게임 상주', badge: '알림 3',
    wallpaper: 'linear-gradient(140deg,#3d2c56,#1c1630)',
    windows: [{ t: 8, l: 6, w: 42, h: 60, label: '메신저' }, { t: 46, l: 52, w: 42, h: 40 }],
    rot: 1.8, dy: -14,
  },
  {
    label: '개인자료 존재', os: '바탕화면 파일 다수',
    wallpaper: 'linear-gradient(140deg,#264a3f,#122019)',
    windows: [{ t: 10, l: 10, w: 30, h: 26 }, { t: 42, l: 14, w: 30, h: 26 }, { t: 20, l: 55, w: 34, h: 44, label: '내 문서' }],
    rot: -1.2, dy: 22,
  },
  {
    label: '인터넷 접근 차이', os: '브라우저 탭 12개', badge: '검색 가능',
    wallpaper: 'linear-gradient(140deg,#5a3a22,#241708)',
    windows: [{ t: 10, l: 6, w: 84, h: 68, label: '브라우저' }],
    rot: 2.6, dy: -6,
  },
  {
    label: '보안설정 차이', os: '백신 · 방화벽 상이', badge: '정책 미적용',
    wallpaper: 'linear-gradient(140deg,#4a2430,#1e1016)',
    windows: [{ t: 24, l: 18, w: 56, h: 42, label: '보안 경고' }],
    rot: -3.1, dy: 8,
  },
  {
    label: '장애 대응 편차', os: '현장 조치 의존', badge: '응답 없음',
    wallpaper: 'linear-gradient(140deg,#3a3f4c,#15181f)',
    windows: [{ t: 30, l: 22, w: 50, h: 34, label: '응답 없음' }],
    rot: 1.1, dy: 18,
  },
];

const FORMULA = [
  { t: 'Same Question', k: '같은 문제' },
  { t: '×' },
  { t: 'Same Time', k: '같은 시간' },
  { t: '×' },
  { t: 'Same Environment', k: '같은 환경' },
  { t: '=' },
  { t: 'Fair Test', k: '공정한 시험', result: true },
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });
  const counter = Counter(6, '가지 편차');

  const slots = PCS.map((p) => {
    const messy = h('div.s08__face.s08__face--messy',
      PcMock({ os: p.os, note: p.label, wallpaper: p.wallpaper, windows: p.windows, badge: p.badge })
    );
    const std = h('div.s08__face.s08__face--std', PcStandard({ resolved: p.label }));
    const slot = rv('scale', 'div.s08__slot', {
      style: { '--rot': `${p.rot}deg`, '--dy': `${p.dy}px` },
    }, messy, std);
    return slot;
  });

  const grid = h('div.s08__grid', ...slots);

  const formulaEls = FORMULA.map((f) =>
    h(`div.s08__f${f.result ? '.s08__f--result' : ''}${f.k ? '' : '.s08__f--op'}`,
      h('span.s08__f-t', f.t),
      f.k && h('span.s08__f-k', f.k)
    )
  );
  const formula = h('div.s08__formula', ...formulaEls);

  const el = ScreenRoot(meta, { className: 's08' },
    h('div.s08__top', gov, counter),
    grid,
    formula
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      // ① 제각각인 6대 PC 등장 (미세하게 어긋난 배치)
      sch.stagger(slots, (s, i) => {
        s.classList.add('is-in');
        counter.set(i + 1);
      }, { start: 800, gap: 180 });
      sch.at(900, () => counter.classList.add('is-in'));
    },
    steps: [
      // 클릭 1회: 6대가 동일한 표준 화면으로 스냅 정렬 → 공식이 항별로 등장
      // (발표 멘트 "같은 문제를 줘도, 환경이 다르면 같은 시험이 아닙니다"와 타이밍을 맞추기 위해
      //  자동 진행이 아니라 발표자 클릭으로 전환한다)
      (sch) => {
        el.classList.add('is-aligned');
        sch.stagger(formulaEls, (f) => f.classList.add('is-in'), { start: 900, gap: 320 });
        sch.at(900 + 320 * formulaEls.length + 200, () => formula.classList.add('is-done'));
      },
    ],
  };
}
