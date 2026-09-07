// school-day.js — блок «Как проходит учебный день»: переключатель ступеней
// и рендер примера учебной недели (ТЗ 06.09.2026, §9).
//
// ⚠️ 07.09.2026 файл переименован из programs.js. Данные расписания сняты
// из Figma, секция «Расписание» 1:20850 (см. Tz/raspisanie.md), и §9 велит
// сохранить их как есть. Изменились только подписи табов: ТЗ требует
// «1–4 класс · 5–8 класс · 9–11 класс» вместо названий ступеней.
//
// Второй элемент пары — оттенок плашки: цвет к предмету жёстко не привязан,
// это декор (одна и та же «География» в средней школе фиолетовая, в старшей розовая).
(() => {
  'use strict';

  const root = document.querySelector('.school-day');
  if (!root) return;

  // Колонки выравниваются по самому длинному дню ступени: недостающие уроки
  // добираются пустыми плашками, а лишних рядов внизу не остаётся.
  // На телефоне пустые плашки скрыты стилями — там виден один день.
  const DAYS = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница'];
  const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

  const PROGRAMS = [
    {
      label: '1–4 класс',
      stage: 'primary',
      // Распорядок в макете есть только у начальной школы (переписан под онлайн-день).
      // Для средней и старшей ждём текст от клиента — блок скрывается сам.
      // ⚠️ Строка противоречит нагрузке из ТЗ (4 урока, окончание не позднее 16:15):
      // сохранена дословно по §9, расхождение — в списке на ревью клиенту.
      routine: 'Утренний круг 9:00–9:20 · Уроки в эфире 9:30–14:00 (5 уроков) · Перерыв на обед 12:40–13:00 · '
        + 'Динамическая пауза 14:10–15:00 · Полдник 15:10–15:20 · Самоподготовка с куратором 15:30–16:30 · '
        + 'Кружки и факультативы до 17:00',
      days: [
        [['Русский язык', 'peach'], ['Английский язык', 'green'], ['Математика', 'cyan'], ['Литературное чтение', 'blue']],
        [['Русский язык', 'peach'], ['Математика', 'cyan'], ['Окружающий мир', 'pink'], ['Литературное чтение', 'blue']],
        [['Математика', 'cyan'], ['Английский язык', 'green'], ['Русский язык', 'peach'], ['Литературное чтение', 'blue']],
        [['Математика', 'cyan'], ['Русский язык', 'peach'], ['Литературное чтение', 'blue'], ['Окружающий мир', 'pink']],
        [['Русский язык', 'peach'], ['Литературное чтение', 'blue'], ['Математика', 'cyan'], ['РПС', 'purple']],
      ],
    },
    {
      label: '5–8 класс',
      stage: 'middle',
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
      label: '9–11 класс',
      stage: 'senior',
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

  const tabsBox = root.querySelector('.school-day__tabs');
  const daysBox = root.querySelector('.school-day__days');
  const schedule = root.querySelector('.school-day__schedule');
  const routine = root.querySelector('.school-day__routine');
  if (!tabsBox || !daysBox || !schedule || !routine) return;

  schedule.id = 'school-day-schedule';

  // Табы строим из данных, чтобы разметка не расходилась со списком ступеней
  const tabs = PROGRAMS.map((program, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'school-day__tab';
    tab.textContent = program.label;
    tab.id = `school-day-tab-${index}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', schedule.id);
    tabsBox.append(tab);
    return tab;
  });

  // Переключатель дней. В разметке его нет: на десктопе и планшете видны все
  // пять колонок сразу, кнопки нужны только телефону (ТЗ §9 — показывать
  // расписание по одному дню, а не сжимать пятидневку).
  const dayButtons = DAYS_SHORT.map((short, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'school-day__day-btn';
    button.textContent = short;
    button.id = `school-day-day-${index}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', schedule.id);
    button.setAttribute('aria-label', DAYS[index]);
    daysBox.append(button);
    return button;
  });

  let currentIndex = 0;
  let currentDay = 0;

  // Колонки перерисовываются при смене ступени, поэтому подсветку выбранного
  // дня ставим отдельным проходом — после каждого рендера.
  const applyDay = () => {
    const columns = schedule.children;
    for (let index = 0; index < columns.length; index += 1) {
      columns[index].classList.toggle('school-day__day--active', index === currentDay);
    }

    dayButtons.forEach((button, index) => {
      const active = index === currentDay;
      button.classList.toggle('school-day__day-btn--active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.setAttribute('tabindex', active ? '0' : '-1');
    });
  };

  const renderSchedule = (program) => {
    const grid = document.createDocumentFragment();
    const slots = Math.max(...program.days.map((day) => day.length));

    DAYS.forEach((dayName, dayIndex) => {
      const column = document.createElement('div');
      column.className = 'school-day__day';

      const head = document.createElement('span');
      head.className = 'school-day__day-name';
      head.textContent = dayName;
      column.append(head);

      const lessons = program.days[dayIndex] || [];
      for (let slot = 0; slot < slots; slot += 1) {
        const lesson = lessons[slot];
        const cell = document.createElement('span');
        cell.className = lesson
          ? `school-day__lesson school-day__lesson--${lesson[1]}`
          : 'school-day__lesson school-day__lesson--empty';
        if (lesson) cell.textContent = lesson[0];
        column.append(cell);
      }

      grid.append(column);
    });

    schedule.replaceChildren(grid);
    applyDay();

    routine.textContent = program.routine;
    routine.hidden = !program.routine;
  };

  // silent — стартовый вызов при загрузке: вкладку включить надо, а вот записывать
  // ступень в состояние нельзя, иначе форма получит «начальную школу» как выбор
  // родителя, хотя он ничего не выбирал.
  const activateTab = (index, silent) => {
    currentIndex = index;

    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle('school-day__tab--active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    schedule.setAttribute('aria-labelledby', tabs[index].id);
    renderSchedule(PROGRAMS[index]);

    // Выбранная ступень пригодится форме и блоку стоимости (ТЗ §20)
    if (!silent && typeof window.setSchoolStage === 'function') {
      window.setSchoolStage(PROGRAMS[index].stage);
    }
  };

  // Высота карточки не должна прыгать при переключении ступеней: у средней и
  // старшей школы нет распорядка дня, поэтому карточка выходит ниже.
  // Прогоняем все программы, запоминаем самую высокую и фиксируем её как
  // min-height. Считаем именно так, а не константой в CSS: когда клиент
  // пришлёт распорядки для средней и старшей, выравнивание останется верным.
  const card = root.querySelector('.school-day__card');

  const syncCardHeight = () => {
    if (!card) return;

    card.style.minHeight = '';

    // На телефоне выравнивать нечего: виден один день, и запертая высота
    // оставила бы под расписанием полкарточки пустоты.
    if (window.innerWidth <= 767) return;

    let tallest = 0;
    PROGRAMS.forEach((program) => {
      renderSchedule(program);
      tallest = Math.max(tallest, card.offsetHeight);
    });

    renderSchedule(PROGRAMS[currentIndex]);
    card.style.minHeight = `${Math.ceil(tallest)}px`;
  };

  // Стрелки листают табы по кругу — общий обработчик для обеих лент
  const bindArrows = (buttons, activate) => {
    buttons.forEach((button, index) => {
      button.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const nextIndex = event.key === 'ArrowRight'
          ? (index + 1) % buttons.length
          : (index - 1 + buttons.length) % buttons.length;
        buttons[nextIndex].focus();
        activate(nextIndex);
      });
    });
  };

  tabs.forEach((tab, index) => tab.addEventListener('click', () => activateTab(index)));
  bindArrows(tabs, activateTab);

  const activateDay = (index) => {
    currentDay = index;
    applyDay();
  };

  dayButtons.forEach((button, index) => button.addEventListener('click', () => activateDay(index)));
  bindArrows(dayButtons, activateDay);

  activateTab(0, true);
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
