// additional.js — блок «Больше, чем школьная программа» (ТЗ 06.09.2026, §14).
// Файл был js/electives.js (блок «Факультативы/профориентация»): прежние
// направления не совпадали со списком ТЗ, поэтому данные заменены целиком.
//
// Полный список берётся из §14 дословно, пятью категориями. Раскрывается
// по кнопке — на телефоне ещё и по категориям, чтобы список не превращался
// в простыню на весь экран.
//
// Неразрывные пробелы в строках — литеральные U+00A0: строки вставляются
// через textContent, сущность &nbsp; вывелась бы текстом.
(() => {
  'use strict';

  const root = document.querySelector('.additional');
  if (!root) return;

  const groups = [
    {
      title: 'Языки',
      items: [
        'немецкий базовый и продвинутый',
        'французский базовый и продвинутый',
        'китайский базовый и продвинутый',
        'японский базовый',
      ],
    },
    {
      title: 'IT, наука и проекты',
      items: [
        'Scratch-программирование',
        'астрономический кружок «Невидимая вселенная»',
        '«Первые шаги в науку»',
        'дизайн-мастерская',
        '«Я и проект»',
      ],
    },
    {
      title: 'Развитие навыков',
      items: [
        'скорочтение с элементами мнемотехники',
        'мнемотехника',
        'функциональная грамотность',
        'финансовая грамотность и профориентация',
      ],
    },
    {
      title: 'География и окружающий мир',
      items: [
        'игровая география',
        'маршруты Москвы и области',
        'подготовка к ОГЭ по географии',
        'прогулки по городам России',
        'биология для любопытных',
      ],
    },
    {
      title: 'Гуманитарные и психологические занятия',
      items: [
        '«Волшебный мир сказки»',
        '«Будь собой»',
      ],
    },
  ];

  const list = root.querySelector('.additional__list');
  const toggle = root.querySelector('.additional__toggle');
  const mobile = window.matchMedia('(max-width: 767px)');

  const chevron = (className) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', className);
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

  // --- Полный список направлений ---

  let openGroup = null;

  const groupHeads = [];

  const syncGroups = () => {
    groupHeads.forEach((head) => {
      // На широких экранах категории раскрыты всегда — aria-expanded не должен
      // сообщать скринридеру, что видимый список закрыт.
      const open = mobile.matches ? head === openGroup : true;
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  };

  if (list) {
    groups.forEach((group, index) => {
      const item = document.createElement('div');
      item.className = 'additional__group';

      const bodyId = `additional-group-${index + 1}`;

      const head = document.createElement('button');
      head.className = 'additional__group-head';
      head.type = 'button';
      head.setAttribute('aria-controls', bodyId);

      const title = document.createElement('span');
      title.className = 'additional__group-title';
      title.textContent = group.title;

      head.append(title, chevron('additional__group-chevron'));

      const items = document.createElement('ul');
      items.className = 'additional__group-list';
      items.id = bodyId;

      group.items.forEach((text) => {
        const li = document.createElement('li');
        li.className = 'additional__group-item';
        li.textContent = text;
        items.appendChild(li);
      });

      head.addEventListener('click', () => {
        openGroup = mobile.matches && openGroup === head ? null : head;
        syncGroups();
      });

      groupHeads.push(head);
      item.append(head, items);
      list.appendChild(item);
    });

    syncGroups();
  }

  if (toggle && list) {
    const labels = {
      open: 'Посмотреть все направления',
      close: 'Свернуть список направлений',
    };

    toggle.addEventListener('click', () => {
      const open = list.hidden;
      list.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? labels.close : labels.open;
      // Кнопка стоит над списком: при раскрытии фокус уводим внутрь,
      // иначе с клавиатуры пришлось бы «пролистывать» весь список заново.
      if (open && groupHeads[0]) groupHeads[0].focus();
    });
  }

  // --- Три карточки: accordion на телефоне ---

  const cardHeads = Array.from(root.querySelectorAll('.additional__card-head'));
  let openCard = null;

  const syncCards = () => {
    cardHeads.forEach((head) => {
      const open = mobile.matches ? head === openCard : true;
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  };

  cardHeads.forEach((head) => {
    head.addEventListener('click', () => {
      openCard = mobile.matches && openCard === head ? null : head;
      syncCards();
    });
  });

  mobile.addEventListener('change', () => {
    syncCards();
    syncGroups();
  });

  syncCards();
})();
