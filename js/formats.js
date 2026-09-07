// formats.js — блок «Выберите формат обучения» (ТЗ 06.09.2026, §12).
//
// Одна разметка на три раскладки: на десктопе это сравнительная таблица,
// на планшете — две колонки-карточки, на телефоне видна колонка одного формата
// (вторая скрыта стилями), а кнопка «Сравнить оба варианта» разворачивает
// таблицу на весь экран. JS отвечает только за выбор формата и за этот полный
// экран — саму перестройку делает CSS.
(() => {
  'use strict';

  const root = document.querySelector('.formats');
  if (!root) return;

  const table = root.querySelector('.formats__table');
  const switchBtns = Array.from(root.querySelectorAll('.formats__switch-btn'));
  const ctas = Array.from(root.querySelectorAll('.formats__cta'));
  const compareBtn = root.querySelector('.formats__compare');
  const closeBtn = root.querySelector('.formats__compare-close');
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

  // --- Полноэкранное сравнение (только телефон) ---

  const closeCompare = () => {
    if (!root.classList.contains('formats--compare')) return;
    root.classList.remove('formats--compare');
    if (window.unlockScroll) window.unlockScroll();
    if (compareBtn) compareBtn.focus();
  };

  if (compareBtn) {
    compareBtn.addEventListener('click', () => {
      root.classList.add('formats--compare');
      if (window.lockScroll) window.lockScroll();
      if (closeBtn) closeBtn.focus();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeCompare);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCompare();
  });

  // --- CTA: выбор формата + переход к стоимости ---

  ctas.forEach((button) => {
    button.addEventListener('click', () => {
      const format = button.dataset.format;
      applyFormat(format);
      closeCompare();

      if (typeof window.setEducationFormat === 'function') {
        window.setEducationFormat(format);
      }

      // Блок стоимости стоит сразу следом и сам подхватит формат из события;
      // здесь только прокрутка. Отступ сверху даёт scroll-margin-top в CSS.
      const pricing = document.querySelector('#pricing');
      if (pricing) pricing.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Формат могли выбрать и в блоке стоимости — держим переключатель в согласии
  document.addEventListener('school-choice', (event) => {
    if (event.detail.key !== 'education_format') return;
    const format = event.detail.value;
    if (format && format !== current) applyFormat(format);
  });

  applyFormat(current);
})();
