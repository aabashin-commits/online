// analytics.js — цели Яндекс.Метрики (ТЗ §22).
//
// Все десять событий из списка §22 собраны здесь, а не разложены по файлам
// блоков: так видно весь набор целей сразу, а отключается аналитика удалением
// одной строки в index.html. Слушатели делегированные (на document), поэтому
// блоки о существовании этого файла не знают и менять их не пришлось.
//
// ⚠️ Счётчик 37734395 — счётчик ОФЛАЙН-школы, скопированный вместе с версткой
// (см. CLAUDE.md, список временных данных). Пока он не заменён на счётчик
// онлайн-школы, цели двух сайтов складываются в одну статистику.
//
// ⚠️ Цель заявки (lead_success) срабатывает ТОЛЬКО по подтверждению от формы
// Битрикса, а не по клику — прямое требование §22 и чеклиста §23.
(() => {
  'use strict';

  const COUNTER = 37734395;

  // Тот же порог, что у блока стоимости (pricing.js): ниже него состав тарифа
  // сворачивается и шапка становится переключателем.
  const mobile = window.matchMedia('(max-width: 767px)');

  // Метрику может не быть: блокировщик, офлайн, локальный просмотр файла.
  // Тогда просто ничего не отправляем — страница работает как обычно.
  const send = (goal, extra) => {
    if (typeof window.ym !== 'function') return;
    const choice = window.schoolChoice || {};
    window.ym(COUNTER, 'reachGoal', goal, {
      cta_location: choice.cta_location || '',
      school_stage: choice.school_stage || '',
      education_format: choice.education_format || '',
      price: choice.price || '',
      ...extra,
    });
  };

  /* ---------- CTA ---------- */

  // Клик по любой CTA. main.js на том же клике проставляет cta_location
  // в window.schoolChoice, но порядок обработчиков не гарантирован, поэтому
  // место клика вычисляем здесь сами.
  document.addEventListener('click', (event) => {
    const cta = event.target.closest('[data-open-form]');
    if (!cta) return;

    const section = cta.closest('section, header, .mobile-cta');
    const location = cta.dataset.ctaLocation || (section && section.id) || '';

    send('cta_click', { cta_location: location });

    // Отдельные цели §22: первый экран и блок пробных дней
    if (cta.closest('#hero')) send('hero_cta', { cta_location: location });
    if (cta.closest('#trial')) send('trial_cta', { cta_location: location });
  });

  /* ---------- Выбор ступени и формата ---------- */

  // Слой состояния (main.js) шлёт school-choice при каждой смене значения,
  // и сеттеры молчат, если значение не изменилось, — лишних целей не будет.
  document.addEventListener('school-choice', (event) => {
    const { key, value } = event.detail || {};
    if (key === 'school_stage') send('stage_select', { school_stage: value });
    if (key === 'education_format') send('format_select', { education_format: value });
  });

  /* ---------- Блок стоимости ---------- */

  document.addEventListener('click', (event) => {
    // Переключение ступени внутри тарифов
    if (event.target.closest('.pricing__stage')) {
      send('tariff_switch');
      return;
    }

    // Раскрытие состава тарифа. ⚠️ Только на телефоне: на десктопе состав
    // всегда развёрнут и aria-expanded вечно «true» (pricing.js), поэтому без
    // проверки ширины цель улетала бы от любого клика по шапке тарифа.
    // Условие то же, что в pricing.js, — иначе цели разъедутся с поведением.
    // Читаем aria-expanded после обработчика блока: наш слушатель висит
    // на document и всплытие приводит его сюда последним.
    const head = event.target.closest('.pricing__plan-head');
    if (head && mobile.matches && head.getAttribute('aria-expanded') === 'true') {
      send('tariff_details_open', { plan: head.textContent.trim().slice(0, 60) });
    }
  });

  /* ---------- Дополнительные занятия, отзывы, FAQ ---------- */

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.additional__toggle');
    if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
      send('additional_expand');
    }

    const play = event.target.closest('.reviews__play');
    if (play) {
      send('review_play', { review: (play.getAttribute('aria-label') || '').slice(0, 60) });
    }

    const question = event.target.closest('.faq__question');
    if (question && question.getAttribute('aria-expanded') === 'true') {
      send('faq_open', { question: question.textContent.trim().slice(0, 60) });
    }
  });

  /* ---------- Успешная отправка заявки ---------- */

  // Битрикс в разных версиях загрузчика шлёт то b24:form:success, то
  // b24:form:submit; слушаем оба и на window, и на document — а чтобы одна
  // отправка не превратилась в две цели, глушим повторы на две секунды.
  let lastLead = 0;
  const onLead = () => {
    const now = Date.now();
    if (now - lastLead < 2000) return;
    lastLead = now;
    send('lead_success');
  };

  ['b24:form:success', 'b24:form:submit'].forEach((name) => {
    window.addEventListener(name, onLead);
    document.addEventListener(name, onLead);
  });
})();
