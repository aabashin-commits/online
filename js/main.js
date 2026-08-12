// main.js — инициализация и общие хелперы.
(() => {
  'use strict';

  // Все CTA страницы ведут на форму заявки (блок 18) — она существует только
  // как модалка. Реальную реализацию подставляет form.js, который грузится позже;
  // здесь заглушка на случай, если form.js не загрузился.
  window.openForm = () => {};

  // Блокировка прокрутки страницы под модалками (форма, лайтбокс).
  // Одного `overflow: hidden` на body мало: на телефоне страница всё равно
  // «пробивается» свайпом — Safari его игнорирует. Поэтому body фиксируем,
  // а чтобы он при этом не прыгнул в начало страницы, запоминаем позицию
  // и возвращаем её при разблокировке.
  let savedScroll = 0;

  window.lockScroll = () => {
    savedScroll = window.scrollY;
    document.body.style.top = -savedScroll + 'px';
    document.body.classList.add('no-scroll');
  };

  window.unlockScroll = () => {
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    // Пока body был fixed, он не занимал места и высота документа схлопывалась
    // до экрана. Если сразу вызвать scrollTo, браузер обрежет значение по этой
    // старой высоте (получали 0 вместо 1947), поэтому сначала форсируем пересчёт
    // чтением layout-свойства — оно заставляет применить снятые стили.
    void document.body.offsetHeight;
    // behavior: 'instant' обязателен: у html стоит scroll-behavior: smooth
    // (плавные якоря), и обычный scrollTo возвращал бы позицию анимацией —
    // после закрытия страница на пару секунд уезжала бы к началу и обратно.
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
  };

  document.addEventListener('click', (e) => {
    const cta = e.target.closest('[data-open-form]');
    if (!cta) return;
    e.preventDefault();
    window.openForm(cta.dataset.openForm);
  });

  // Лайтбокс: затемнение на весь экран + произвольное содержимое.
  // Используется отзывами (видео); тем же оверлеем откроется форма-модалка.
  let lightbox = null;
  let lastFocused = null;

  function buildLightbox() {
    const root = document.createElement('div');
    root.className = 'lightbox';
    root.hidden = true;
    root.innerHTML =
      '<div class="lightbox__backdrop" data-lightbox-close></div>' +
      '<div class="lightbox__window" role="dialog" aria-modal="true">' +
      '<button class="lightbox__close" type="button" aria-label="Закрыть" data-lightbox-close>' +
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg></button>' +
      '<div class="lightbox__content"></div>' +
      '</div>';

    root.addEventListener('click', (e) => {
      if (e.target.closest('[data-lightbox-close]')) window.closeLightbox();
    });

    document.body.appendChild(root);
    return root;
  }

  window.openLightbox = (node, label = '') => {
    if (!lightbox) lightbox = buildLightbox();

    const content = lightbox.querySelector('.lightbox__content');
    content.innerHTML = '';
    content.appendChild(node);

    lightbox.querySelector('.lightbox__window')
      .setAttribute('aria-label', label || 'Просмотр');

    lastFocused = document.activeElement;
    lightbox.hidden = false;
    window.lockScroll();
    lightbox.querySelector('.lightbox__close').focus();
  };

  window.closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;

    // Чистим содержимое, иначе видео продолжит играть в фоне
    lightbox.querySelector('.lightbox__content').innerHTML = '';
    lightbox.hidden = true;
    window.unlockScroll();

    if (lastFocused) lastFocused.focus();
    lastFocused = null;
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeLightbox();
  });

  // Горизонтальная лента со стрелками. На телефоне (≤767) в карусели
  // превращаются два блока — педсостав в «О нас» и факультативы, — и механика
  // у них одна, поэтому она живёт здесь, а не дублируется в двух файлах.
  //
  // track — прокручиваемый контейнер, nav — строка кнопок .scroll-nav
  // с [data-scroll="prev"|"next"]. Шаг прокрутки равен ширине первой карточки
  // вместе с зазором, так что лента всегда встаёт по границе карточки.
  //
  // itemSelector обязателен там, где карточки лежат не прямо в треке:
  // у факультативов между треком и карточками стоят ряды бенто, а они на
  // телефоне идут с display: contents — своего бокса у них нет, и мерить
  // ширину по firstElementChild было бы нельзя (вернулся бы нулевой прямоугольник).
  window.createScroller = (track, nav, itemSelector) => {
    if (!track || !nav) return;

    const prev = nav.querySelector('[data-scroll="prev"]');
    const next = nav.querySelector('[data-scroll="next"]');
    if (!prev || !next) return;

    const step = () => {
      const item = itemSelector
        ? track.querySelector(itemSelector)
        : track.firstElementChild;
      if (!item) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return item.getBoundingClientRect().width + gap;
    };

    // Кнопка у края ленты гасится. Запас в 1px — на дробные значения
    // scrollWidth при масштабировании страницы.
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= max - 1;
    };

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  };

  // Ленивая загрузка картинок, которые создаёт JS (постеры отзывов и роликов,
  // миниатюры педагогов). Картинка создаётся с data-src вместо src, а сюда
  // передаётся её контейнер — настоящий src проставится, когда до неё доскроллят.
  //
  // ⚠️ Почему не хватает loading="lazy". Атрибут работает только для картинок
  // из разметки: блоки рендерятся defer-скриптами, то есть ДО первой отрисовки
  // страницы, и в этот момент браузер ещё не знает координат элемента —
  // откладывать ему нечего, и он грузит сразу. Замер: постеры отзывов лежат на
  // 7000px ниже экрана, а запрашивались все 15 на 166-й мс, тогда как <img>
  // из разметки на той же глубине честно ждали прокрутки. Ни порядок атрибутов
  // (loading перед src), ни отсрочка на requestAnimationFrame с принудительным
  // пересчётом макета этого не меняют — проверено, грузились всё те же 15 из 15.
  // Поэтому здесь свой наблюдатель, а не нативный механизм.
  //
  // rootMargin: по вертикали 400 — картинка успевает подгрузиться до появления
  // на экране; по горизонтали 1600 — соседняя страница пагинатора готова заранее,
  // иначе при листании стрелкой плитки моргали бы пустотой.
  window.applyLazySrc = (root) => {
    const imgs = (root || document).querySelectorAll('img[data-src]');
    if (!imgs.length) return;

    const load = (img) => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    };

    // Старые браузеры без наблюдателя — грузим сразу: лучше лишний трафик,
    // чем блок с пустыми плитками.
    if (!('IntersectionObserver' in window)) {
      imgs.forEach(load);
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        load(entry.target);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '400px 1600px' });

    imgs.forEach((img) => io.observe(img));
  };

  // Пагинатор — листает карточки страницами, а не по одной штуке.
  // Используют отзывы (8 плиток на экран) и слайдер роликов в «О нас».
  //
  // Механика — нативный scroll-snap, а не transform: тогда на телефоне
  // свайп работает сам собой, а стрелкам достаточно прокрутить трек на
  // ширину экрана. Гашение крайних кнопок — та же логика, что в createScroller.
  //
  // Сколько карточек на странице, решает CSS через переменную --per-page:
  // так брейкпоинты остаются в файле блока (правило проекта), а JS только
  // читает число и перекладывает готовые карточки по страницам-обёрткам.
  // opts: { pageClass, pageTag } — тег важен для валидности вложения:
  // у отзывов карточки это <li>, значит страница обязана быть <ul>.
  window.createPager = (track, nav, cards, opts) => {
    if (!track || !cards.length) return;

    const pageClass = opts.pageClass;
    const pageTag = opts.pageTag || 'div';

    const prev = nav && nav.querySelector('[data-pager="prev"]');
    const next = nav && nav.querySelector('[data-pager="next"]');

    const perPage = () => {
      const raw = parseInt(getComputedStyle(track).getPropertyValue('--per-page'), 10);
      return raw > 0 ? raw : 1;
    };

    let current = 0;

    const build = () => {
      const size = perPage();
      // Перестраиваем, только если разбивка реально изменилась: иначе любой
      // resize (в т.ч. появление адресной строки на телефоне) дёргал бы DOM
      // и сбрасывал позицию прокрутки.
      if (track.childElementCount === Math.ceil(cards.length / size)
          && track.firstElementChild
          && track.firstElementChild.childElementCount === Math.min(size, cards.length)) return;

      track.textContent = '';
      for (let i = 0; i < cards.length; i += size) {
        const page = document.createElement(pageTag);
        page.className = pageClass;
        cards.slice(i, i + size).forEach((card) => page.appendChild(card));
        track.appendChild(page);
      }
      track.scrollLeft = 0;
      current = 0;
    };

    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 1;
      if (next) next.disabled = track.scrollLeft >= max - 1;
      // Кнопки не нужны, когда всё уместилось на одной странице
      if (nav) nav.hidden = track.childElementCount < 2;
    };

    const go = (dir) => {
      current = Math.max(0, Math.min(track.childElementCount - 1, current + dir));
      track.scrollTo({ left: current * track.clientWidth, behavior: 'smooth' });
    };

    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));

    // Свайп меняет страницу мимо кнопок — восстанавливаем номер по позиции,
    // иначе следующий клик по стрелке прыгнул бы от устаревшего значения.
    track.addEventListener('scroll', () => {
      if (track.clientWidth) current = Math.round(track.scrollLeft / track.clientWidth);
      sync();
    }, { passive: true });

    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { build(); sync(); }, 150);
    });

    build();
    sync();
  };
})();
