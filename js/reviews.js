// reviews.js — блок 11 «Отзывы родителей и учеников» (ТЗ 06.09.2026, §15).
//
// Что изменилось против прежней версии (`git show 151ec77:js/reviews.js`):
// страничный пагинатор заменён плоским списком. §15 требует показывать
// на первом экране не больше шести отзывов, остальные открывать кнопкой,
// а имя и статус показывать без запуска видео — поэтому у карточки появилась
// подпись, а у блока — кнопка «Показать ещё отзывы» и счётчик для телефона.
(() => {
  'use strict';

  const root = document.querySelector('.reviews');
  if (!root) return;

  const list = root.querySelector('.reviews__list');
  if (!list) return;

  // Ролики лежат своими файлами в assets/video/reviews (исходники клиента
  // перекодированы в H.264 + AAC: в оригиналах было VP9/Opus, их не играет Safari).
  // Поле type оставлено на случай, если часть отзывов позже заменят эмбедами
  // VK/Rutube — тогда меняется только эта таблица, вёрстку трогать не нужно.
  //
  // Имя и статус разведены по двум полям: §15 просит показывать их в подписи
  // под постером, а не только в подсказке кнопки.
  //
  // ⚠️ tag — метка из §15. Список допустимых: «переход из обычной школы»,
  // «жизнь за границей», «спорт и поездки», «подготовка к экзаменам»,
  // «адаптация к онлайн-формату», «обратная связь и поддержка». Какая метка
  // какому ролику соответствует, известно только из содержания видео — таблицы
  // от клиента нет, поэтому метки пустые, а место под них свёрстано.
  //
  // Порядок — отзывы детей и родителей вперемешку (просьба клиента).
  const items = [
    { name: 'Светлана Дорфман',  status: 'мама ученика 7 класса',  slug: 'dorfman-svetlana',    tag: '' },
    { name: 'Артемий Репин',     status: 'ученик 10 класса',       slug: 'repin-artemiy',       tag: '' },
    { name: 'Екатерина',         status: 'родитель',               slug: 'ekaterina',           tag: '' },
    { name: 'Варвара Дороничева', status: 'ученица 8 класса',      slug: 'doronicheva-varvara', tag: '' },
    { name: 'Сергей',            status: 'родитель',               slug: 'sergey',              tag: '' },
    { name: 'Зоя Доценко',       status: 'ученица 6 класса',       slug: 'dotsenko-zoya',       tag: '' },
    { name: 'Наталия',           status: 'родитель',               slug: 'nataliya',            tag: '' },
    { name: 'Малика',            status: 'выпускница школы',       slug: 'malika',              tag: '' },
    { name: 'Ольга',             status: 'родитель',               slug: 'olga',                tag: '' },
    { name: 'Нина',              status: 'ученица 6 класса',       slug: 'nina',                tag: '' },
    { name: 'Мария',             status: 'родитель',               slug: 'mariya',              tag: '' },
    { name: 'Милана Морозкина и Екатерина Смирнова', status: 'ученицы 8 и 7 классов', slug: 'morozkina-smirnova', tag: '' },
    { name: 'Наталья',           status: 'родитель',               slug: 'natalya',             tag: '' },
    { name: 'Лариса Фицнер',     status: 'мама ученицы 8 класса',  slug: 'fitsner-larisa',      tag: '' },
    { name: 'Эдуард',            status: 'родитель',               slug: 'eduard',              tag: '' },
  ].map((item) => ({
    type: 'mp4',
    src: 'assets/video/reviews/' + item.slug + '.mp4',
    poster: 'assets/img/reviews/' + item.slug + '.webp',
    ...item,
  }));

  // Сколько карточек видно до нажатия «Показать ещё отзывы».
  // Ровно раскладка §15: один крупный отзыв и три компактные рядом.
  const VISIBLE = 4;

  const more = root.querySelector('.reviews__more');
  const counter = root.querySelector('.reviews__counter');
  const mobile = window.matchMedia('(max-width: 767px)');

  function makePlayer(item) {
    if (item.type === 'embed') {
      const frame = document.createElement('iframe');
      frame.src = item.src;
      frame.allow = 'autoplay; fullscreen; picture-in-picture';
      frame.allowFullscreen = true;
      frame.title = item.name;
      return frame;
    }

    const video = document.createElement('video');
    video.src = item.src;
    video.controls = true;
    video.playsInline = true;
    if (item.poster) video.poster = item.poster;
    return video;
  }

  const cards = items.map((item, index) => {
    const li = document.createElement('li');
    li.className = 'reviews__item';
    // Первая карточка — крупная (§15, desktop). Класс, а не :first-child:
    // на планшете и телефоне модификатор просто перестаёт что-либо менять.
    if (index === 0) li.classList.add('reviews__item--large');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reviews__play';
    btn.setAttribute('aria-label', 'Смотреть отзыв: ' + item.name + ', ' + item.status);

    if (item.poster) {
      const img = document.createElement('img');
      img.className = 'reviews__poster';
      // ⚠️ src — через data-src и window.applyLazySrc (см. main.js): у картинки,
      // которой ещё нет в документе, loading="lazy" не работает — все 15 постеров
      // грузились при открытии страницы, хотя лежат далеко ниже экрана.
      img.loading = 'lazy';
      img.decoding = 'async';
      img.dataset.src = item.poster;
      img.alt = '';
      img.width = 850;
      img.height = 600;
      btn.appendChild(img);
    }

    const circle = document.createElement('span');
    circle.className = 'reviews__play-circle';
    circle.innerHTML =
      '<svg width="28" height="32" viewBox="0 0 28 32" fill="currentColor" aria-hidden="true">' +
      '<path d="M27 14.27a2 2 0 0 1 0 3.46L3 31.66A2 2 0 0 1 0 29.93V2.07A2 2 0 0 1 3 .34l24 13.93Z"/>' +
      '</svg>';
    btn.appendChild(circle);

    btn.addEventListener('click', () => {
      const player = makePlayer(item);
      window.openLightbox(player, item.name + ', ' + item.status);
      // Автозапуск вызываем сами, а не атрибутом autoplay: атрибут срабатывает
      // асинхронно, и Safari к тому моменту уже не считает это пользовательским
      // жестом — ролик открывался на паузе.
      if (player.play) player.play().catch(() => {});
    });

    const meta = document.createElement('div');
    meta.className = 'reviews__meta';

    const name = document.createElement('p');
    name.className = 'reviews__name';
    name.textContent = item.name;

    const status = document.createElement('p');
    status.className = 'reviews__status';
    status.textContent = item.status;

    meta.append(name, status);

    // Пустую метку не рисуем: пустая плашка выглядела бы недоделанной вёрсткой
    if (item.tag) {
      const tag = document.createElement('span');
      tag.className = 'reviews__tag';
      tag.textContent = item.tag;
      meta.appendChild(tag);
    }

    li.append(btn, meta);
    return li;
  });

  list.append(...cards);

  // Постеры уже в документе — можно отдавать им настоящий src, дальше сработает lazy
  window.applyLazySrc(list);

  // --- «Показать ещё отзывы» ---

  let expanded = false;

  const syncItems = () => {
    // На телефоне §15 просит ленту с краем следующей карточки и счётчиком —
    // там доступны все 15 сразу, и кнопка не нужна (её прячет CSS).
    const showAll = expanded || mobile.matches;
    cards.forEach((card, index) => {
      card.hidden = !showAll && index >= VISIBLE;
    });
    if (counter) counter.textContent = mobile.matches ? '1 / ' + cards.length : '';
  };

  if (more) {
    more.addEventListener('click', () => {
      expanded = !expanded;
      more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      more.textContent = expanded ? 'Свернуть отзывы' : 'Показать ещё отзывы';
      syncItems();
      // Кнопка не открывает лид-форму (§15) — только раскрывает список.
      if (expanded && cards[VISIBLE]) {
        const target = cards[VISIBLE].querySelector('.reviews__play');
        if (target) target.focus({ preventScroll: true });
      }
    });
  }

  // --- Счётчик карточек на телефоне ---

  if (counter) {
    let ticking = false;
    list.addEventListener('scroll', () => {
      if (!mobile.matches || ticking) return;
      ticking = true;
      // Пересчитываем в кадре отрисовки: событие scroll приходит чаще,
      // чем нужно, а нам достаточно одного значения на кадр.
      requestAnimationFrame(() => {
        ticking = false;
        const first = cards[0];
        if (!first) return;
        const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(list).columnGap || 0);
        if (!step) return;
        const index = Math.min(cards.length, Math.round(list.scrollLeft / step) + 1);
        counter.textContent = index + ' / ' + cards.length;
      });
    }, { passive: true });
  }

  mobile.addEventListener('change', syncItems);
  syncItems();
})();
