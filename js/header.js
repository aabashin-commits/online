// header.js — бургер-меню и выпадающие списки десктопной шапки.
// Поведение шапки при скролле (липкость) решено CSS: position: sticky.
(() => {
  'use strict';

  const header = document.querySelector('.header');
  if (!header) return;

  // ===== Выпадающие списки шапки («О школе» / «Обучение» / «Полезное») =====
  const groups = [...header.querySelectorAll('.header__group')];

  const setOpen = (group, open) => {
    group.classList.toggle('is-open', open);
    const btn = group.querySelector('.header__group-btn');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  };

  // Открытым может быть только один список: соседние закрываем.
  const closeGroups = (except) => groups.forEach((g) => { if (g !== except) setOpen(g, false); });

  // Наведение вешаем только там, где есть настоящий курсор. На тач-экране
  // (в т.ч. ноутбуки с сенсором) тап породил бы mouseenter → список открылся,
  // а следующий за ним click тут же закрыл бы его.
  const canHover = window.matchMedia('(hover: hover)').matches;

  groups.forEach((group) => {
    const btn = group.querySelector('.header__group-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      // ⚠️ Курсор, подъехавший к кнопке, уже открыл список наведением — и клик
      // мышью по нему работал бы как «закрыть». Со стороны это выглядит так,
      // будто кнопка не нажимается (жалоба клиента 31.07.2026). Поэтому клик
      // мышью по открытому списку игнорируем: он остаётся открытым.
      // e.detail === 0 — активация с клавиатуры (Enter/Space): там переключение
      // сохраняем, иначе кнопкой нельзя было бы закрыть список.
      const byMouse = e.detail > 0;
      if (canHover && byMouse && group.classList.contains('is-open')) return;

      const open = !group.classList.contains('is-open');
      closeGroups(group);
      setOpen(group, open);
    });

    // Клик по якорю внутри списка — закрыть (страница уезжает к секции).
    group.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(group, false);
    });

    // Уход фокуса за пределы группы (Tab с последнего пункта) — закрыть.
    group.addEventListener('focusout', (e) => {
      if (!group.contains(e.relatedTarget)) setOpen(group, false);
    });

    if (canHover) {
      group.addEventListener('mouseenter', () => { closeGroups(group); setOpen(group, true); });
      group.addEventListener('mouseleave', () => setOpen(group, false));
    }
  });

  // Клик мимо шапки закрывает открытый список.
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__group')) closeGroups();
  });

  // ===== Бургер-меню =====
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
    if (e.key !== 'Escape') return;
    if (menu.classList.contains('is-open')) toggle(false);

    // Esc закрывает открытый список и возвращает фокус на его кнопку —
    // иначе фокус остался бы на пункте скрытой панели.
    const open = groups.find((g) => g.classList.contains('is-open'));
    if (open) {
      setOpen(open, false);
      const btn = open.querySelector('.header__group-btn');
      if (btn && open.contains(document.activeElement)) btn.focus();
    }
  });
})();
