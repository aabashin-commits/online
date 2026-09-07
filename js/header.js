// header.js — бургер-меню шапки.
// Поведение шапки при скролле (липкость) решено CSS: position: sticky.
//
// 07.09.2026: отсюда убрана логика выпадающих списков («О школе», «Обучение»,
// «Полезное») — ТЗ §4 требует семь плоских якорей. Вместе с ней ушли ховер
// на устройствах с курсором, «открыт только один список», закрытие по клику
// мимо и возврат фокуса на кнопку по Esc: `git show c809a07:js/header.js`.
(() => {
  'use strict';

  const header = document.querySelector('.header');
  if (!header) return;

  const menu = header.querySelector('.header__menu');
  const burger = header.querySelector('.header__burger');
  const close = header.querySelector('.header__menu-close');
  if (!menu || !burger || !close) return;

  const toggle = (open) => {
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => toggle(true));
  close.addEventListener('click', () => toggle(false));

  // Клик по якорю или CTA внутри меню закрывает его
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a, [data-open-form]')) toggle(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) toggle(false);
  });
})();
