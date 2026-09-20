// pricing.js — блок «Стоимость обучения» (ТЗ 06.09.2026, §13).
//
// Тексты карточек — с сайта-источника world.lancman.online (16.09.2026,
// дословно, см. docs/prices-source.md): формулировки и порядок пунктов не менялись,
// правлены только ошибки и оформление списка (ё, строчная буква, «;»).
// Период «/ мес» стоит у всех шести цен — решение клиента (на источнике он есть
// только у начальной школы).
//
// 20.09.2026, правка клиента: у обоих тарифов один и тот же перечень услуг
// (features — список «С прикреплением»); в «Без прикрепления» то, чего в тарифе
// нет, стоит с красным крестом, что входит — с зелёной галочкой. Сколько первых
// пунктов входит в тариф, говорит included. Точки с запятой и точки в конце
// пунктов сняты: у списка с иконками они лишние.
//
// Неразрывные пробелы в строках — литеральные U+00A0: строки вставляются
// через textContent, сущность &nbsp; вывелась бы текстом.
(() => {
  'use strict';

  const root = document.querySelector('.pricing');
  if (!root) return;

  const stagesBox = root.querySelector('.pricing__stages');
  // Переключатель формата (16.09.2026, правка клиента): виден только на
  // телефоне, там из двух карточек показана одна — выбранная здесь.
  const formatsBox = root.querySelector('.pricing__formats');
  const grid = root.querySelector('.pricing__grid');
  if (!stagesBox || !grid) return;

  // Идентификаторы ступеней совпадают с data-stage в блоке «Выберите класс»
  // (index.html, .classes__card) — по ним блоки узнают выбор друг друга.
  const stages = [
    {
      id: 'primary',
      label: 'Начальная школа',
      // Единый перечень услуг: у «Без прикрепления» входят первые 7, остальные — с крестом
      features: [
        'до 15 детей в классе',
        '4 урока в день до 14:30',
        'занятия онлайн с учителем и одноклассниками (формат конференций)',
        'ручная проверка домашних заданий',
        'подробная обратная связь от учителей каждый учебный модуль',
        'школьный психолог',
        'английский с 1 класса по кембриджским учебникам',
        'помощь куратора класса в учебных и организационных вопросах',
        'сопровождение прикрепления куратором',
        'аттестация в школе-партнёре',
        'групповые дополнительные занятия после уроков',
      ],
      plans: [
        {
          format: 'without',
          title: 'Без прикрепления',
          price: '19 000 ₽',
          period: '/ мес',
          included: 7,
          cta: 'Выбрать без прикрепления',
        },
        {
          format: 'with',
          title: 'С прикреплением',
          price: '29 000 ₽',
          period: '/ мес',
          included: 11,
          cta: 'Выбрать с прикреплением',
        },
      ],
    },
    {
      id: 'middle',
      label: 'Средняя школа',
      // Единый перечень услуг: у «Без прикрепления» входят первые 7, остальные — с крестом
      features: [
        'до 15 детей в классе',
        '3–4 урока в день до 14:30 или 16:15',
        'занятия онлайн с учителем и одноклассниками (формат конференций)',
        'ручная проверка домашних заданий',
        'подробная обратная связь от учителей каждый учебный модуль',
        'школьный психолог',
        'английский по кембриджским учебникам',
        'помощь куратора класса в учебных и организационных вопросах',
        'сопровождение прикрепления куратором класса',
        'французский, немецкий или китайский — на выбор',
        'групповые дополнительные занятия после уроков',
        'аттестация в школе-партнёре (заочная или семейная форма)',
      ],
      plans: [
        {
          format: 'without',
          title: 'Без прикрепления',
          price: '29 000 ₽',
          period: '/ мес',
          included: 7,
          cta: 'Выбрать без прикрепления',
        },
        {
          format: 'with',
          title: 'С прикреплением',
          price: '39 000 ₽',
          period: '/ мес',
          included: 12,
          cta: 'Выбрать с прикреплением',
        },
      ],
    },
    {
      id: 'senior',
      label: 'Старшая школа',
      // Единый перечень услуг: у «Без прикрепления» входят первые 8, остальные — с крестом
      features: [
        'до 15 детей в классе',
        '3–4 урока в день до 14:30 или 16:15',
        'занятия онлайн с учителем и одноклассниками (формат конференций)',
        'ручная проверка домашних заданий',
        'подробная обратная связь от учителей каждый учебный модуль по каждому предмету',
        'школьный психолог',
        'английский по уровням по кембриджским учебникам',
        'профильные классы',
        'помощь куратора класса в учебных и организационных вопросах',
        'сопровождение прикрепления куратором класса',
        'французский, немецкий, китайский — на выбор',
        'групповые дополнительные занятия после уроков',
        'аттестация в школе-партнёре (заочная или семейная форма)',
        'углублённая подготовка к ОГЭ/ЕГЭ на групповых дополнительных занятиях',
      ],
      plans: [
        {
          format: 'without',
          title: 'Без прикрепления',
          price: '35 000 ₽',
          period: '/ мес',
          included: 8,
          cta: 'Выбрать без прикрепления',
        },
        {
          format: 'with',
          title: 'С прикреплением',
          price: '45 000 ₽',
          period: '/ мес',
          included: 14,
          cta: 'Выбрать с прикреплением',
        },
      ],
    },
  ];

  const formats = [
    { id: 'without', label: 'Без прикрепления' },
    { id: 'with', label: 'С прикреплением' },
  ];

  let currentStage = stages[0];
  let currentFormat = formats[0].id;

  // --- Табы ступеней ---

  const tabs = stages.map((stage) => {
    const tab = document.createElement('button');
    tab.className = 'pricing__stage';
    tab.type = 'button';
    tab.dataset.stage = stage.id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'pricing-plans');
    tab.textContent = stage.label;
    stagesBox.appendChild(tab);
    return tab;
  });

  grid.setAttribute('role', 'tabpanel');

  const syncTabs = () => {
    tabs.forEach((tab) => {
      const active = tab.dataset.stage === currentStage.id;
      tab.classList.toggle('pricing__stage--active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });
  };

  // --- Переключатель формата (только телефон, прячет его CSS) ---

  const formatTabs = formatsBox ? formats.map((format) => {
    const tab = document.createElement('button');
    tab.className = 'pricing__format';
    tab.type = 'button';
    tab.dataset.format = format.id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', 'pricing-plans');
    tab.textContent = format.label;
    formatsBox.appendChild(tab);
    return tab;
  }) : [];

  // Какая карточка видна на телефоне, решает CSS по data-visible у сетки
  const syncFormat = () => {
    grid.dataset.visible = currentFormat;
    formatTabs.forEach((tab) => {
      const active = tab.dataset.format === currentFormat;
      tab.classList.toggle('pricing__format--active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });
  };

  const selectFormat = (id) => {
    if (!formats.some((format) => format.id === id)) return;
    currentFormat = id;
    syncFormat();
  };

  formatTabs.forEach((tab) => {
    tab.addEventListener('click', () => selectFormat(tab.dataset.format));

    tab.addEventListener('keydown', (event) => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = formatTabs[(formatTabs.indexOf(tab) + step + formatTabs.length) % formatTabs.length];
      next.focus();
      selectFormat(next.dataset.format);
    });
  });

  // --- Карточки тарифов ---

  // Иконка пункта (20.09.2026, правка клиента): зелёная галочка — услуга входит
  // в тариф, красный крест — не входит. Цвет задаёт CSS через currentColor.
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const buildIcon = (included) => {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'pricing__icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '12');
    circle.setAttribute('fill', 'currentColor');

    const mark = document.createElementNS(SVG_NS, 'path');
    mark.setAttribute('d', included ? 'M7 12.4l3.2 3.2L17 8.8' : 'M8 8l8 8M16 8l-8 8');
    mark.setAttribute('stroke-width', '2');
    mark.setAttribute('stroke-linecap', 'round');
    mark.setAttribute('stroke-linejoin', 'round');

    svg.append(circle, mark);
    return svg;
  };

  const buildPlan = (plan) => {
    const item = document.createElement('li');
    item.className = 'pricing__plan';
    item.dataset.format = plan.format;

    // 16.09.2026, правка клиента: аккордеон на телефоне снят, состав
    // раскрыт на всех ширинах — заголовок больше не кнопка.
    const head = document.createElement('div');
    head.className = 'pricing__plan-head';

    const title = document.createElement('span');
    title.className = 'pricing__plan-title';
    title.textContent = plan.title;

    const priceRow = document.createElement('span');
    priceRow.className = 'pricing__price';

    const price = document.createElement('span');
    price.className = 'pricing__price-value';
    price.textContent = plan.price;

    const period = document.createElement('span');
    period.className = 'pricing__price-period';
    period.textContent = plan.period;

    priceRow.append(price, period);

    head.append(title, priceRow);

    const body = document.createElement('div');
    body.className = 'pricing__plan-body';

    if (plan.intro) {
      const intro = document.createElement('p');
      intro.className = 'pricing__plan-intro';
      intro.textContent = plan.intro;
      body.appendChild(intro);
    }

    const list = document.createElement('ul');
    list.className = 'pricing__features';
    currentStage.features.forEach((text, index) => {
      const included = index < plan.included;
      const feature = document.createElement('li');
      feature.className = `pricing__feature pricing__feature--${included ? 'yes' : 'no'}`;

      const label = document.createElement('span');
      label.className = 'pricing__sr';
      label.textContent = included ? 'Входит: ' : 'Не входит: ';

      feature.append(buildIcon(included), label, text);
      list.appendChild(feature);
    });
    body.appendChild(list);

    const cta = document.createElement('button');
    // ⚠️ 10.09.2026, правки клиента: подсвечены обе кнопки. Раньше «Без
    // прикрепления» была белой (btn--white), чтобы основным действием читался
    // полный тариф; клиент попросил уравнять — иерархию теперь держат цена
    // и состав пунктов, а не вид кнопки.
    cta.className = `btn btn--primary pricing__cta`;
    cta.type = 'button';
    cta.textContent = plan.cta;
    cta.dataset.openForm = `Стоимость — ${currentStage.label} — ${plan.title}`;
    cta.dataset.ctaLocation = 'pricing';

    // Слушатель карточки срабатывает раньше делегированного обработчика
    // [data-open-form] в main.js: к моменту открытия формы выбор уже записан.
    cta.addEventListener('click', () => {
      if (typeof window.setSchoolStage === 'function') window.setSchoolStage(currentStage.id);
      if (typeof window.setPrice === 'function') window.setPrice(`${plan.price} ${plan.period}`);
      if (typeof window.setEducationFormat === 'function') window.setEducationFormat(plan.format);
    });

    item.append(head, body, cta);
    return item;
  };

  const renderPlans = () => {
    grid.textContent = '';
    currentStage.plans.forEach((plan) => grid.appendChild(buildPlan(plan)));
    grid.setAttribute('aria-label', `Тарифы: ${currentStage.label}`);
  };

  const selectStage = (id) => {
    const stage = stages.find((item) => item.id === id);
    if (!stage || stage === currentStage) return;
    currentStage = stage;
    syncTabs();
    renderPlans();
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectStage(tab.dataset.stage);
      // Ступень, выбранная здесь, — такой же осознанный выбор, как в блоке классов
      if (typeof window.setSchoolStage === 'function') window.setSchoolStage(tab.dataset.stage);
    });

    tab.addEventListener('keydown', (event) => {
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = tabs[(tabs.indexOf(tab) + step + tabs.length) % tabs.length];
      next.focus();
      selectStage(next.dataset.stage);
      if (typeof window.setSchoolStage === 'function') window.setSchoolStage(next.dataset.stage);
    });
  });

  // Ступень могли выбрать в блоке «Выберите класс», формат — в блоке форматов:
  // подхватываем оба, чтобы родитель увидел здесь свой выбор, а не первый таб.
  document.addEventListener('school-choice', (event) => {
    if (event.detail.key === 'school_stage' && event.detail.value) {
      selectStage(event.detail.value);
    }
    if (event.detail.key === 'education_format') {
      root.dataset.format = event.detail.value || '';
      // Формат, выбранный в другом блоке, сразу показываем на телефоне
      if (event.detail.value) selectFormat(event.detail.value);
    }
  });

  syncTabs();
  syncFormat();
  renderPlans();
})();
