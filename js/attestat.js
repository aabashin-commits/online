// attestat.js — табы-пиллы секции «Аттестат»: переключают весь контент вкладки.
// Контент табов 2–5 — из «фото тз/блок 2 табы 2-5.png».
(() => {
  'use strict';

  const root = document.querySelector('.attestat');
  if (!root) return;

  const tabsEl = root.querySelector('.attestat__tabs');
  if (!tabsEl) return;

  // Размер группы живёт в разметке (data-class-size у секции), а не здесь: в данных
  // ниже стоит плейсхолдер {size}, его подставляет fillSize() при рендере баббла.
  // Текст самой пиллы JS не пишет (берётся из разметки как есть) — правится отдельно,
  // поэтому при смене цифры менять надо ОБА места в index.html.
  const classSize = root.dataset.classSize || '12';
  const fillSize = (text) => text.replace(/\{size\}/g, classSize);

  // Разметка текста: **кусок** — тёмный акцент, ==кусок== — подсветка-маркер.
  // ⚠️ Неразрывные пробелы здесь — литеральный символ U+00A0, а не сущность &nbsp;:
  // заголовок вставляется через textContent (см. show()), где сущность вывелась бы
  // как текст «&nbsp;». В редакторе такой пробел визуально неотличим от обычного.
  const tabs = [
    {
      pill: 'Аттестат гос. образца',
      title: 'Выдаём аттестат гос. образца',
      lead: '**Аттестат онлайн-школы ничем не отличается от аттестата очной:** с ним поступают в любой вуз и колледж страны на общих основаниях. ==Для нас каждый выпускник «Моя школа LS» — это большая гордость и результат совместного пути.==',
      note: 'Ваш ребёнок получит аттестат гос. образца о среднем образовании. При этом мы всегда можем вам предоставить усиленную программу.',
      image: 'assets/img/attestat/diplom.webp',
      // На телефоне у коллажа своя компоновка (Figma 1:9023) — отдельный экспорт
      imageMobile: 'assets/img/attestat/diplom-mobile.webp',
      // Фигура-декор за фото — одна на все табы (петля вокруг диплома)
      figura: 'assets/img/attestat/diplom_figura.webp',
      alt: 'Аттестат о среднем общем образовании и красный диплом с отличием',
      wide: true,
      bubbles: [
        { text: 'гос. образец', style: 'light' },
        { text: 'лично в руки', style: 'solid' },
      ],
    },
    {
      pill: 'Группа до {size} человек',
      title: 'Мини-группы',
      subtitle: 'Маленькие группы и внимание каждому ребёнку',
      lead: '**В отличие от переполненных классов, ребёнок не остаётся один на один с трудностями.** Педагог видит каждого в своём окне, замечает пробелы и помогает разобраться в теме прямо на уроке.',
      image: 'assets/img/attestat/mini-classes.webp',
      figura: 'assets/img/attestat/diplom_figura.webp',
      alt: 'Ученики рассматривают предмет через лупу на уроке',
      bubbles: [
        { text: 'до {size} человек', style: 'light' },
        { text: 'внимание каждому', style: 'solid' },
      ],
    },
    {
      pill: 'Не перегружаем',
      title: 'ДЗ без участия родителей',
      subtitle: 'Ребёнок учится на уроках, а вечер остаётся свободным',
      lead: '**Все учебные задачи — на уроках и самоподготовке, отдых — после.** Ребёнок получает знания и выполняет задания под контролем педагогов, а вечером не садится за уроки снова.',
      image: 'assets/img/attestat/dz.webp',
      figura: 'assets/img/attestat/diplom_figura.webp',
      alt: 'Улыбающаяся ученица за партой в классе',
      bubbles: [
        { text: 'вечер свободен', style: 'light' },
        { text: 'без домашних заданий', style: 'solid' },
      ],
    },
    {
      pill: 'Не нужны репетиторы',
      title: 'Не нужен репетитор',
      subtitle: 'Индивидуальный подход — не обещание, а система',
      lead: '**Мы начинаем с диагностики знаний, знакомства с ребёнком и разговора с родителями.** Так школа понимает, где ребёнку нужна поддержка, где можно усилить программу и как помочь ему двигаться вперёд без стресса.',
      image: 'assets/img/attestat/tutor.webp',
      figura: 'assets/img/attestat/diplom_figura.webp',
      alt: 'Педагог занимается с учеником за столом',
      bubbles: [
        { text: 'диагностика знаний', style: 'light' },
        { text: 'контроль успеваемости', style: 'solid' },
      ],
    },
    {
      pill: 'Школа без стресса',
      title: 'Без стресса и буллинга',
      subtitle: 'Среда, в которой ребёнку не страшно учиться',
      lead: 'Мы создаём атмосферу уважения между детьми, педагогами и родителями. **В школе есть психологическое сопровождение, а конфликтные ситуации не игнорируются** — их берут в работу педагоги, кураторы и психолог.',
      image: 'assets/img/attestat/stress.webp',
      figura: 'assets/img/attestat/diplom_figura.webp',
      alt: 'Группа улыбающихся учеников',
      bubbles: [
        { text: 'психолог', style: 'light' },
        { text: 'без буллинга и стресса', style: 'solid' },
      ],
    },
  ];

  const pills = Array.from(tabsEl.querySelectorAll('.pill'));
  const titleEl = root.querySelector('.attestat__title');
  const leadEl = root.querySelector('.attestat__lead');
  const noteEl = root.querySelector('.attestat__note');
  const imgEl = root.querySelector('.attestat__img');
  const sourceEl = root.querySelector('.attestat__source');
  const figuraEl = root.querySelector('.attestat__figura');
  const bubblesEl = root.querySelector('.attestat__bubbles');
  const contentEl = root.querySelector('.attestat__content');
  const mediaEl = root.querySelector('.attestat__media');

  if (!pills.length || !titleEl || !leadEl || !imgEl || !bubblesEl) return;

  // Подзаголовок есть только у табов 2–5 — создаём один раз и прячем на первом
  const subtitleEl = document.createElement('p');
  subtitleEl.className = 'attestat__subtitle';
  titleEl.insertAdjacentElement('afterend', subtitleEl);

  const render = (raw) => raw
    .replace(/\*\*(.+?)\*\*/g, '<span class="accent">$1</span>')
    .replace(/==(.+?)==/g, '<span class="attestat__hl">$1</span>');

  function show(index) {
    const tab = tabs[index];
    if (!tab) return;

    titleEl.textContent = tab.title;

    subtitleEl.innerHTML = tab.subtitle || '';
    subtitleEl.hidden = !tab.subtitle;

    leadEl.innerHTML = render(tab.lead);
    // Базовый цвет текста: у первого таба тёмный, у остальных серый с акцентами
    leadEl.classList.toggle('attestat__lead--muted', Boolean(tab.subtitle));

    if (noteEl) {
      noteEl.innerHTML = tab.note || '';
      noteEl.hidden = !tab.note;
    }

    // Мобильный <source> идёт первым: без своей версии подставляем ту же картинку,
    // иначе на телефоне остался бы коллаж предыдущей вкладки
    if (sourceEl) sourceEl.srcset = tab.imageMobile || tab.image;
    imgEl.src = tab.image;
    imgEl.alt = tab.alt;
    // Коллаж аттестата шире обычных фото и выходит за край карточки
    imgEl.classList.toggle('attestat__img--wide', Boolean(tab.wide));
    if (mediaEl) mediaEl.classList.toggle('attestat__media--photo', !tab.wide);

    // Фигура-декор за фото — одна на все табы (решение клиента 21.07.2026:
    // «колбаска как на первом табе»). Раньше у табов 2–5 стоял swirl.webp
    // с классом --swirl; класс был мёртвый — правил под него в CSS нет.
    if (figuraEl) figuraEl.src = tab.figura;

    bubblesEl.innerHTML = '';
    tab.bubbles.forEach((bubble) => {
      const span = document.createElement('span');
      span.className = 'attestat__bubble attestat__bubble--' + bubble.style;
      span.innerHTML = fillSize(bubble.text);
      bubblesEl.appendChild(span);
    });

    pills.forEach((pill, i) => {
      const active = i === index;
      pill.classList.toggle('pill--active', active);
      if (active) pill.setAttribute('aria-current', 'true');
      else pill.removeAttribute('aria-current');
    });

    if (contentEl) contentEl.scrollTop = 0;
  }

  pills.forEach((pill, i) => {
    pill.addEventListener('click', () => show(i));
  });

  show(0);
})();
