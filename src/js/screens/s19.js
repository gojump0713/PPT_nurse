/**
 * SCREEN 19 (PART 전환 · 브리지 ①) — 시험정보 보호 → 의료정보 보호
 *
 * 발표 전체에서 가장 극적인 전환. 두 세계가 하나의 구조로 합쳐지는 모핑이
 * 3부 구성을 하나의 이야기로 묶는다. (개발 리소스 최우선 투입 화면)
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(19);

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
  h('img.s19__silhouette', { src, alt: '', loading: 'eager' });

function Panel(kind, title, items, result, silhouette) {
  return h(`div.s19__panel.s19__panel--${kind}`,
    h('div.s19__panel-bg', silhouette),
    h('div.s19__panel-inner',
      h('div.s19__panel-title', title),
      h('ul.s19__items', ...items.map((t) => h('li.s19__item', t))),
      h('div.s19__panel-arrow', '↓'),
      h('div.s19__panel-result', result)
    )
  );
}

export function create() {
  /* PART 인디케이터: PART 1 → PART 2 로 교체되는 전용 헤더 */
  const partFrom = h('span.s19__part.is-from', h('b', 'PART 1'), 'CBT');
  const partTo = h('span.s19__part.is-to', h('b', 'PART 2'), 'VDI');
  const header = rv('down', 'header.hdr.s19__hdr',
    h('h1.hdr__title', meta.title),
    h('div.s19__parts', partFrom, h('span.s19__part-arrow', '→'), partTo)
  );

  // 경로는 반드시 리터럴로 — 빌드가 정적 스캔으로 배포 대상 에셋을 고른다
  const uni = Panel('uni', '대학', UNI, '안전한 시험환경',
    Silhouette('assets/images/gen/s15-university.webp'));
  const hos = Panel('hos', '병원', HOS, '안전한 의료 업무환경',
    Silhouette('assets/images/gen/s15-hospital.webp'));

  const coreEls = CORE.map((c, i) =>
    h('div.s19__core-node', { style: { '--i': String(i) } },
      icons[c.icon]({ size: 34, className: 's19__core-icon' }),
      h('span', c.title)
    )
  );

  const gov = Governing(meta.governing, { size: 'lg', center: true });
  gov.classList.add('s19__gov');

  const merged = h('div.s19__merged',
    h('div.s19__core',
      ...coreEls.flatMap((n, i) => (i > 0 ? [h('span.s19__core-plus', '+'), n] : [n]))
    ),
    gov
  );

  // 발주 측 수정 지시 — 아래쪽 가운데 문구. 클릭(수렴 모핑) 시 함께 사라진다.
  const bottom = h('div.s19__bottom',
    h('p.s19__bottom-lead', '사실 대학과 병원이 가진 고민은 다르지 않습니다'),
    h('p.s19__bottom-sub', '대학은 시험정보를 보호하고, 병원은 환자정보를 보호합니다.')
  );

  const el = ScreenRoot(meta, { header: false, className: 's19' },
    header,
    h('div.s19__split', uni, h('div.s19__seam'), hos),
    bottom,
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
        Array.from(el.querySelectorAll('.s19__item')),
        (li) => li.classList.add('is-in'),
        { start: 1100, gap: 130 }
      );
      sch.at(2200, () => {
        uni.querySelector('.s19__panel-result').classList.add('is-in');
        hos.querySelector('.s19__panel-result').classList.add('is-in');
      });
      sch.at(2600, () => bottom.classList.add('is-in'));
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
