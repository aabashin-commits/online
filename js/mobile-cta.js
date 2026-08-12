// mobile-cta.js — липкая плашка «оставить заявку» на телефоне.
// Показывает плашку (.is-visible), только когда CTA hero-баннера (.hero__cta)
// пролистан вверх за экран, и прячет, пока он виден. Видимость самой плашки
// ограничена мобилкой в CSS — здесь только переключаем класс, ширину не проверяем.
(() => {
  'use strict';

  const bar = document.querySelector('.mobile-cta');
  if (!bar) return;

  const heroCta = document.querySelector('.hero__cta');
  // Нет hero-CTA, за которым следить (напр. блок убрали) — показываем плашку всегда
  if (!heroCta) {
    bar.classList.add('is-visible');
    return;
  }

  // Верхняя граница root сдвинута на высоту мобильной шапки (49px): hero-CTA
  // считается «пролистанным», когда уходит под липкую шапку, а не за край экрана.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        bar.classList.toggle('is-visible', !entry.isIntersecting);
      });
    },
    { rootMargin: '-49px 0px 0px 0px', threshold: 0 }
  );

  io.observe(heroCta);
})();
