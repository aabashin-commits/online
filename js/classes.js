// classes.js — блок «Выберите класс ребёнка» (ТЗ 06.09.2026, §10).
//
// Выбранная ступень запоминается (window.setSchoolStage из main.js) и уходит
// в блок стоимости — там она переключает тарифы. Выбранная карточка
// подсвечивается, состояние для скринридера — в aria-pressed.
//
// ⚠️ 16.09.2026, правка клиента: аккордеон на телефоне снят — описание ступени
// видно всегда, на всех ширинах.
//
// Экстернат намеренно не выбирается: это не ступень, тарифа у него нет,
// траектория определяется после диагностики. С 10.09.2026 он лежит четвёртой
// карточкой той же сетки, но без <button> внутри — поэтому карточки собираются
// по button.classes__card, иначе экстернат ловил бы клики и слал в стоимость
// пустую ступень.
(() => {
  'use strict';

  const root = document.querySelector('.classes');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('button.classes__card'));
  const cta = root.querySelector('.classes__cta');
  if (!cards.length) return;

  // Подпись кнопки не меняется (в ТЗ она одна), но тема заявки уточняется
  // выбранной ступенью — так менеджер видит её даже без скрытых полей.
  const baseTopic = cta ? cta.dataset.openForm : '';

  const select = (card) => {
    cards.forEach((item) => {
      const active = item === card;
      item.closest('.classes__item').classList.toggle('classes__item--active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (typeof window.setSchoolStage === 'function') {
      window.setSchoolStage(card.dataset.stage);
    }

    if (cta && baseTopic) {
      const title = card.querySelector('.classes__card-title');
      cta.dataset.openForm = title ? `${baseTopic} — ${title.textContent}` : baseTopic;
    }
  };

  cards.forEach((card) => card.addEventListener('click', () => select(card)));
})();
