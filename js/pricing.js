// pricing.js — блок «Стоимость обучения» (ТЗ 06.09.2026, §13).
//
// Данные тарифов взяты из §13 дословно: состав пунктов, порядок и формулировки
// не менялись. Период «/ мес» стоит у всех шести цен — ответ клиента от 07.09.2026
// (в §13 он написан только у начальной школы).
//
// Неразрывные пробелы в строках — литеральные U+00A0: строки вставляются
// через textContent, сущность &nbsp; вывелась бы текстом.
(() => {
  'use strict';

  const root = document.querySelector('.pricing');
  if (!root) return;

  const stagesBox = root.querySelector('.pricing__stages');
  const grid = root.querySelector('.pricing__grid');
  if (!stagesBox || !grid) return;

  // Идентификаторы ступеней совпадают с data-stage в блоке «Выберите класс»
  // (index.html, .classes__card) — по ним блоки узнают выбор друг друга.
  const stages = [
    {
      id: 'primary',
      label: 'Начальная школа',
      plans: [
        {
          format: 'without',
          title: 'Без прикрепления',
          price: '19 000 ₽',
          period: '/ мес',
          items: [
            '4 урока в день;',
            'английский с 1 класса по кембриджским учебникам.',
          ],
          cta: 'Выбрать без прикрепления',
        },
        {
          format: 'with',
          title: 'С прикреплением',
          price: '29 000 ₽',
          period: '/ мес',
          intro: 'Включает всё из формата без прикрепления, а также:',
          items: [
            'помощь куратора класса в учебных и организационных вопросах;',
            'сопровождение прикрепления куратором;',
            'организационное сопровождение аттестации;',
            'групповые дополнительные занятия после уроков.',
          ],
          cta: 'Выбрать с прикреплением',
        },
      ],
    },
    {
      id: 'middle',
      label: 'Средняя школа',
      plans: [
        {
          format: 'without',
          title: 'Без прикрепления',
          price: '29 000 ₽',
          period: '/ мес',
          items: [
            '3–4 занятия по 90 минут;',
            'основное обучение заканчивается не позднее 16:15;',
            'английский по кембриджским учебникам.',
          ],
          cta: 'Выбрать без прикрепления',
        },
        {
          format: 'with',
          title: 'С прикреплением',
          price: '39 000 ₽',
          period: '/ мес',
          intro: 'Включает всё из формата без прикрепления, а также:',
          items: [
            'помощь куратора класса в учебных и организационных вопросах;',
            'сопровождение прикрепления куратором;',
            'французский, немецкий или китайский язык на выбор;',
            'групповые дополнительные занятия после уроков;',
            'организационное сопровождение аттестации.',
          ],
          cta: 'Выбрать с прикреплением',
        },
      ],
    },
    {
      id: 'senior',
      label: 'Старшая школа',
      plans: [
        {
          format: 'without',
          title: 'Без прикрепления',
          price: '35 000 ₽',
          period: '/ мес',
          items: [
            '3–4 занятия по 90 минут;',
            'основное обучение заканчивается не позднее 16:15;',
            'подробная обратная связь каждый учебный модуль по каждому предмету;',
            'английский по уровням по кембриджским учебникам;',
            'профильные классы.',
          ],
          cta: 'Выбрать без прикрепления',
        },
        {
          format: 'with',
          title: 'С прикреплением',
          price: '45 000 ₽',
          period: '/ мес',
          intro: 'Включает всё из формата без прикрепления, а также:',
          items: [
            'помощь куратора класса в учебных и организационных вопросах;',
            'сопровождение прикрепления куратором;',
            'французский, немецкий или китайский язык на выбор;',
            'групповые дополнительные занятия после уроков;',
            'организационное сопровождение аттестации;',
            'углублённая подготовка к ОГЭ/ЕГЭ на групповых дополнительных занятиях.',
          ],
          cta: 'Выбрать с прикреплением',
        },
      ],
    },
  ];

  const mobile = window.matchMedia('(max-width: 767px)');

  let currentStage = stages[0];
  // Раскрытая карточка на телефоне: на широких экранах состав виден всегда
  let openPlan = null;

  const chevron = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'pricing__chevron');
    svg.setAttribute('viewBox', '0 0 16 10');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '10');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M1 1.5 8 8.5l7-7');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.appendChild(path);
    return svg;
  };

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

  // --- Карточки тарифов ---

  const syncOpen = () => {
    const heads = Array.from(grid.querySelectorAll('.pricing__plan-head'));
    heads.forEach((head) => {
      // На широких экранах состав раскрыт всегда, и aria-expanded обязан
      // говорить правду: скринридер не должен звать закрытым то, что видно.
      const open = mobile.matches ? head === openPlan : true;
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  };

  const buildPlan = (plan) => {
    const item = document.createElement('li');
    item.className = 'pricing__plan';
    item.dataset.format = plan.format;

    const bodyId = `pricing-${currentStage.id}-${plan.format}`;

    const head = document.createElement('button');
    head.className = 'pricing__plan-head';
    head.type = 'button';
    head.setAttribute('aria-controls', bodyId);

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

    const headText = document.createElement('span');
    headText.className = 'pricing__plan-headtext';
    headText.append(title, priceRow);

    head.append(headText, chevron());

    const body = document.createElement('div');
    body.className = 'pricing__plan-body';
    body.id = bodyId;

    if (plan.intro) {
      const intro = document.createElement('p');
      intro.className = 'pricing__plan-intro';
      intro.textContent = plan.intro;
      body.appendChild(intro);
    }

    const list = document.createElement('ul');
    list.className = 'pricing__features';
    plan.items.forEach((text) => {
      const feature = document.createElement('li');
      feature.className = 'pricing__feature';
      feature.textContent = text;
      list.appendChild(feature);
    });
    body.appendChild(list);

    const cta = document.createElement('button');
    // Формат с прикреплением — полный вариант услуги, он и есть основное действие
    cta.className = `btn ${plan.format === 'with' ? 'btn--primary' : 'btn--white'} pricing__cta`;
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

    head.addEventListener('click', () => {
      openPlan = mobile.matches && openPlan === head ? null : head;
      syncOpen();
    });

    item.append(head, body, cta);
    return item;
  };

  const renderPlans = () => {
    grid.textContent = '';
    openPlan = null;
    currentStage.plans.forEach((plan) => grid.appendChild(buildPlan(plan)));
    grid.setAttribute('aria-label', `Тарифы: ${currentStage.label}`);
    syncOpen();
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
    }
  });

  mobile.addEventListener('change', syncOpen);

  syncTabs();
  renderPlans();
})();
