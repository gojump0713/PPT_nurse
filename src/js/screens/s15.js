/**
 * SCREEN 15 (PART 전환 · 브리지 ①) — 시험정보 보호 → 의료정보 보호
 *
 * 발표 전체에서 가장 극적인 전환. 두 세계가 하나의 구조로 합쳐지는 모핑이
 * 3부 구성을 하나의 이야기로 묶는다. (개발 리소스 최우선 투입 화면)
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(15);

const UNI = ['시험문제', '성적', '평가데이터'];
const HOS = ['EMR', 'PACS', '환자정보', '연구데이터'];
const CORE = [
  { title: '데이터 중앙 보관', icon: 'server' },
  { title: '화면 전송', icon: 'monitor' },
  { title: '접근 통제', icon: 'lock' },
];

/**
 * 패널 배경 실루엣 (작업지시서 PART C-D 「생성형 AI」 지정 항목)
 * 어두운 배경 위에 PART 컬러 실루엣만 올라온 이미지라, mix-blend-mode: screen 으로
 * 어두운 부분을 떨어뜨리면 패널 그라디언트와 이음매 없이 겹친다.
 */
const Silhouette = (src) =>
  h('img.s15__silhouette', { src, alt: '', loading: 'eager' });

function Panel(kind, title, items, result, silhouette) {
  return h(`div.s15__panel.s15__panel--${kind}`,
    h('div.s15__panel-bg', silhouette),
    h('div.s15__panel-inner',
      h('div.s15__panel-title', title),
      h('ul.s15__items', ...items.map((t) => h('li.s15__item', t))),
      h('div.s15__panel-arrow', '↓'),
      h('div.s15__panel-result', result)
    )
  );
}

export function create() {
  /* PART 인디케이터: PART 1 → PART 2 로 교체되는 전용 헤더 */
  const partFrom = h('span.s15__part.is-from', h('b', 'PART 1'), 'CBT');
  const partTo = h('span.s15__part.is-to', h('b', 'PART 2'), 'VDI');
  const header = rv('down', 'header.hdr.s15__hdr',
    h('h1.hdr__title', meta.title),
    h('div.s15__parts', partFrom, h('span.s15__part-arrow', '→'), partTo)
  );

  // 경로는 반드시 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  const uni = Panel('uni', '대학', UNI, '안전한 시험환경',
    Silhouette('assets/images/gen/s15-university.webp'));
  const hos = Panel('hos', '병원', HOS, '안전한 의료 업무환경',
    Silhouette('assets/images/gen/s15-hospital.webp'));

  const coreEls = CORE.map((c, i) =>
    h('div.s15__core-node', { style: { '--i': String(i) } },
      icons[c.icon]({ size: 34, className: 's15__core-icon' }),
      h('span', c.title)
    )
  );

  const gov = Governing(meta.governing, { size: 'lg', center: true });
  gov.classList.add('s15__gov');

  const merged = h('div.s15__merged',
    h('div.s15__core',
      ...coreEls.flatMap((n, i) => (i > 0 ? [h('span.s15__core-plus', '+'), n] : [n]))
    ),
    gov
  );

  const el = ScreenRoot(meta, { header: false, className: 's15' },
    header,
    h('div.s15__split', uni, h('div.s15__seam'), hos),
    merged
  );

  return {
    el,
    enter(sch) {
      // 진입 시점에는 아직 PART 1 — 클릭으로 PART 2 로 넘어간다
      document.body.dataset.part = 'CBT';
      sch.at(0, () => header.classList.add('is-in'));
      sch.at(500, () => uni.classList.add('is-in'));
      sch.at(700, () => hos.classList.add('is-in'));
      sch.stagger(
        Array.from(el.querySelectorAll('.s15__item')),
        (li) => li.classList.add('is-in'),
        { start: 1100, gap: 130 }
      );
      sch.at(2200, () => {
        uni.querySelector('.s15__panel-result').classList.add('is-in');
        hos.querySelector('.s15__panel-result').classList.add('is-in');
      });
    },
    steps: [
      // 클릭 1회: 패널 수렴 모핑(1.2s) + 공통 구조 등장 + 배경 톤 전환 + PART 교체
      (sch) => {
        el.classList.add('is-merging');
        document.body.dataset.part = 'VDI';
        sch.at(1200, () => el.classList.add('is-merged'));
        sch.stagger(coreEls, (n) => n.classList.add('is-in'), { start: 1350, gap: 200 });
        sch.at(2100, () => gov.classList.add('is-in'));
      },
    ],
  };
}
