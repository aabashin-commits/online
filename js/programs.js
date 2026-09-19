// programs.js — табы образовательных программ и рендер расписания.
//
// ⚠️ 10.09.2026 файл вернулся из версии до правок по ТЗ (коммит 40ce47f) взамен
// school-day.js: клиент попросил показывать неделю так же, как на старом сайте —
// пять колонок-дней сразу, а не по одному дню через переключатель. Вместе с
// рендером вернулись и подписи табов («начальная / средняя / старшая школа»).
//
// ⚠️ 18.09.2026, правки клиента (§11 «корректировки сайта.md»): табов снова четыре —
// «1 класс · 2–4 класс · 5–8 класс · 9–11 класс». Расписания сняты с присланных
// макетов (папка «корректировки сайта», файлы 0/9/8/7.jpg), тексты перенесены
// из картинок в данные. ИЗО и технология из первого класса убраны по решению
// клиента: они противоречили §5 («в нашей школе нет ОБЖ, ИЗО, технологии и пр.»),
// поэтому в первом классе осталось по 4 урока в день.
// Второй элемент пары — оттенок плашки: цвет к предмету жёстко не привязан,
// это декор (одна и та же «География» в средней школе фиолетовая, в старшей розовая).
(() => {
  'use strict';

  const root = document.querySelector('.programs');
  if (!root) return;

  // Слотов в колонке столько, сколько уроков в самом длинном дне программы:
  // короткие дни добираются пустыми плашками, чтобы колонки были ровными.
  // ⚠️ Раньше слотов было жёстко 6 (три ступени, максимум 6 уроков). После
  // разбивки на четыре ступени (§11 корректировок от 18.09.2026) у 1 класса
  // максимум 4 урока, и фиксированные 6 давали два ряда пустых плашек.
  const slotsOf = (program) => Math.max(...program.days.map((day) => day.length));
  const DAYS = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница'];

  const PROGRAMS = [
    {
      label: '1 класс',
      stage: 'first',
      // Распорядок есть только у начальной школы (переписан под онлайн-день).
      // Для 5–8 и 9–11 ждём текст от клиента — блок скрывается сам.
      routine: 'Утренний круг 9:00–9:20 · Уроки в эфире 9:30–14:00 (4 урока) · Перерыв на обед 12:40–13:00 · '
        + 'Динамическая пауза 14:10–15:00 · Полдник 15:10–15:20 · Самоподготовка с куратором 15:30–16:30 · '
        + 'Кружки и факультативы до 17:00',
      days: [
        [['Свободная работа', 'magenta'], ['Русский язык', 'peach'], ['Математика', 'cyan'], ['Окружающий мир', 'pink']],
        [['Литературное чтение', 'blue'], ['Английский язык', 'green'], ['Каллиграфия', 'purple'], ['Математика', 'cyan']],
        [['Литературное чтение', 'blue'], ['Английский язык', 'green'], ['Русский язык', 'peach'], ['Литературное чтение', 'blue']],
        [['Литературное чтение', 'blue'], ['Русский язык', 'peach'], ['Каллиграфия', 'purple'], ['Математика', 'cyan']],
        [['Окружающий мир', 'pink'], ['Математика', 'cyan'], ['Каллиграфия', 'purple'], ['Литературное чтение', 'blue']],
      ],
    },
    {
      label: '2–4 класс',
      stage: 'primary',
      routine: 'Утренний круг 9:00–9:20 · Уроки в эфире 9:30–14:00 (4 урока) · Перерыв на обед 12:40–13:00 · '
        + 'Динамическая пауза 14:10–15:00 · Полдник 15:10–15:20 · Самоподготовка с куратором 15:30–16:30 · '
        + 'Кружки и факультативы до 17:00',
      days: [
        [['Русский язык', 'peach'], ['Английский язык', 'green'], ['Литературное чтение', 'blue'], ['Свободная работа', 'magenta']],
        [['Русский язык', 'peach'], ['Математика', 'cyan'], ['Окружающий мир', 'pink'], ['Литературное чтение', 'blue']],
        [['Математика', 'cyan'], ['Английский язык', 'green'], ['Русский язык', 'peach'], ['Окружающий мир', 'pink']],
        [['Математика', 'cyan'], ['Русский язык', 'peach'], ['Литературное чтение', 'blue'], ['Свободная работа', 'magenta']],
        [['Русский язык', 'peach'], ['Английский язык', 'green'], ['Математика', 'cyan'], ['Окружающий мир', 'pink']],
      ],
    },
    {
      label: '5–8 класс',
      stage: 'middle',
      routine: '',
      days: [
        [['Русский язык', 'peach'], ['Математика', 'cyan'], ['Литература', 'blue'], ['Биология', 'pink']],
        [['Математика', 'cyan'], ['История', 'mint'], ['Информатика', 'green'], ['Русский язык', 'peach']],
        [['Английский язык', 'green'], ['География', 'purple'], ['Математика', 'cyan'], ['Химия', 'magenta']],
        [['История', 'mint'], ['Русский язык', 'peach'], ['Физика', 'lime'], ['Английский язык', 'green']],
        [['Биология', 'pink'], ['Математика', 'cyan'], ['Обществознание', 'violet'], ['Литература', 'blue']],
      ],
    },
    {
      label: '9–11 класс',
      stage: 'senior',
      routine: '',
      days: [
        [['Литература', 'blue'], ['Математика', 'cyan'], ['Химия', 'magenta'], ['Английский язык', 'green']],
        [['Русский язык', 'peach'], ['История', 'mint'], ['Информатика', 'green'], ['Биология', 'pink']],
        [['Математика', 'cyan'], ['География', 'purple'], ['Обществознание', 'violet'], ['Литература', 'blue']],
        [['Биология', 'pink'], ['Физика', 'lime'], ['Русский язык', 'peach'], ['Информатика', 'green']],
        [['Английский язык', 'green'], ['Математика', 'cyan'], ['История', 'mint'], ['Химия', 'magenta']],
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

    const slots = slotsOf(program);

    DAYS.forEach((dayName, dayIndex) => {
      const column = document.createElement('div');
      column.className = 'programs__day';

      const head = document.createElement('span');
      head.className = 'programs__day-name';
      head.textContent = dayName;
      column.append(head);

      const lessons = program.days[dayIndex] || [];
      for (let slot = 0; slot < slots; slot += 1) {
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

  // silent — стартовый вызов при загрузке: вкладку включить надо, а вот записывать
  // ступень в состояние нельзя, иначе форма получит «начальную школу» как выбор
  // родителя, хотя он ничего не выбирал.
  const activateTab = (index, silent) => {
    currentIndex = index;

    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle('programs__tab--active', active);
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
