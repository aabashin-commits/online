// about.js — блок 7 «Моя школа LS — о нас».
// Карточка справа-снизу в левой колонке — слайдер обзорных роликов о школе
// (раньше там был педсостав, заменён по решению клиента 31.07.2026).
// По одному ролику на страницу, листается стрелками; общий механизм —
// createPager() из main.js, тот же, что у блока «Отзывы».
(() => {
  'use strict';

  const root = document.querySelector('.school-video');
  if (!root) return;

  const track = root.querySelector('.school-video__track');
  if (!track) return;

  // Версия постеров. Имена файлов при замене кадра не меняются, а Safari держит
  // картинку по URL очень цепко — без параметра он продолжал бы показывать старую.
  // Поднимать при каждой замене постера.
  const POSTER_V = '2';

  // Порядок задан клиентом: «Средняя и старшая школа» — первым.
  // Ролики перекодированы из исходников (в оригиналах Opus-аудио, его не играет Safari).
  const items = [
    { name: 'Средняя и старшая школа', slug: 'srednyaya-starshaya' },
    { name: 'Начальная школа',         slug: 'nachalnaya' },
    { name: '1 сентября в школе',      slug: 'pervoe-sentyabrya' },
  ];

  const cards = items.map((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'school-video__item';
    btn.setAttribute('aria-label', 'Смотреть ролик: ' + item.name);

    const posterUrl = 'assets/img/school/' + item.slug + '.webp?v=' + POSTER_V;

    const img = document.createElement('img');
    img.className = 'school-video__poster';
    // ⚠️ src — через data-src и window.applyLazySrc (см. main.js): у картинки,
    // которой ещё нет в документе, loading="lazy" не работает и постер грузится
    // сразу, хотя карточка лежит далеко ниже экрана.
    img.loading = 'lazy';
    img.decoding = 'async';
    img.dataset.src = posterUrl;
    img.alt = '';
    img.width = 1740;
    img.height = 978;
    btn.appendChild(img);

    const circle = document.createElement('span');
    circle.className = 'school-video__play';
    circle.innerHTML =
      '<svg width="28" height="32" viewBox="0 0 28 32" fill="currentColor" aria-hidden="true">' +
      '<path d="M27 14.27a2 2 0 0 1 0 3.46L3 31.66A2 2 0 0 1 0 29.93V2.07A2 2 0 0 1 3 .34l24 13.93Z"/>' +
      '</svg>';
    btn.appendChild(circle);

    const caption = document.createElement('span');
    caption.className = 'school-video__caption';
    caption.textContent = item.name;
    btn.appendChild(caption);

    btn.addEventListener('click', () => {
      const video = document.createElement('video');
      video.src = 'assets/video/school/' + item.slug + '.mp4';
      video.controls = true;
      video.playsInline = true;
      video.poster = posterUrl;
      window.openLightbox(video, item.name);
      // Запуск вызываем вручную: атрибут autoplay срабатывает асинхронно,
      // и Safari к тому моменту уже не считает это пользовательским жестом.
      video.play().catch(() => {});
    });

    return btn;
  });

  window.createPager(track, root.querySelector('.school-video__arrows'), cards, {
    pageClass: 'school-video__page',
  });

  // Постеры уже в документе — можно отдавать им настоящий src, дальше сработает lazy
  window.applyLazySrc(track);
})();
