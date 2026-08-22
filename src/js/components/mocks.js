/**
 * mocks.js — 실제 화면 대체용 목업
 *
 * 작업지시서 PART C-D 기준, 아래 3종은 매뉴얼 PDF 캡처로 교체 예정이다.
 *   S03 학생 응시 화면 1장 / S10 교수 매뉴얼 4장 / S14 학생 매뉴얼 3장
 * 캡처가 확보되기 전까지 발표가 가능하도록, 매뉴얼과 동일한 정보구조의
 * 목업을 CSS/SVG 로 구현해 둔다. 교체 방법은 docs/ASSETS.md 참조.
 */

import { h } from '../lib/dom.js';
import { icons } from './icons.js';

/* ---------------------------------------------------------------
   학생 CBT 응시 화면 (S03 · S14)
   핫스팟이 가리킬 UI 요소를 모두 포함한다:
   문항 · 타이머 · 이동 버튼 · 체크 · 미응답 · 답안수정 · 계산기/메모
   --------------------------------------------------------------- */
export function CbtStudentMock({ variant = 'solve' } = {}) {
  const palette = h('div.cbtm__palette',
    ...Array.from({ length: 30 }, (_, i) => {
      const n = i + 1;
      const state = n < 12 ? 'done' : n === 12 ? 'current' : n === 15 || n === 21 ? 'flag' : n === 18 || n === 24 ? 'skip' : '';
      return h(`span.cbtm__cell${state ? '.is-' + state : ''}`, String(n));
    })
  );

  const question = variant === 'submit'
    ? h('div.cbtm__submit',
        icons.shieldCheck({ size: 54, className: 'cbtm__submit-icon' }),
        h('div.cbtm__submit-title', '답안을 제출하시겠습니까?'),
        h('div.cbtm__submit-sub', '미응답 2문항 · 검토표시 2문항'),
        h('div.cbtm__submit-btns',
          h('span.cbtm__btn', '계속 풀기'),
          h('span.cbtm__btn.is-primary', '최종 제출')
        )
      )
    : h('div.cbtm__q',
        h('div.cbtm__q-no', variant === 'tutorial' ? '연습문항 03' : '12'),
        h('div.cbtm__q-text',
          variant === 'tutorial'
            ? '아래 보기 중 하나를 선택한 뒤, 다음 문항 버튼을 눌러 이동해 보십시오.'
            : '만성 심부전으로 입원한 72세 대상자가 야간에 호흡곤란을 호소하며 앉은 자세를 유지하려 한다. 대상자의 활동내구성 저하와 체액과다를 함께 고려할 때, 간호사가 우선적으로 수행해야 할 중재와 그 근거로 옳은 것은?'
        ),
        h('ul.cbtm__choices',
          ...[
            '반좌위를 취하게 하고 산소포화도를 측정한다',
            '수분섭취를 권장하여 탈수를 예방한다',
            '앙와위로 눕히고 하지를 상승시킨다',
            '즉시 이뇨제를 추가 투여한다',
            '활동을 격려하여 순환을 촉진한다',
          ].map((t, i) =>
            h(`li.cbtm__choice${i === 0 ? '.is-picked' : ''}`,
              h('span.cbtm__radio', String(i + 1)),
              h('span', t)
            )
          )
        )
      );

  return h('div.cbtm',
    h('div.cbtm__topbar',
      h('div.cbtm__brand',
        h('span.cbtm__logo', 'CBT'),
        h('span', '제68회 간호사 국가시험 · 모의응시')
      ),
      h('div.cbtm__timer',
        icons.clock({ size: 20, className: 'cbtm__timer-icon' }),
        h('span.cbtm__timer-val', '01:12:47'),
        h('span.cbtm__timer-label', '2교시 · 95분')
      ),
      h('div.cbtm__tools',
        h('span.cbtm__tool', icons.calc({ size: 18 }), '계산기'),
        h('span.cbtm__tool', icons.doc({ size: 18 }), '메모')
      )
    ),
    h('div.cbtm__main',
      h('div.cbtm__stage', question),
      h('aside.cbtm__side',
        h('div.cbtm__side-head', '문항 이동'),
        palette,
        h('div.cbtm__legend',
          h('span', h('i.is-done'), '완료'),
          h('span', h('i.is-flag'), '검토'),
          h('span', h('i.is-skip'), '미응답')
        ),
        h('div.cbtm__unanswered', h('strong', '미응답 2'), ' 문항이 남아 있습니다')
      )
    ),
    h('div.cbtm__footer',
      h('span.cbtm__btn', '◀ 이전 문항'),
      h('span.cbtm__btn.is-ghost', '⚑ 검토 표시'),
      h('span.cbtm__btn.is-ghost', '↺ 답안 수정'),
      h('span.cbtm__spacer'),
      h('span.cbtm__btn.is-primary', '다음 문항 ▶')
    )
  );
}

/* ---------------------------------------------------------------
   교수 CBT 관리 화면 (S10) — 4종
   --------------------------------------------------------------- */
const PROF_VIEWS = {
  bank: {
    caption: '문제은행 목록',
    build: () => h('div.pm__table',
      h('div.pm__toolbar',
        h('span.pm__search', '🔍  성인간호학 · 심혈관'),
        h('span.pm__chip', '과목: 간호학총론'),
        h('span.pm__chip', '난이도: 전체'),
        h('span.pm__btn', '+ 신규 문항')
      ),
      h('div.pm__row.pm__row--head',
        h('span', 'No'), h('span', '문항'), h('span', '분류'), h('span', '난이도'), h('span', '사용')
      ),
      ...[
        ['1042', '심부전 대상자의 체위와 산소요법 우선순위', '성인·순환', '중', '7회'],
        ['1041', '와파린 투여 대상자의 교육 내용', '약물계산', '상', '4회'],
        ['1039', '수술 후 무기폐 예방 간호중재', '성인·호흡', '중', '9회'],
        ['1036', '의료관련감염 표준주의 적용', '감염관리', '하', '12회'],
        ['1033', '간호법상 간호사의 업무 범위', '법규', '중', '3회'],
        ['1030', '당뇨 대상자의 자가혈당 측정 교육', '성인·내분비', '중', '6회'],
      ].map((r, i) =>
        h(`div.pm__row${i === 0 ? '.is-sel' : ''}`, ...r.map((c, j) => h(`span${j === 1 ? '.pm__q' : ''}`, c)))
      )
    ),
  },
  create: {
    caption: '신규 문제 등록',
    build: () => h('div.pm__form',
      h('div.pm__form-head', '신규 문항 등록'),
      h('div.pm__field', h('label', '문항 유형'), h('div.pm__seg', h('span.is-on', '객관식 5지선다'), h('span', '단답형'), h('span', '서술형'))),
      h('div.pm__field', h('label', '분류'), h('div.pm__input', '간호학총론 › 성인간호 › 순환기')),
      h('div.pm__field', h('label', '문항'), h('div.pm__textarea', '만성 심부전으로 입원한 72세 대상자가 야간에 호흡곤란을 호소하며…')),
      h('div.pm__field', h('label', '보기'),
        h('div.pm__opts',
          ...['반좌위를 취하게 하고 산소포화도를 측정한다', '수분섭취를 권장하여 탈수를 예방한다', '앙와위로 눕히고 하지를 상승시킨다'].map((t, i) =>
            h(`div.pm__opt${i === 0 ? '.is-answer' : ''}`, h('span.pm__opt-no', String(i + 1)), t)
          )
        )
      ),
      h('div.pm__form-foot', h('span.pm__btn.is-ghost', '기존 문항 불러오기'), h('span.pm__btn', '문제은행에 저장'))
    ),
  },
  exam: {
    caption: '시험(CBT) 등록',
    build: () => h('div.pm__exam',
      h('div.pm__form-head', '시험 등록 · 간호학총론 중간고사'),
      h('div.pm__grid2',
        h('div.pm__field', h('label', '응시 대상'), h('div.pm__input', '간호학과 3학년 · 168명')),
        h('div.pm__field', h('label', '시험 시간'), h('div.pm__input', '95분 (2교시 실전 모드)')),
        h('div.pm__field', h('label', '문항 수'), h('div.pm__input', '100문항 / 문제은행 자동 구성')),
        h('div.pm__field', h('label', '응시 환경'), h('div.pm__input', '가상 시험환경 · 인터넷 차단'))
      ),
      h('div.pm__pick',
        h('div.pm__pick-head', '문항 구성'),
        ...[
          ['성인간호', 34, 34],
          ['모성·아동', 22, 22],
          ['지역사회·정신', 20, 20],
          ['간호관리·기본', 14, 14],
          ['보건의약관계법규', 10, 10],
        ].map(([label, n, pct]) =>
          h('div.pm__pick-row',
            h('span', label),
            h('span.pm__bar', h('i', { style: { width: `${pct * 2.6}%` } })),
            h('span.pm__pick-n', `${n}문항`)
          )
        )
      ),
      h('div.pm__form-foot', h('span.pm__btn.is-ghost', '미리보기'), h('span.pm__btn', '시험 배포'))
    ),
  },
  score: {
    caption: '자동채점 · 결과 분석',
    build: () => h('div.pm__score',
      h('div.pm__form-head', '채점 결과 · 간호학총론 중간고사'),
      h('div.pm__kpis',
        ...[['응시', '168명'], ['평균', '71.4점'], ['최고', '96점'], ['채점 소요', '0초 (자동)']].map(([k, v]) =>
          h('div.pm__kpi', h('span.pm__kpi-k', k), h('span.pm__kpi-v', v))
        )
      ),
      h('div.pm__hist',
        ...[6, 11, 19, 28, 41, 52, 44, 31, 18, 9].map((v, i) =>
          h('span.pm__hist-bar', { style: { height: `${(v / 52) * 100}%` } }, h('i', `${i * 10}`))
        )
      ),
      h('div.pm__weak',
        h('div.pm__weak-head', '오답률 상위 문항'),
        ...[
          ['문항 34 · 약물계산', 62],
          ['문항 17 · 감염관리', 54],
          ['문항 88 · 법규(간호법)', 47],
        ].map(([label, pct]) =>
          h('div.pm__weak-row', h('span', label), h('span.pm__bar.is-warn', h('i', { style: { width: `${pct}%` } })), h('span.pm__pick-n', `${pct}%`))
        )
      )
    ),
  },
};

export const PROF_VIEW_KEYS = ['bank', 'create', 'exam', 'score'];

export function CbtProfessorMock(kind) {
  const view = PROF_VIEWS[kind] || PROF_VIEWS.bank;
  return h('div.pm',
    h('div.pm__chrome',
      h('span.pm__dot'), h('span.pm__dot'), h('span.pm__dot'),
      // 특정 기관 도메인을 쓰지 않는다 (목업이 실제 기관 화면으로 오해되지 않도록)
      h('span.pm__url', 'CBT 교수 관리자')
    ),
    h('div.pm__body', view.build())
  );
}

export const profCaption = (kind) => (PROF_VIEWS[kind] || PROF_VIEWS.bank).caption;

/* ---------------------------------------------------------------
   학생 PC 목업 (S08) — 제각각인 환경을 표현
   --------------------------------------------------------------- */
export function PcMock({ os, note, wallpaper, windows = [], badge }) {
  return h('div.pcm',
    h('div.pcm__screen', { style: { background: wallpaper } },
      ...windows.map((w, i) =>
        h('div.pcm__win', { style: { top: `${w.t}%`, left: `${w.l}%`, width: `${w.w}%`, height: `${w.h}%` } },
          h('div.pcm__win-bar'),
          w.label && h('div.pcm__win-label', w.label)
        )
      ),
      badge && h('div.pcm__badge', badge)
    ),
    h('div.pcm__base'),
    h('div.pcm__meta', h('strong', os), note && h('span', note))
  );
}

/* 표준화된 시험 화면 (S08 정렬 후) — 해소된 편차를 함께 표기해 정보를 잃지 않는다 */
export function PcStandard({ resolved } = {}) {
  return h('div.pcm.is-standard',
    h('div.pcm__screen',
      h('div.pcm__exam',
        h('div.pcm__exam-bar', h('span', 'CBT'), h('span.pcm__exam-timer', '95:00')),
        h('div.pcm__exam-lines', ...Array.from({ length: 4 }, (_, i) => h('i', { style: { width: `${92 - i * 14}%` } }))),
        h('div.pcm__exam-opts', ...Array.from({ length: 3 }, () => h('i')))
      )
    ),
    h('div.pcm__base'),
    h('div.pcm__meta',
      h('strong', '표준 시험환경'),
      resolved && h('span.pcm__resolved', h('i', '✓'), resolved, ' 해소')
    )
  );
}
