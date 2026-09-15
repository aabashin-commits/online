// formats.js — блок «Выберите формат обучения» (ТЗ 06.09.2026, §12).
//
// Одна разметка на три раскладки: на десктопе это сравнительная таблица,
// на планшете — две колонки-карточки, на телефоне видна колонка одного формата
// (вторая скрыта стилями). JS отвечает только за выбор формата — саму
// перестройку делает CSS. Кнопка «Сравнить оба варианта» с полноэкранной
// таблицей на телефоне снята 15.09.2026.
(() => {
  'use strict';

  const root = document.querySelector('.formats');
  if (!root) return;

  const table = root.querySelector('.formats__table');
  const switchBtns = Array.from(root.querySelectorAll('.formats__switch-btn'));
  if (!table) return;

  // Какая колонка видна на телефоне. Формат по умолчанию — с прикреплением:
  // это первая колонка таблицы в ТЗ и полный вариант услуги.
  let current = 'with';

  const applyFormat = (format) => {
    current = format;
    // data-format на секции читает CSS: он и прячет лишнюю колонку на телефоне
    root.dataset.format = format;

    switchBtns.forEach((button) => {
      const active = button.dataset.format === format;
      button.classList.toggle('formats__switch-btn--active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.setAttribute('tabindex', active ? '0' : '-1');
    });
  };

  // Переключатель только показывает колонку: осознанным выбором считается
  // нажатие CTA — иначе в форму уходил бы формат, который родитель просто
  // пролистал глазами.
  switchBtns.forEach((button) => {
    button.addEventListener('click', () => applyFormat(button.dataset.format));

    button.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const next = switchBtns[(switchBtns.indexOf(button) + 1) % switchBtns.length];
      next.focus();
      applyFormat(next.dataset.format);
    });
  });

  // CTA блока (правка клиента 10.09.2026) — одна кнопка «Подобрать формат
  // обучения», обычная ссылка с data-open-form: её ловит общий обработчик
  // main.js и открывает форму. Своего кода ей не нужно. Прежние две кнопки
  // выбирали формат и прокручивали к тарифам — теперь формат в блоке
  // стоимости выбирается там же, переключателем ступеней.

  // Формат могли выбрать и в блоке стоимости — держим переключатель в согласии
  document.addEventListener('school-choice', (event) => {
    if (event.detail.key !== 'education_format') return;
    const format = event.detail.value;
    if (format && format !== current) applyFormat(format);
  });

  applyFormat(current);
})();
