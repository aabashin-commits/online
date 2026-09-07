// mobile-cta.js — липкая плашка «получить консультацию» на телефоне (ТЗ §4, Mobile).
//
// Два условия, оба обязательны:
// 1) CTA первого экрана (.hero__cta) пролистан вверх за шапку;
// 2) на экране не видно ни одного блока, где заявку и так предлагают, —
//    #pricing, #trial, #consultation. Иначе плашка перекрывала бы
//    собственную кнопку блока и мешала читать цену.
//
// Видимость самой плашки ограничена мобилкой в CSS — ширину здесь не проверяем.
(() => {
  'use strict';

  const bar = document.querySelector('.mobile-cta');
  if (!bar) return;

  // Блоки, на которых плашку прячем (§4). Отсутствующие в разметке пропускаем:
  // блок могли отключить, и падать из-за этого скрипт не должен.
  const quietZones = ['#pricing', '#trial', '#consultation']
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);

  const heroCta = document.querySelector('.hero__cta');

  // Кто из «тихих» блоков сейчас на экране. Set, а не счётчик: IntersectionObserver
  // присылает записи пачками и повторно — счётчик разъехался бы.
  const visibleZones = new Set();
  let heroPassed = !heroCta; // нет hero-CTA (блок убрали) — считаем пролистанным

  const sync = () => {
    bar.classList.toggle('is-visible', heroPassed && visibleZones.size === 0);
  };

  if (heroCta) {
    // Верхняя граница root сдвинута на высоту мобильной шапки (49px): hero-CTA
    // считается «пролистанным», когда уходит под липкую шапку, а не за край экрана.
    const heroIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { heroPassed = !entry.isIntersecting; });
        sync();
      },
      { rootMargin: '-49px 0px 0px 0px', threshold: 0 }
    );
    heroIo.observe(heroCta);
  }

  if (quietZones.length) {
    // Нижняя граница поднята на высоту плашки (~76px): блок считается видимым
    // ровно тогда, когда он появляется из-под плашки, а не когда его край
    // заезжает под неё — иначе плашка мигала бы на границе блока.
    const zoneIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleZones.add(entry.target);
          else visibleZones.delete(entry.target);
        });
        sync();
      },
      { rootMargin: '0px 0px -76px 0px', threshold: 0 }
    );
    quietZones.forEach((zone) => zoneIo.observe(zone));
  }

  sync();
})();
