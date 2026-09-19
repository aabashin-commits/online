// about.js — блок «Обучайтесь комфортно»: категории × люди, вертикальная лента
// миниатюр с кастомным скроллбаром и стрелками.
//
// ⚠️ 10.09.2026, правки клиента: блок перенесён один в один с основного сайта
// (../скул офлайн/js/staff.js). Сетка профилей с кнопкой «Посмотреть всех
// преподавателей», аккордеон ролей и карточка лицензии убраны — вместо них
// снова карусель. Данные о людях наши, онлайновые (ТЗ §11), механика — оттуда.
// Имена классов оставлены прежними (.about__*), чтобы не трогать меню и docs.
(() => {
  'use strict';

  const root = document.querySelector('.about');
  if (!root) return;

  // Состав — из двух презентаций клиента: «ПЕДАГОГИ БУТОВО.pptx» (10 чел.) и
  // «Педагоги ЦЕНТР Моя школа LS.pptx» (17 чел.), обе от 27–28.07.2026. Итого 27
  // педагогов в 5 предметных категориях (группировка согласована с клиентом);
  // Бутово и Центр объединены по направлениям. Кураторы и администратор Центра
  // (Быкова, Иорданова, Рябуха, Болтухина) по решению клиента — в «руководящем составе».
  // Исключены по просьбе клиента: из Бутово — Бачурина, Лебедева, Панова, Кудрина,
  // Крылова, Семикян, Савицкая; из Центра — Амирханян, Якимкина, Емельянова, Чуваева, Трепалина.
  // Фото — вырезки «голова+плечи» из снимков презентации: главное круглое
  // (assets/img/staff/<slug>.webp) и вырезка без фона для миниатюры (…-thumb.webp).
  // lead/text — сжатые выжимки из презентации; на согласовании у клиента (см. PLAN.md).
  // Разметка: **кусок** превращается в акцентный (более тёмный) span.
  // ⚠️ Неразрывные пробелы в текстах — литеральный U+00A0 (не «&nbsp;»): часть
  // строк идёт через textContent, где сущность вывелась бы как текст. Стоят после
  // коротких предлогов/союзов, в «число+единица» и инициалах.
  const categories = [
    {
      id: 'primary',
      label: 'начальная школа',
      people: [
        {
          name: 'Кузнецова Татьяна Алексеевна',
          photo: 'assets/img/staff/kuznetsova.webp',
          thumb: 'assets/img/staff/kuznetsova-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'стаж 8 лет' }],
          lead: 'Учитель начальных классов и **социальный педагог по сопровождению детей группы риска** (САФУ им. М. В. Ломоносова)',
          text: 'Окончила Архангельский педагогический колледж. Убеждена, что **современный учитель — это наставник, который умеет поддержать, вдохновить и найти подход к каждому ребёнку**.',
        },
        {
          name: 'Колесникова Марина Андреевна',
          photo: 'assets/img/staff/kolesnikova.webp',
          thumb: 'assets/img/staff/kolesnikova-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'стаж 8 лет' }],
          lead: 'Учитель начальных классов и **педагог-психолог начального образования** (магистратура ЮУрГГПУ)',
          text: '**Призёр конкурса «Педагогический дебют» и лучший выпускник университета 2021 года.** Любит музыку и играет на фортепиано.',
        },
        {
          name: 'Николаева Надежда Андреевна',
          photo: 'assets/img/staff/nikolaeva.webp',
          thumb: 'assets/img/staff/nikolaeva-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'стаж 7 лет' }],
          lead: 'Учитель начальных классов, выпускница **СГУ им. Н. Г. Чернышевского**',
          text: 'Ученики участвуют во всероссийских олимпиадах и муниципальных конкурсах. **Разрабатывала учебные материалы для платформы Учи.ру.**',
        },
        {
          name: 'Костерина Галина Леонидовна',
          photo: 'assets/img/staff/kosterina.webp',
          thumb: 'assets/img/staff/kosterina-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'стаж 8 лет' }],
          lead: 'Клинический психолог (РГГУ) и магистр программы **«Инновационная начальная школа»** (МПГУ)',
          text: 'Ученики **успешно сдают ВПР**, участвуют в конкурсах и олимпиадах. Больше всего ценит возможность наблюдать, как дети растут и преодолевают трудности.',
        },
      ],
    },
    {
      id: 'humanities',
      label: 'гуманитарные науки',
      people: [
        {
          name: 'Белявичюс Мария Сергеевна',
          photo: 'assets/img/staff/belyavichyus.webp',
          thumb: 'assets/img/staff/belyavichyus-thumb.webp',
          badges: [{ text: 'история и обществознание', solid: true }, { text: 'стаж 12 лет' }],
          lead: 'Историк, преподаватель истории (**Кубанский государственный университет**)',
          text: 'Ученики показывают **высокие результаты на ГИА и поступают в престижные вузы страны**. Руководила районным методическим объединением учителей истории и обществознания.',
        },
        {
          name: 'Дунаев Андрей Олегович',
          photo: 'assets/img/staff/dunaev.webp',
          thumb: 'assets/img/staff/dunaev-thumb.webp',
          badges: [{ text: 'литература и русский язык', solid: true }, { text: 'стаж 8 лет' }],
          lead: 'Литературный работник, выпускник **Литературного института им. А. М. Горького**',
          text: 'Ученики сдают **русский язык на 85+ и литературу на 90+ баллов**. В работе ценит творческий подход и живое общение.',
        },
        {
          name: 'Белешева Евгения Вадимовна',
          photo: 'assets/img/staff/belesheva.webp',
          thumb: 'assets/img/staff/belesheva-thumb.webp',
          badges: [{ text: 'литература и русский язык', solid: true }, { text: 'стаж 7 лет' }],
          lead: 'Педагог-филолог (**Тюменский государственный университет**), курсы по методике работы с детьми разной мотивации',
          text: 'Ученики — **призёры олимпиад по русскому языку и литературе**, сдают ЕГЭ на 75+, отдельные ребята — на 95+ баллов.',
        },
        {
          name: 'Бондарчук Анастасия Сергеевна',
          photo: 'assets/img/staff/bondarchuk.webp',
          thumb: 'assets/img/staff/bondarchuk-thumb.webp',
          badges: [{ text: 'русский язык', solid: true }, { text: 'стаж 7 лет' }],
          lead: 'Филолог (Кубанский государственный университет) со **вторым высшим — психологическим**',
          text: '**Каждый четвёртый ученик сдаёт ЕГЭ на 90+**, средняя оценка ОГЭ — 4,66. Среди выпускников — лауреат перечневой олимпиады, поступивший в РЭУ им. Плеханова на бюджет.',
        },
        {
          name: 'Фридер Екатерина Ивановна',
          photo: 'assets/img/staff/frider.webp',
          thumb: 'assets/img/staff/frider-thumb.webp',
          badges: [{ text: 'литература и русский язык', solid: true }, { text: 'стаж 30 лет' }],
          lead: '**Эксперт по проверке экзаменационных работ** по русскому языку и литературе',
          text: 'Ученики набирали **100 баллов по русскому языку и литературе**, побеждали на региональной олимпиаде и становились призёрами российского этапа. Педагог в третьем поколении.',
        },
      ],
    },
    {
      id: 'science',
      label: 'точные и естественные науки',
      people: [
        {
          name: 'Гурьянова Александра Михайловна',
          photo: 'assets/img/staff/guryanova.webp',
          thumb: 'assets/img/staff/guryanova-thumb.webp',
          badges: [{ text: 'математика', solid: true }, { text: 'стаж 9 лет' }],
          lead: 'Педагогическое образование по математике и информатике (**Вятский государственный университет**)',
          text: '**Средний балл учеников на ОГЭ — 4,6, по информатике — 4,8.** Победитель районных олимпиад по информатике.',
        },
        {
          name: 'Докшин Юрий Юрьевич',
          photo: 'assets/img/staff/dokshin.webp',
          thumb: 'assets/img/staff/dokshin-thumb.webp',
          badges: [{ text: 'математика', solid: true }, { text: 'стаж 15 лет' }],
          lead: 'Инженер-электроэнергетик (ДВГУПС) и менеджер (**Хабаровский государственный университет экономики и права**)',
          text: '**Инженер с головой и руками** — умеет делиться знаниями и опытом. Помогает ученикам развивать навык обучаемости и преодолевать трудности.',
        },
        {
          name: 'Шевченко Екатерина Васильевна',
          photo: 'assets/img/staff/shevchenko.webp',
          thumb: 'assets/img/staff/shevchenko-thumb.webp',
          badges: [{ text: 'математика и информатика', solid: true }, { text: 'стаж 8 лет' }],
          lead: 'Педагогическое образование по математике и информатике (**НГПУ им. К. Минина**)',
          text: '**Внимательный к деталям педагог**, который постоянно совершенствует методики и внедряет в уроки современные цифровые инструменты.',
        },
        {
          name: 'Стар Александр Сергеевич',
          photo: 'assets/img/staff/star.webp',
          thumb: 'assets/img/staff/star-thumb.webp',
          badges: [{ text: 'математика', solid: true }, { text: 'стаж 7 лет' }],
          lead: 'Выпускник **факультета ВМК МГУ им. М. В. Ломоносова**, кафедра математической статистики',
          text: 'Ученики сдают **профильный ЕГЭ на 70–92 балла**. Кандидат в мастера спорта по шахматам, пишет рассказы и сценарии.',
        },
        {
          name: 'Ющенкова Анастасия Юрьевна',
          photo: 'assets/img/staff/yushchenkova.webp',
          thumb: 'assets/img/staff/yushchenkova-thumb.webp',
          badges: [{ text: 'математика', solid: true }, { text: 'стаж 4 года' }],
          lead: 'Учитель математики и информатики (**ОГУ им. И. С. Тургенева**)',
          text: 'Ученики 5–6 классов **участвуют в олимпиадах**. Получила награду конкурса «Спасибо наставнику!».',
        },
        {
          name: 'Чернова Елена Владимировна',
          photo: 'assets/img/staff/chernova.webp',
          thumb: 'assets/img/staff/chernova-thumb.webp',
          badges: [{ text: 'физика', solid: true }, { text: 'стаж 33 года' }],
          lead: 'Учитель физики **высшей квалификационной категории** (Оренбургский педагогический институт им. В. П. Чкалова)',
          text: 'Ученики сдают **ЕГЭ на 75–98 баллов** и поступают на бюджетные места в престижные вузы Москвы. Ученица онлайн-школы установила рекорд по баллам на ОГЭ.',
        },
        {
          name: 'Кочуров Иван Андреевич',
          photo: 'assets/img/staff/kochurov.webp',
          thumb: 'assets/img/staff/kochurov-thumb.webp',
          badges: [{ text: 'физика и информатика', solid: true }, { text: 'стаж 10 лет' }],
          lead: 'Учитель физики и информатики (**Алтайская государственная педагогическая академия**)',
          text: '**Пробуждать у нового поколения интерес к окружающему миру** — то, ради чего пришёл в профессию. Увлекается настольными играми и научной фантастикой.',
        },
        {
          name: 'Поспелова Вера Ивановна',
          photo: 'assets/img/staff/pospelova.webp',
          thumb: 'assets/img/staff/pospelova-thumb.webp',
          badges: [{ text: 'химия', solid: true }, { text: 'стаж 18 лет' }],
          lead: 'Учитель химии и экологии (**Курский государственный университет**)',
          text: 'Ученики поступают в **медицинские и педагогические колледжи и вузы**. Больше всего ценит возможность открывать для детей новое.',
        },
        {
          name: 'Сизых Вероника Викторовна',
          photo: 'assets/img/staff/sizykh.webp',
          thumb: 'assets/img/staff/sizykh-thumb.webp',
          badges: [{ text: 'биология', solid: true }, { text: 'стаж 13 лет' }],
          lead: 'Биолог (КрасГАУ) и **магистр психологии** (КГПУ им. В. П. Астафьева)',
          text: 'Ученики сдают **ОГЭ и ЕГЭ по биологии на 89+ баллов**. Работает с детьми с ОВЗ, автор программы по психологии для подростков «Будь собой».',
        },
        {
          name: 'Маркелия Луиза Юрьевна',
          photo: 'assets/img/staff/markeliya.webp',
          thumb: 'assets/img/staff/markeliya-thumb.webp',
          badges: [{ text: 'биология', solid: true }, { text: 'стаж 24 года' }],
          lead: 'Учитель биологии и педагог-психолог, **аспирантура по физиологии растений**',
          text: '**Подготовила около 400 учеников** к ОГЭ и ЕГЭ. Среди них — призёры всероссийской олимпиады и студенты медицинских и биотехнологических специальностей.',
        },
        {
          name: 'Лелеко София Николаевна',
          photo: 'assets/img/staff/leleko.webp',
          thumb: 'assets/img/staff/leleko-thumb.webp',
          badges: [{ text: 'география', solid: true }, { text: 'стаж 6 лет' }],
          lead: 'Магистр географии (**КФУ им. В. И. Вернадского**), кафедра землеведения и геоморфологии',
          text: 'Поступила в университет **на бюджет по высоким результатам экзаменов**, участвовала в полевых практиках и конкурсах Русского географического общества.',
        },
      ],
    },
    {
      id: 'languages',
      label: 'иностранные языки',
      people: [
        {
          name: 'Землякова Ева Хажисмеловна',
          photo: 'assets/img/staff/zemlyakova.webp',
          thumb: 'assets/img/staff/zemlyakova-thumb.webp',
          badges: [{ text: 'английский язык', solid: true }, { text: 'стаж 7 лет' }],
          lead: 'Лингвист английского языка (**КБГУ**), профессиональная переподготовка по направлению «Педагог»',
          text: 'Ученики **побеждают в олимпиадах и продолжают обучение за рубежом**. Готовится к международному сертификату TESOL — праву преподавать английский в 90 странах.',
        },
        {
          name: 'Падалка Дарина Романовна',
          photo: 'assets/img/staff/padalka.webp',
          thumb: 'assets/img/staff/padalka-thumb.webp',
          badges: [{ text: 'английский язык', solid: true }, { text: 'стаж 6 лет' }],
          lead: 'Теория и методика преподавания иностранных языков и культур (**СКФУ**)',
          text: 'Лучшие результаты учеников — **86 баллов на ЕГЭ и 63 из 68 на ОГЭ**. Выпускники поступили в МГУ, ИТМО, НИУ ВШЭ и СКФУ.',
        },
        {
          name: 'Багдасарян Шушан Самвеловна',
          photo: 'assets/img/staff/bagdasaryan.webp',
          thumb: 'assets/img/staff/bagdasaryan-thumb.webp',
          badges: [{ text: 'английский язык', solid: true }, { text: 'стаж 11 лет' }],
          lead: 'Бакалавриат и магистратура **Армянского государственного педагогического университета**',
          text: 'Ученики сдают **ЕГЭ на 80+, наивысший балл — 98**. Трое сдали IELTS и поступили в университеты Германии, Франции и Бельгии.',
        },
        {
          name: 'Максимова Алиса Андреевна',
          photo: 'assets/img/staff/maksimova.webp',
          thumb: 'assets/img/staff/maksimova-thumb.webp',
          badges: [{ text: 'английский и французский языки', solid: true }, { text: 'стаж 6 лет' }],
          lead: 'Кафедра германо-романских языков **Государственного социально-гуманитарного университета**',
          text: 'Ученики **занимают призовые места на конкурсах по французскому языку**. Строит урок так, чтобы ребёнок сам приходил к собственным выводам.',
        },
        {
          name: 'Вабель Дарья Викторовна',
          photo: 'assets/img/staff/vabel.webp',
          thumb: 'assets/img/staff/vabel-thumb.webp',
          badges: [{ text: 'английский и французский языки', solid: true }, { text: 'стаж 5 лет' }],
          lead: 'Педагогическое образование по двум профилям (СмолГУ), **стажировка в Орлеане, DELF B2**',
          text: 'Ученики сдают **международный экзамен DELF на уровни А1–В2** и проходят отбор на международные стажировки в Лион.',
        },
        {
          name: 'Филиппова Светлана Юрьевна',
          photo: 'assets/img/staff/filippova.webp',
          thumb: 'assets/img/staff/filippova-thumb.webp',
          badges: [{ text: 'французский язык', solid: true }, { text: 'стаж 10 лет' }],
          lead: 'Педагогическое образование (КГУ им. К. Э. Циолковского) и **магистратура Страсбургского университета**',
          text: 'Ученики **участвуют в олимпиадах и успешно сдают ОГЭ и ЕГЭ**. Полиглот: кроме французского и английского говорит по-итальянски, есть диплом Болонского университета.',
        },
        {
          name: 'Евтеева Наталья Анатольевна',
          photo: 'assets/img/staff/evteeva.webp',
          thumb: 'assets/img/staff/evteeva-thumb.webp',
          badges: [{ text: 'немецкий язык', solid: true }, { text: 'стаж 31 год' }],
          lead: 'Выпускница **Воронежского государственного университета**, высшая квалификационная категория',
          text: 'Ученики **успешно сдают ЕГЭ и поступают в вузы**. Вдохновляют общение с детьми и возможность видеть результаты их обучения.',
        },
      ],
    },
  ];

  // Показываем в категориях, по которым состав ещё не прислали (сейчас все заполнены)
  const placeholder = {
    name: 'Скоро здесь появятся специалисты',
    photo: '',
    badges: [],
    lead: 'Состав категории **ждём от клиента**',
    text: 'ФИО, фотографии и описания сотрудников будут добавлены после получения материалов.',
  };

  const tabsEl = root.querySelector('.about__tabs');
  const cardEl = root.querySelector('.about__card');
  const thumbsEl = root.querySelector('.about__thumbs');
  const trackEl = root.querySelector('.about__scrollbar');
  const barEl = root.querySelector('.about__scrollbar-thumb');
  const nameEl = root.querySelector('.about__name');
  const leadEl = root.querySelector('.about__lead');
  const photoEl = root.querySelector('.about__photo');
  const photoImg = root.querySelector('.about__photo-img');
  const badgesEl = root.querySelector('.about__badges');
  const textEl = root.querySelector('.about__text');
  const prevBtn = root.querySelector('.about__arrow--prev');
  const nextBtn = root.querySelector('.about__arrow--next');

  if (!tabsEl || !cardEl) return;

  let categoryIndex = 0;
  let personIndex = 0;

  // **кусок** → акцентный span; остальное экранируем
  const withAccents = (raw) => raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<span class="accent">$1</span>');

  const peopleOf = (category) => (category.people.length ? category.people : [placeholder]);

  function renderTabs() {
    tabsEl.innerHTML = '';

    categories.forEach((category, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'about__tab' + (i === categoryIndex ? ' about__tab--active' : '');
      btn.textContent = category.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === categoryIndex));

      btn.addEventListener('click', () => {
        if (i === categoryIndex) return;
        categoryIndex = i;
        personIndex = 0;
        renderTabs();
        renderThumbs();
        renderPerson();
      });

      tabsEl.appendChild(btn);
    });
  }

  function renderThumbs() {
    const people = peopleOf(categories[categoryIndex]);
    thumbsEl.innerHTML = '';

    people.forEach((person, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'about__thumb' + (i === personIndex ? ' about__thumb--active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === personIndex));
      btn.setAttribute('aria-label', person.name);

      // У миниатюры своя картинка — вырезка без фона (rembg по фото презентации).
      // Иначе белый фон обычного фото перекрывает подложку и активная не читается синей.
      if (person.thumb || person.photo) {
        const img = document.createElement('img');
        // ⚠️ src — через data-src и window.applyLazySrc (см. main.js): у картинки,
        // которой ещё нет в документе, loading="lazy" не работает — миниатюры
        // грузились при открытии страницы, хотя лента лежит далеко ниже экрана.
        img.loading = 'lazy';
        img.decoding = 'async';
        img.dataset.src = person.thumb || person.photo;
        img.alt = '';
        btn.appendChild(img);
      }

      btn.addEventListener('click', () => select(i));
      thumbsEl.appendChild(btn);
    });

    // Миниатюры уже в документе — отдаём им настоящий src, дальше сработает lazy
    window.applyLazySrc(thumbsEl);

    // Один человек — лента, скроллбар и стрелки не нужны
    cardEl.classList.toggle('about__card--single', people.length < 2);
    updateScrollbar();
  }

  function renderPerson() {
    const people = peopleOf(categories[categoryIndex]);
    const person = people[personIndex];

    nameEl.textContent = person.name;
    leadEl.innerHTML = withAccents(person.lead);
    textEl.innerHTML = withAccents(person.text);

    photoEl.classList.toggle('about__photo--empty', !person.photo);
    if (person.photo) {
      photoImg.src = person.photo;
      photoImg.alt = person.name;
    } else {
      photoImg.removeAttribute('src');
      photoImg.alt = '';
    }

    badgesEl.innerHTML = '';
    person.badges.forEach((badge) => {
      const span = document.createElement('span');
      span.className = 'about__badge' + (badge.solid ? ' about__badge--solid' : '');
      span.textContent = badge.text;
      badgesEl.appendChild(span);
    });

    prevBtn.disabled = personIndex === 0;
    nextBtn.disabled = personIndex === people.length - 1;
  }

  function select(index) {
    const people = peopleOf(categories[categoryIndex]);
    if (index < 0 || index >= people.length || index === personIndex) return;

    personIndex = index;

    thumbsEl.querySelectorAll('.about__thumb').forEach((el, i) => {
      el.classList.toggle('about__thumb--active', i === personIndex);
      el.setAttribute('aria-selected', String(i === personIndex));
    });

    const active = thumbsEl.children[personIndex];
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    renderPerson();
    updateScrollbar();
  }

  // Бегунок: высота = доля видимой части ленты, позиция = доля прокрутки
  function updateScrollbar() {
    if (!trackEl || !barEl) return;

    const trackHeight = trackEl.clientHeight;
    const { clientHeight, scrollHeight, scrollTop } = thumbsEl;

    if (!trackHeight || scrollHeight <= clientHeight) {
      barEl.style.height = '100%';
      barEl.style.top = '0px';
      return;
    }

    const barHeight = Math.max(24, (clientHeight / scrollHeight) * trackHeight);
    const progress = scrollTop / (scrollHeight - clientHeight);

    barEl.style.height = barHeight + 'px';
    barEl.style.top = Math.round(progress * (trackHeight - barHeight)) + 'px';
  }

  prevBtn.addEventListener('click', () => select(personIndex - 1));
  nextBtn.addEventListener('click', () => select(personIndex + 1));
  thumbsEl.addEventListener('scroll', updateScrollbar);
  window.addEventListener('resize', updateScrollbar);

  renderTabs();
  renderThumbs();
  renderPerson();
})();
