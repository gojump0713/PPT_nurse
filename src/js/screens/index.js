/**
 * screens/index.js — 화면 모듈 레지스트리
 * 배열 순서 = 발표 순서.
 *
 *   intro     오프닝 영상 루프 (번호 없음)
 *   00        표지
 *   01 ~ 14   PART 1 · CBT
 *   15 ~ 18   CBT 실제 구동 영상 4편
 *   19 ~ 24   PART 2 · VDI
 *   25 ~ 30   주요 구축사례 슬라이드 6장
 *   31        PART 2 마무리 · 우선 적용업무
 *   32 ~ 34   PART 3 · TILON
 */

import * as intro from './intro.js';
import * as s00 from './s00.js';
import * as s01 from './s01.js';
import * as s02 from './s02.js';
import * as s03 from './s03.js';
import * as s04 from './s04.js';
import * as s05 from './s05.js';
import * as s06 from './s06.js';
import * as s07 from './s07.js';
import * as s08 from './s08.js';
import * as s09 from './s09.js';
import * as s10 from './s10.js';
import * as s11 from './s11.js';
import * as s12 from './s12.js';
import * as s13 from './s13.js';
import * as s14 from './s14.js';
import * as s15 from './s15.js';
import * as s16 from './s16.js';
import * as s17 from './s17.js';
import * as s18 from './s18.js';
import * as s19 from './s19.js';
import * as s20 from './s20.js';
import * as s21 from './s21.js';
import * as s22 from './s22.js';
import * as s23 from './s23.js';
import * as s24 from './s24.js';
import * as s25 from './s25.js';
import * as s26 from './s26.js';
import * as s27 from './s27.js';
import * as s28 from './s28.js';
import * as s29 from './s29.js';
import * as s30 from './s30.js';
import * as s31 from './s31.js';
import * as s32 from './s32.js';
import * as s33 from './s33.js';
import * as s34 from './s34.js';

export const screens = [
  intro,
  s00,
  s01, s02, s03, s04, s05, s06, s07, s08, s09, s10,
  s11, s12, s13, s14, s15, s16, s17, s18, s19, s20,
  s21, s22, s23, s24, s25, s26, s27, s28, s29, s30,
  s31, s32, s33, s34,
];
