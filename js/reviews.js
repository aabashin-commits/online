// reviews.js — блок 11 «Отзывы родителей и учеников» (ТЗ 06.09.2026, §15).
//
// ⚠️ 10.09.2026, правки клиента: блок снова карусель, как на основном сайте.
// Было (07.09.2026, §15) — плоский список: четыре отзыва на первом экране,
// остальные одиннадцать по кнопке «Показать ещё отзывы», на телефоне лента
// со счётчиком. Стало — страницы со стрелками: сколько карточек на странице,
// решает CSS через --per-page, раскладывает их общий createPager из main.js.
// Кнопка, счётчик и крупная плитка первого отзыва убраны: страницы обязаны
// быть одинаковыми, иначе лента прыгает по высоте.
//
// Подписи под постером (имя, статус, метка) — требование §15 — сохранены:
// карусель меняет только способ показа карточек, не их содержание.
(() => {
  'use strict';

  const root = document.querySelector('.reviews');
  if (!root) return;

  const track = root.querySelector('.reviews__track');
  if (!track) return;

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

  const cards = items.map((item) => {
    const li = document.createElement('li');
    li.className = 'reviews__item';

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

    // Видимых подписей под плитками нет (решение клиента 16.09.2026):
    // имя и статус остаются только в aria-label кнопки и лайтбокса
    li.append(btn);
    return li;
  });

  // Карточки раскладывает по страницам общий createPager (main.js): он читает
  // --per-page из CSS, строит страницы-обёртки <ul class="reviews__page">
  // и листает трек нативной прокруткой со scroll-snap — на телефоне это сразу
  // даёт свайп, стрелкам остаётся сдвинуть ленту на ширину вьюпорта.
  window.createPager(track, root.querySelector('.reviews__arrows'), cards, {
    pageClass: 'reviews__page',
    pageTag: 'ul',
  });

  // Постеры уже в документе — можно отдавать им настоящий src, дальше сработает lazy
  window.applyLazySrc(track);
})();
