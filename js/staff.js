// staff.js — блок 12 «Обучайтесь комфортно»: категории × люди,
// вертикальная лента миниатюр с кастомным скроллбаром и стрелками.
(() => {
  'use strict';

  const root = document.querySelector('.staff');
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
      id: 'management',
      label: 'руководящий состав',
      people: [
        {
          name: 'Плесецкая Олеся Васильевна',
          photo: 'assets/img/staff/plesetskaya.webp',
          thumb: 'assets/img/staff/plesetskaya-thumb.webp',
          badges: [{ text: 'директор онлайн-школы', solid: true }, { text: 'стаж 28 лет' }],
          lead: 'Высшее педагогическое образование, **28 лет в сфере образования, 15 из них — на руководящих должностях**',
          text: 'Награждена Почётной грамотой Министерства образования и науки РФ. **В настоящий момент — магистрант программы «Управление образованием» НИУ «Высшая школа экономики».**',
        },
        {
          name: 'Ялыманова Инна Арнольдовна',
          photo: 'assets/img/staff/yalymanova.webp',
          thumb: 'assets/img/staff/yalymanova-thumb.webp',
          badges: [{ text: 'администратор', solid: true }, { text: 'РЭУ им. Плеханова' }],
          lead: 'Администратор школы, выпускница **РЭУ им. Г. В. Плеханова по специальности «Финансы и кредит»**',
          text: 'Постоянное саморазвитие и освоение новых навыков — часть жизни. **Общение с детьми приносит радость и энергию:** их любознательность и умение видеть прекрасное в простых вещах вдохновляют.',
        },
        {
          name: 'Данилова Любовь Константиновна',
          photo: 'assets/img/staff/danilova.webp',
          thumb: 'assets/img/staff/danilova-thumb.webp',
          badges: [{ text: 'администратор', solid: true }, { text: 'мама пятерых детей' }],
          lead: 'Администратор школы, для которой **быть мамой пятерых детей — настоящее призвание**',
          text: '**Многозадачность, умение найти подход к каждому и стрессоустойчивость** — навыки, отточенные годами. Этот бесценный опыт помогает создавать в коллективе гармоничную атмосферу.',
        },
        {
          name: 'Быкова Юлия Вячеславовна',
          photo: 'assets/img/staff/bykova.webp',
          thumb: 'assets/img/staff/bykova-thumb.webp',
          badges: [{ text: 'куратор начальных классов', solid: true }],
          lead: 'Куратор начальных классов с фокусом на **эмоциональную поддержку и адаптацию детей**',
          text: 'Убеждена, что у каждого ребёнка есть право на безопасное пространство, где его слышат и не оценивают. **«Школа и семья — команда: только вместе мы создаём условия, в которых ребёнок чувствует, что он не один».**',
        },
        {
          name: 'Иорданова Полина Константиновна',
          photo: 'assets/img/staff/iordanova.webp',
          thumb: 'assets/img/staff/iordanova-thumb.webp',
          badges: [{ text: 'куратор 8–11 классов', solid: true }, { text: 'психология' }],
          lead: 'Куратор 8–11 классов, **факультет психологии РАНХиГС**',
          text: 'Прошла курс по уходу и работе с детьми с ОВЗ. **«Не бойтесь быть разными — бойтесь быть одинаковыми».**',
        },
        {
          name: 'Рябуха Анна Владимировна',
          photo: 'assets/img/staff/ryabukha.webp',
          thumb: 'assets/img/staff/ryabukha-thumb.webp',
          badges: [{ text: 'куратор 8–11 классов', solid: true }, { text: 'стаж 5 лет' }],
          lead: 'Педагог-психолог и куратор 8–11 классов, **более 5 лет в школе**',
          text: 'Помогает ученикам достигать целей и раскрывать потенциал, создавая комфортную и поддерживающую атмосферу. **Учит не только предметам, но и важным жизненным навыкам.**',
        },
        {
          name: 'Болтухина Анна Геннадьевна',
          photo: 'assets/img/staff/boltukhina.webp',
          thumb: 'assets/img/staff/boltukhina-thumb.webp',
          badges: [{ text: 'администратор', solid: true }],
          lead: 'Администратор школы, **окончила педагогический колледж по специальности «учитель начальных классов»**',
          text: '**«Жизнь становится лучше, когда вокруг люди, чья доброта — это не стратегия, а образ жизни».**',
        },
      ],
    },
    {
      id: 'primary',
      label: 'начальная школа',
      people: [
        {
          name: 'Семёнова Ольга Владимировна',
          photo: 'assets/img/staff/semenova.webp',
          thumb: 'assets/img/staff/semenova-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'стаж 9 лет' }],
          lead: 'Учитель начальных классов, окончила **МГГУ им. М. А. Шолохова**',
          text: 'Работала в частных и государственных школах из ТОП-20 Москвы. **Выпускники показывают высокие результаты предметных диагностик.** Постоянно осваивает новые приёмы и методы преподавания.',
        },
        {
          name: 'Креймер Наталья Алексеевна',
          photo: 'assets/img/staff/kreymer.webp',
          thumb: 'assets/img/staff/kreymer-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'классный руководитель' }],
          lead: 'Классный руководитель 3 класса, **МГПУ «Начальное образование»**',
          text: 'Реализовала более 40 междисциплинарных исследований с учениками начальной школы, организовала клуб читателей. **«Каждый ребёнок — загадка, которую учитель разгадывает с любовью и терпением».**',
        },
        {
          name: 'Рустамова Камила Зайитжановна',
          photo: 'assets/img/staff/rustamova.webp',
          thumb: 'assets/img/staff/rustamova-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'стаж 3 года' }],
          lead: 'Классный руководитель 4 класса, **первая квалификационная категория**',
          text: 'Публикует статьи в журнале «Педагогический альманах» и проводит мастер-классы для педагогов. **«Человек, который чувствует, что его ценят, всегда делает больше, чем от него требуют».**',
        },
        {
          name: 'Дадыкина Наталья Сергеевна',
          photo: 'assets/img/staff/dadykina.webp',
          thumb: 'assets/img/staff/dadykina-thumb.webp',
          badges: [{ text: 'начальные классы', solid: true }, { text: 'с 2021 года' }],
          lead: 'Классный руководитель 1 и 2 класса, **в школе с 2021 года**',
          text: '**«Если хочешь сделать хорошо — обратись за мудрым советом. Хочешь сделать отлично — сделай сам».**',
        },
      ],
    },
    {
      id: 'humanities',
      label: 'гуманитарные науки',
      people: [
        {
          name: 'Пилипенко Елена Владимировна',
          photo: 'assets/img/staff/pilipenko.webp',
          thumb: 'assets/img/staff/pilipenko-thumb.webp',
          badges: [{ text: 'русский язык и литература', solid: true }, { text: 'стаж 15 лет' }],
          lead: 'Учитель русского языка и литературы, **окончила вуз с красным дипломом**',
          text: 'Более 15 лет преподавания, включая интересный опыт работы в демократической школе. **«Живи как живётся: не причиняй другим страдания и не участвуй во зле».**',
        },
        {
          name: 'Гаврилов Антон Сергеевич',
          photo: 'assets/img/staff/gavrilov.webp',
          thumb: 'assets/img/staff/gavrilov-thumb.webp',
          badges: [{ text: 'история', solid: true }, { text: 'стаж 9 лет' }],
          lead: 'Кандидат исторических наук, **экспертный уровень ЕГЭ по истории**',
          text: 'Девять лет преподавания истории. **Пишет статьи в научные и научно-популярные издания,** ведёт собственный телеграм-канал.',
        },
        {
          name: 'Абдулмеджидова Алина Чуайбовна',
          photo: 'assets/img/staff/abdulmedzhidova.webp',
          thumb: 'assets/img/staff/abdulmedzhidova-thumb.webp',
          badges: [{ text: 'история и обществознание', solid: true }, { text: 'стаж 30 лет' }],
          lead: 'Учитель истории, обществознания и географии, **стаж 30 лет**',
          text: 'Победитель конкурса лучших учителей РФ 2009 года. **Отмечена наградой «Отличник образования Республики Дагестан».** «Тяжело в учении — легко в бою».',
        },
        {
          name: 'Панкова Эльвира Олеговна',
          photo: 'assets/img/staff/pankova.webp',
          thumb: 'assets/img/staff/pankova-thumb.webp',
          badges: [{ text: 'русский язык и литература', solid: true }, { text: 'стаж 14 лет' }],
          lead: 'Учитель русского языка и литературы, **КГПУ им. В. П. Астафьева**',
          text: 'Успешно готовит выпускников к ОГЭ и ЕГЭ по русскому языку. **За годы работы прошла более 10 курсов повышения квалификации.**',
        },
        {
          name: 'Рябошапка Ольга Борисовна',
          photo: 'assets/img/staff/ryaboshapka.webp',
          thumb: 'assets/img/staff/ryaboshapka-thumb.webp',
          badges: [{ text: 'русский язык', solid: true }, { text: 'с 1989 года' }],
          lead: 'Учитель русского языка и литературы, **в профессии с 1989 года**',
          text: '**Ученики получают 100 баллов на ЕГЭ.** «Дай каждому дню шанс стать самым прекрасным в твоей жизни и в любой ситуации оставайся человеком».',
        },
        {
          name: 'Самойлова Валентина Александровна',
          photo: 'assets/img/staff/samoylova.webp',
          thumb: 'assets/img/staff/samoylova-thumb.webp',
          badges: [{ text: 'русский язык и литература', solid: true }, { text: 'стаж 22 года' }],
          lead: 'Учитель русского языка и литературы, **экспертный уровень диагностики МЦКО**',
          text: 'Её ученики получали 100 баллов по русскому языку в 2022–2025 годах. **Эксперт муниципального и регионального этапов Всероссийской олимпиады школьников,** ведёт курсы для педагогов.',
        },
        {
          name: 'Березина Ольга Михайловна',
          photo: 'assets/img/staff/berezina.webp',
          thumb: 'assets/img/staff/berezina-thumb.webp',
          badges: [{ text: 'история и обществознание', solid: true }],
          lead: 'Учитель истории и обществознания, **бакалавриат и магистратура с красным дипломом**',
          text: 'Член жюри по проверке олимпиадных работ, прошла курсы для учителей истории и обществознания в МГУ. **«Всё, что ни делается, — всё к лучшему».**',
        },
        {
          name: 'Щербинина Елена Владимировна',
          photo: 'assets/img/staff/scherbinina.webp',
          thumb: 'assets/img/staff/scherbinina-thumb.webp',
          badges: [{ text: 'история', solid: true }, { text: 'высшая категория' }],
          lead: 'Учитель истории высшей категории, **награждена Почётной грамотой Министерства образования и науки РФ**',
          text: 'Член государственной экзаменационной комиссии с 2022 года, участвует в летней школе МГУ по праву, истории и обществознанию. **«Учить — значит зажигать сердца».**',
        },
      ],
    },
    {
      id: 'science',
      label: 'точные и естественные науки',
      people: [
        {
          name: 'Мамаева Заира Аликберовна',
          photo: 'assets/img/staff/mamaeva.webp',
          thumb: 'assets/img/staff/mamaeva-thumb.webp',
          badges: [{ text: 'алгебра и геометрия', solid: true }, { text: 'стаж 33 года' }],
          lead: 'Учитель алгебры и геометрии со **стажем 33 года**',
          text: 'Присвоено звание **«Почётный работник сферы образования Российской Федерации».** «Учитесь у всех, не подражайте никому».',
        },
        {
          name: 'Гусева Малика Сериккалиевна',
          photo: 'assets/img/staff/guseva.webp',
          thumb: 'assets/img/staff/guseva-thumb.webp',
          badges: [{ text: 'химия', solid: true }, { text: 'стаж 17 лет' }],
          lead: 'Учитель химии высшей категории, **эксперт по проверке второй части ЕГЭ**',
          text: 'Лауреат конкурса «Учитель года — 2018», эксперт МЦКО по химии. **В 2021–2023 годах проверяла вторую часть ЕГЭ по химии.** Работала методистом и заместителем директора по учебной части.',
        },
        {
          name: 'Болбат Виолета Николаевна',
          photo: 'assets/img/staff/bolbat.webp',
          thumb: 'assets/img/staff/bolbat-thumb.webp',
          badges: [{ text: 'математика и информатика', solid: true }, { text: 'стаж 18 лет' }],
          lead: 'Учитель математики и информатики, **ежегодно подтверждает экспертный уровень диагностики МЦКО**',
          text: 'Готовит учеников к успешной сдаче ОГЭ и ЕГЭ, была экспертом по проверке заданий ОГЭ. **Награждена грамотой Департамента образования и науки города Москвы (2022).**',
        },
        {
          name: 'Джебраилова Арина Михайловна',
          photo: 'assets/img/staff/dzhebrailova.webp',
          thumb: 'assets/img/staff/dzhebrailova-thumb.webp',
          badges: [{ text: 'математика', solid: true }, { text: 'стаж 7 лет' }],
          lead: 'Учитель математики, **окончила аэрокосмический факультет МАИ**',
          text: 'Шесть лет изучала конструирование ракет, затем прошла переподготовку по специальности «учитель математики». Увлекается рисованием.',
        },
        {
          name: 'Амелин Николай Николаевич',
          photo: 'assets/img/staff/amelin.webp',
          thumb: 'assets/img/staff/amelin-thumb.webp',
          badges: [{ text: 'физика', solid: true }, { text: 'стаж 6 лет' }],
          lead: 'Учитель физики, **факультет физики, технологии и информационных систем МПГУ**',
          text: 'Увлекается спортивным ориентированием и походами, был в кальдере действующего вулкана. **«Делай то, что сложно, — до тех пор, пока не станет просто».**',
        },
        {
          name: 'Данилкин Никита Андреевич',
          photo: 'assets/img/staff/danilkin.webp',
          thumb: 'assets/img/staff/danilkin-thumb.webp',
          badges: [{ text: 'химия', solid: true }, { text: 'стаж 13 лет' }],
          lead: 'Учитель химии, магистр химии **МИТХТ им. М. В. Ломоносова**',
          text: 'Экспертный уровень МЦКО, готовит учеников к успешной сдаче ОГЭ, ЕГЭ и ДВИ. **«Обучая, учусь».**',
        },
      ],
    },
    {
      id: 'languages',
      label: 'иностранные языки',
      people: [
        {
          name: 'Акопян Ани Вачиковна',
          photo: 'assets/img/staff/akopyan.webp',
          thumb: 'assets/img/staff/akopyan-thumb.webp',
          badges: [{ text: 'английский и французский', solid: true }, { text: 'стаж 8 лет' }],
          lead: 'Преподаватель английского и французского, **готовит к ОГЭ и ЕГЭ на 85–96 баллов**',
          text: 'Разрабатывает индивидуальные методики, применяет коммуникативный подход и метод полного погружения. **Организатор летних языковых лагерей и разговорного клуба.**',
        },
        {
          name: 'Хачатурян Ирина Ивановна',
          photo: 'assets/img/staff/khachaturyan.webp',
          thumb: 'assets/img/staff/khachaturyan-thumb.webp',
          badges: [{ text: 'английский язык', solid: true }, { text: 'стаж 7 лет' }],
          lead: 'Учитель английского и французского языков, **опыт работы с детьми от 3 до 18 лет**',
          text: '9 научных публикаций, участие в конференциях, олимпиадах и семинарах. **За год прочитала 171 книгу на английском языке.**',
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

  const tabsEl = root.querySelector('.staff__tabs');
  const cardEl = root.querySelector('.staff__card');
  const thumbsEl = root.querySelector('.staff__thumbs');
  const trackEl = root.querySelector('.staff__scrollbar');
  const barEl = root.querySelector('.staff__scrollbar-thumb');
  const nameEl = root.querySelector('.staff__name');
  const leadEl = root.querySelector('.staff__lead');
  const photoEl = root.querySelector('.staff__photo');
  const photoImg = root.querySelector('.staff__photo-img');
  const badgesEl = root.querySelector('.staff__badges');
  const textEl = root.querySelector('.staff__text');
  const prevBtn = root.querySelector('.staff__arrow--prev');
  const nextBtn = root.querySelector('.staff__arrow--next');

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
      btn.className = 'staff__tab' + (i === categoryIndex ? ' staff__tab--active' : '');
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
      btn.className = 'staff__thumb' + (i === personIndex ? ' staff__thumb--active' : '');
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
    cardEl.classList.toggle('staff__card--single', people.length < 2);
    updateScrollbar();
  }

  function renderPerson() {
    const people = peopleOf(categories[categoryIndex]);
    const person = people[personIndex];

    nameEl.textContent = person.name;
    leadEl.innerHTML = withAccents(person.lead);
    textEl.innerHTML = withAccents(person.text);

    photoEl.classList.toggle('staff__photo--empty', !person.photo);
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
      span.className = 'staff__badge' + (badge.solid ? ' staff__badge--solid' : '');
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

    thumbsEl.querySelectorAll('.staff__thumb').forEach((el, i) => {
      el.classList.toggle('staff__thumb--active', i === personIndex);
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
