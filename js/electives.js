// electives.js — блок 16 «Факультативы/профориентация».
// На телефоне (≤767) бенто 3+2+3 превращается в горизонтальную карусель
// со строкой стрелок под ней (Figma 1:14253 / 1:14311). Раскладку делает CSS,
// здесь — только прокрутка по кнопкам через общий хелпер createScroller().
(() => {
  'use strict';

  const root = document.querySelector('.electives');
  if (!root) return;

  const track = root.querySelector('.electives__grid');
  const nav = root.querySelector('[data-scroll-nav]');

  // Карточки лежат внутри рядов бенто, поэтому шаг меряем по самой карточке
  window.createScroller(track, nav, '.electives__card');
})();
