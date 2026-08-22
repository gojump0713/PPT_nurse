/**
 * SCREEN 13 — CBT + VDI 결합 시험환경 통제
 * "같아 보이던 두 구조에 한 겹이 끼워지는 순간"이 차별화의 시각적 정의.
 */

import { h, rv } from '../lib/dom.js';
import { metaOf } from '../../data/screens.js';
import { ScreenRoot } from '../components/screen.js';
import { Governing, DNode } from '../components/index.js';
import { icons } from '../components/icons.js';

const meta = metaOf(13);

const CONTROLS = [
  '인터넷 접근 통제', '허용 프로그램 실행', '동일 환경 배포',
  '단말 중앙관리', '실시간 응시현황', '종료 후 일괄 회수',
];

export function create() {
  const gov = Governing(meta.governing, { size: 'lg' });

  /* ---- 좌: 일반 CBT ---- */
  const left = rv('up', 'div.s13__col.s13__col--plain',
    h('div.s13__col-head', h('span.s13__col-tag', '일반 CBT'), '학생 PC 위에 프로그램을 얹는 구조'),
    h('div.s13__arch',
      DNode('학생 PC', '개인 환경 그대로', { ghost: true }),
      h('div.s13__link', h('span.s13__link-line')),
      DNode('CBT 시스템', '문제은행 · 채점')
    ),
    h('div.s13__risk', icons.alert({ size: 18 }), 'PC 편차 · 우회 가능성이 그대로 남는다')
  );

  /* ---- 우: 틸론 ---- */
  const shieldTags = CONTROLS.map((t, i) =>
    h('span.s13__ctag', { dataset: { i: String(i) } }, h('i'), t)
  );

  const shield = h('div.s13__shield',
    icons.shieldCheck({ size: 40, className: 's13__shield-icon' }),
    h('div.s13__shield-title', '통제된 가상 시험환경'),
    h('div.s13__shield-sub', 'Secure Exam Environment')
  );

  // 「화면」 패킷은 CBT 시스템 → 학생 단말 방향으로, 두 노드를 잇는 선 위에서 움직인다
  const packet = h('span.s13__packet', '화면');

  const right = rv('up', 'div.s13__col.s13__col--tilon',
    h('div.s13__col-head', h('span.s13__col-tag.is-accent', 'TILON'), '학생과 시스템 사이에 한 겹을 넣는 구조'),
    h('div.s13__arch.s13__arch--3',
      DNode('학생 단말', '화면만 표시', { ghost: true }),
      h('div.s13__link.s13__link--a', h('span.s13__link-line'), packet),
      h('div.s13__slot', shield, h('div.s13__ctags', ...shieldTags)),
      h('div.s13__link.s13__link--b', h('span.s13__link-line')),
      DNode('CBT 시스템', '문항 · 답안은 서버에만', { accent: true })
    ),
    h('div.s13__flowline', h('span.s13__flowlabel', '서버 → 단말: 화면만 전송'))
  );

  const note = h('div.s13__note',
    h('strong', '문항 · 답안 데이터는 서버에만 존재'), ' — 단말에는 화면만 전송됩니다'
  );

  const el = ScreenRoot(meta, { className: 's13' },
    gov,
    h('div.s13__body', left, right),
    note
  );

  return {
    el,
    enter(sch) {
      sch.at(0, () => el.headerEl.classList.add('is-in'));
      sch.at(400, () => gov.classList.add('is-in'));
      // 좌우 구조 동시 표시 — 우측은 아직 레이어 없이 좌측과 같은 상태
      sch.at(820, () => {
        left.classList.add('is-in');
        right.classList.add('is-in');
      });
    },
    steps: [
      // 클릭 1회: 방패 레이어 삽입 + 태그 6개 방사형 전개 + 데이터 흐름선
      (sch) => {
        el.classList.add('is-layered');
        sch.stagger(shieldTags, (t) => t.classList.add('is-in'), { start: 720, gap: 110 });
        sch.at(1500, () => el.classList.add('is-flowing'));
        sch.at(1700, () => note.classList.add('is-in'));
      },
    ],
  };
}
