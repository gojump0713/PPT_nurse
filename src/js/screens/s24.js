/**
 * SCREEN 24 — 의료기관 26곳 VDI 구축 실적
 * 실적 페이지의 힘은 물량감. 카운트업 + 그리드 누적 등장.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, BigNumber, SourceFooter } from '../components/index.js';
import { CONFIG } from '../../data/config.js';

const meta = metaOf(24);

const GROUPS = [
  {
    title: '대학병원 · 종합병원', count: 7,
    items: ['가천대 길병원', '중앙대병원', '한양대학교의료원', '경북대학교병원', '이대목동병원', '경희의료원', '명지병원'],
  },
  {
    title: '공공 · 전문 의료기관', count: 6,
    items: ['국민건강보험 일산병원', '한일병원', '한국산재의료원', '성남시의료원', '한전병원', '한국원자력의학원'],
  },
  {
    title: '다기관', count: 12,
    items: ['근로복지공단 산재병원 12곳'], highlight: true,
  },
  {
    title: '보건의료 공공기관', count: 1,
    items: ['건강보험심사평가원'],
  },
];

const KEYWORDS = ['환자정보 보호', '업무 연속성', '환경 표준화', '중앙관리'];

export function create() {
  const gov = Governing(meta.governing, { size: 'sm' });

  const big = BigNumber(0, { size: 'sm', unit: '곳', reveal: false });
  const sub = BigNumber(0, { size: 'md', reveal: false, accent: true });

  const numsPanel = rv('up', 'div.s24__nums',
    h('div.s24__num-block',
      h('div.s24__num-label', '국내 의료 · 보건기관'),
      big,
      h('div.s24__num-note', '계획이 아니라 구축된 숫자')
    ),
    h('div.s24__num-block.s24__num-block--sub',
      h('div.s24__num-label', '근로복지공단 산재병원'),
      h('div.s24__sub-row', sub, h('span.s24__sub-unit', '곳')),
      h('div.s24__num-note', '환경이 다른 병원을 하나의 체계로')
    )
  );

  const groupEls = GROUPS.map((g) =>
    h(`div.s24__group${g.highlight ? '.is-highlight' : ''}`,
      h('div.s24__group-head',
        h('span.s24__group-title', g.title),
        h('span.s24__group-count', `(${g.count})`)
      ),
      h('div.s24__group-items', ...g.items.map((i) => h('span.s24__org', i)))
    )
  );
  const grid = h('div.s24__grid', ...groupEls);

  const keywordEls = KEYWORDS.map((k) => h('span.s24__kw', k));
  const keywords = h('div.s24__keywords', ...keywordEls);

  const foot = SourceFooter(
    CONFIG.domesticFiguresConfirmed
      ? '기관 로고는 사용 권리 확인 완료 항목만 표기'
      : '기관 수치 · 명칭은 영업부서 확정본 기준으로 최종 확인 필요 · 로고는 권리 확인 전 텍스트 표기'
  );

  const el = ScreenRoot(meta, { className: 's24' },
    gov,
    h('div.s24__body', numsPanel, grid),
    keywords,
    foot
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      sch.at(760, () => numsPanel.classList.add('is-in'));
      // 26 카운트업 (1.5s)
      sch.at(900, () => big.countUp(sch, 26, { duration: 1500 }));
      // 그리드 4그룹 0.6s 간격 등장
      sch.stagger(groupEls, (g) => g.classList.add('is-in'), { start: 1500, gap: 600 });
      // 12 하이라이트 펄스
      sch.at(3500, () => {
        sub.countUp(sch, 12, { duration: 900 });
        el.classList.add('is-pulse');
      });
      sch.at(4600, () => el.classList.remove('is-pulse'));
      sch.stagger(keywordEls, (k) => k.classList.add('is-in'), { start: 4400, gap: 180 });
      sch.at(4400, () => keywords.classList.add('is-in'));
      sch.at(5300, () => foot.classList.add('is-in'));
    },
    steps: [],
  };
}
