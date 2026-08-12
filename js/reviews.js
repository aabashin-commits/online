// reviews.js — блок 14 «Отзывы»: 15 видео-карточек страницами, открытие в лайтбоксе.
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
  // Порядок — отзывы детей и родителей вперемешку (просьба клиента): на первой
  // странице их поровну, в хвосте идут родители, потому что детских роликов
  // всего 6 против 9 родительских.
  const items = [
    { name: 'Светлана Дорфман, мама ученика 7 класса', slug: 'dorfman-svetlana' },
    { name: 'Артемий Репин, ученик 10 класса',         slug: 'repin-artemiy' },
    { name: 'Екатерина, родитель',                     slug: 'ekaterina' },
    { name: 'Варвара Дороничева, ученица 8 класса',    slug: 'doronicheva-varvara' },
    { name: 'Сергей, родитель',                        slug: 'sergey' },
    { name: 'Зоя Доценко, ученица 6 класса',           slug: 'dotsenko-zoya' },
    { name: 'Наталия, родитель',                       slug: 'nataliya' },
    { name: 'Малика, выпускница школы',               slug: 'malika' },
    { name: 'Ольга, родитель',                         slug: 'olga' },
    { name: 'Нина, ученица 6 класса',                  slug: 'nina' },
    { name: 'Мария, родитель',                         slug: 'mariya' },
    { name: 'Милана Морозкина и Екатерина Смирнова, ученицы 8 и 7 классов', slug: 'morozkina-smirnova' },
    { name: 'Наталья, родитель',                       slug: 'natalya' },
    { name: 'Лариса Фицнер, мама ученицы 8 класса',    slug: 'fitsner-larisa' },
    { name: 'Эдуард, родитель',                        slug: 'eduard' },
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
    btn.setAttribute('aria-label', 'Смотреть отзыв: ' + item.name);

    if (item.poster) {
      const img = document.createElement('img');
      img.className = 'reviews__poster';
      // ⚠️ src — через data-src и window.applyLazySrc (см. main.js): у картинки,
      // которой ещё нет в документе, loading="lazy" не работает — все 15 постеров
      // грузились при открытии страницы, хотя лежат на 7000px ниже экрана.
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
      window.openLightbox(player, item.name);
      // Автозапуск вызываем сами, а не атрибутом autoplay: атрибут срабатывает
      // асинхронно, и Safari к тому моменту уже не считает это пользовательским
      // жестом — ролик открывался на паузе.
      if (player.play) player.play().catch(() => {});
    });

    li.appendChild(btn);
    return li;
  });

  window.createPager(track, root.querySelector('.reviews__arrows'), cards, {
    pageClass: 'reviews__page',
    pageTag: 'ul',
  });

  // Постеры уже в документе — можно отдавать им настоящий src, дальше сработает lazy
  window.applyLazySrc(track);
})();
