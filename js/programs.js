// programs.js — табы образовательных программ и рендер расписания.
// Данные сняты из Figma, секция «Расписание» 1:20850 (см. Tz/raspisanie.md).
// Второй элемент пары — оттенок плашки: цвет к предмету жёстко не привязан,
// это декор (одна и та же «География» в средней школе фиолетовая, в старшей розовая).
(() => {
  'use strict';

  const root = document.querySelector('.programs');
  if (!root) return;

  // Слотов в колонке всегда 6: недостающие добираются пустыми плашками.
  const SLOTS = 6;
  const DAYS = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница'];

  const PROGRAMS = [
    {
      label: 'начальная школа',
      // Распорядок в макете есть только у начальной школы (переписан под онлайн-день).
      // Для средней и старшей ждём текст от клиента — блок скрывается сам.
      routine: 'Утренний круг 9:00–9:20 · Уроки в эфире 9:30–14:00 (5 уроков) · Перерыв на обед 12:40–13:00 · '
        + 'Динамическая пауза 14:10–15:00 · Полдник 15:10–15:20 · Самоподготовка с куратором 15:30–16:30 · '
        + 'Кружки и факультативы до 17:00',
      days: [
        [['Русский язык', 'peach'], ['Английский язык', 'green'], ['Математика', 'cyan'], ['Литературное чтение', 'blue']],
        [['Русский язык', 'peach'], ['Математика', 'cyan'], ['Окружающий мир', 'pink'], ['Литературное чтение', 'blue']],
        [['Математика', 'cyan'], ['Английский язык', 'green'], ['Русский язык', 'peach'], ['Литературное чтение', 'blue']],
        [['Математика', 'cyan'], ['Русский язык', 'peach'], ['Литературное чтение', 'blue'], ['Окружающий мир', 'pink']],
        [['Русский язык', 'peach'], ['Литературное чтение', 'blue'], ['Математика', 'cyan'], ['РПС', 'purple']],
      ],
    },
    {
      label: 'средняя школа',
      routine: '',
      days: [
        [['Математика', 'cyan'], ['Русский язык', 'peach'], ['Литература', 'blue']],
        [['Английский', 'green'], ['Биология', 'pink'], ['География', 'purple']],
        [['Химия', 'magenta'], ['Химия', 'magenta'], ['Литература', 'blue'], ['Математика', 'cyan']],
        [['Русский язык', 'peach'], ['Английский', 'green']],
        [['Физика', 'lime'], ['Математика', 'cyan'], ['История', 'mint'], ['Обществознание', 'violet']],
      ],
    },
    {
      label: 'старшая школа',
      routine: '',
      days: [
        [['Математика', 'cyan'], ['Биология', 'pink'], ['Английский', 'green'], ['Обществознание', 'violet']],
        [['Русский язык', 'peach'], ['Английский', 'green'], ['Математика', 'cyan']],
        [['История', 'mint'], ['Обществознание', 'violet'], ['Физика', 'lime'], ['Литература', 'blue']],
        [['Русский язык', 'peach'], ['Литература', 'blue'], ['История', 'mint'], ['География', 'pink']],
        [['Химия', 'magenta'], ['Химия', 'magenta'], ['Математика', 'cyan']],
      ],
    },
  ];

  const tabsBox = root.querySelector('.programs__tabs');
  const schedule = root.querySelector('.programs__schedule');
  const routine = root.querySelector('.programs__routine');
  if (!tabsBox || !schedule || !routine) return;

  schedule.id = 'programs-schedule';

  // Табы строим из данных, чтобы разметка не расходилась со списком программ
  const tabs = PROGRAMS.map((program, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'programs__tab';
    tab.textContent = program.label;
    tab.id = `programs-tab-${index}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', schedule.id);
    tabsBox.append(tab);
    return tab;
  });

  const renderSchedule = (program) => {
    const grid = document.createDocumentFragment();

    DAYS.forEach((dayName, dayIndex) => {
      const column = document.createElement('div');
      column.className = 'programs__day';

      const head = document.createElement('span');
      head.className = 'programs__day-name';
      head.textContent = dayName;
      column.append(head);

      const lessons = program.days[dayIndex] || [];
      for (let slot = 0; slot < SLOTS; slot += 1) {
        const lesson = lessons[slot];
        const cell = document.createElement('span');
        cell.className = lesson
          ? `programs__lesson programs__lesson--${lesson[1]}`
          : 'programs__lesson programs__lesson--empty';
        if (lesson) cell.textContent = lesson[0];
        column.append(cell);
      }

      grid.append(column);
    });

    schedule.replaceChildren(grid);

    routine.textContent = program.routine;
    routine.hidden = !program.routine;
  };

  let currentIndex = 0;

  const activateTab = (index) => {
    currentIndex = index;

    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle('programs__tab--active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    schedule.setAttribute('aria-labelledby', tabs[index].id);
    renderSchedule(PROGRAMS[index]);
  };

  // Высота карточки не должна прыгать при переключении табов: у средней и
  // старшей школы нет распорядка дня, поэтому карточка выходит ниже (а вместе
  // с ней и соседняя синяя — она тянется по высоте белой).
  // Прогоняем все программы, запоминаем самую высокую и фиксируем её как
  // min-height. Считаем именно так, а не константой в CSS: когда клиент
  // пришлёт распорядки для средней и старшей, выравнивание останется верным.
  const card = root.querySelector('.programs__card');

  const syncCardHeight = () => {
    if (!card) return;

    card.style.minHeight = '';
    let tallest = 0;
    PROGRAMS.forEach((program) => {
      renderSchedule(program);
      tallest = Math.max(tallest, card.offsetHeight);
    });

    renderSchedule(PROGRAMS[currentIndex]);
    card.style.minHeight = `${Math.ceil(tallest)}px`;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(index));
    tab.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const nextIndex = event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activateTab(nextIndex);
    });
  });

  activateTab(0);
  syncCardHeight();

  // Пересчёт после подгрузки Onest: с системным шрифтом строки переносятся
  // иначе, и замеренная высота была бы неверной.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncCardHeight);
  }

  // На другой ширине меняется и число строк распорядка, и сетка уроков
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncCardHeight, 150);
  });
})();
