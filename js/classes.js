// classes.js — блок «Выберите класс ребёнка» (ТЗ 06.09.2026, §10).
//
// Две задачи:
// 1. Выбранная ступень запоминается (window.setSchoolStage из main.js) и уходит
//    в блок стоимости — там она переключит тарифы (фаза 5).
// 2. На телефоне карточки работают как accordion: описание ступени скрыто,
//    пока карточку не раскрыли. Состояние живёт в aria-expanded — один источник
//    и для скринридера, и для стилей (см. css/classes.css, медиазапрос 767).
//
// Экстернат намеренно не выбирается: это не ступень, тарифа у него нет,
// траектория определяется после диагностики.
(() => {
  'use strict';

  const root = document.querySelector('.classes');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('.classes__card'));
  const cta = root.querySelector('.classes__cta');
  if (!cards.length) return;

  // Подпись кнопки не меняется (в ТЗ она одна), но тема заявки уточняется
  // выбранной ступенью — так менеджер видит её даже без скрытых полей.
  const baseTopic = cta ? cta.dataset.openForm : '';

  const mobile = window.matchMedia('(max-width: 767px)');
  let current = null;

  // На десктопе описание видно всегда, поэтому aria-expanded там всегда true:
  // иначе скринридер сообщал бы о свёрнутой карточке, глядя на раскрытую.
  const syncExpanded = () => {
    cards.forEach((card) => {
      const open = mobile.matches ? card === current : true;
      card.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  };

  const select = (card) => {
    // Повторный клик на телефоне закрывает карточку, но выбор ступени
    // не отменяет: родитель уже сказал, какой класс его интересует.
    current = mobile.matches && current === card ? null : card;

    cards.forEach((item) => {
      item.closest('.classes__item').classList.toggle('classes__item--active', item === card);
    });

    if (typeof window.setSchoolStage === 'function') {
      window.setSchoolStage(card.dataset.stage);
    }

    if (cta && baseTopic) {
      const title = card.querySelector('.classes__card-title');
      cta.dataset.openForm = title ? `${baseTopic} — ${title.textContent}` : baseTopic;
    }

    syncExpanded();
  };

  cards.forEach((card) => card.addEventListener('click', () => select(card)));

  // При переходе через 767 меняется сама роль карточки: на десктопе описание
  // раскрыто всегда, на телефоне — только у выбранной.
  mobile.addEventListener('change', syncExpanded);

  syncExpanded();
})();
