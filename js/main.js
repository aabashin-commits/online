// main.js — инициализация и общие хелперы.
(() => {
  'use strict';

  // Все CTA страницы ведут на форму заявки (блок 18) — она существует только
  // как модалка. Реальную реализацию подставляет form.js, который грузится позже;
  // здесь заглушка на случай, если form.js не загрузился.
  window.openForm = () => {};

  // Состояние выбора родителя (ТЗ §20). Ступень выбирается в блоке «Выберите
  // класс», формат — в блоке «Выберите формат» (фаза 5), место клика приходит
  // с самой кнопки. Держим в одном объекте, чтобы значение переживало переходы
  // между блоками; читать его будут скрытые поля формы и аналитика (фаза 8).
  // ⚠️ Живая заявка уходит через click-форму Битрикса офлайн-школы, и скрытые
  // поля туда не передаются — см. пункт 1 списка на ревью в checklist.md.
  window.schoolChoice = {
    school_stage: '',
    education_format: '',
    price: '',
    cta_location: '',
  };

  // Блоки не знают друг о друге: «Выберите класс» и «Выберите формат» просто
  // пишут выбор, а «Стоимость» слушает событие и подстраивается. Так связь
  // остаётся односторонней и любой из блоков можно снять со страницы.
  const notify = (key) => {
    document.dispatchEvent(new CustomEvent('school-choice', {
      detail: { key, value: window.schoolChoice[key], choice: window.schoolChoice },
    }));
  };

  window.setSchoolStage = (stage) => {
    const value = stage || '';
    if (window.schoolChoice.school_stage === value) return;
    window.schoolChoice.school_stage = value;
    notify('school_stage');
  };

  window.setEducationFormat = (format) => {
    const value = format || '';
    if (window.schoolChoice.education_format === value) return;
    window.schoolChoice.education_format = value;
    notify('education_format');
  };

  // Цену пишет карточка тарифа перед открытием формы (ТЗ §13)
  window.setPrice = (price) => {
    window.schoolChoice.price = price || '';
  };

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
    // Откуда пришла заявка: явная метка кнопки, иначе id секции, в которой она лежит
    const section = cta.closest('section[id]');
    window.schoolChoice.cta_location = cta.dataset.ctaLocation || (section ? section.id : '');
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
  // с [data-scroll="prev"|"next"]. Шаг прокрутки кратен ширине первой карточки
  // вместе с зазором, так что лента всегда встаёт по границе карточки;
  // множитель берётся из CSS-переменной --scroll-step на треке (по умолчанию 1).
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

    // На сколько колонок листает стрелка, решает CSS через --scroll-step:
    // брейкпоинты остаются в файле блока (правило проекта), JS только читает
    // число. Переменной нет — шаг в одну карточку, как было.
    const step = () => {
      const item = itemSelector
        ? track.querySelector(itemSelector)
        : track.firstElementChild;
      if (!item) return track.clientWidth;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap) || 0;
      const count = parseInt(styles.getPropertyValue('--scroll-step'), 10) || 1;
      return (item.getBoundingClientRect().width + gap) * count;
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

  // --- Общая карусель (блоки «Собственная программа» и «Онлайн-платформа») ---
  // Разметка одна на оба блока (классы .carousel__* в layout.css), отличается
  // только оформление. Листает родной scroll-snap: свайп на телефоне работает
  // сам, стрелки лишь прокручивают трек — тот же приём, что в createPager.
  // Активный слайд ищем по близости к центру трека, а не по счётчику кликов:
  // после свайпа счётчик и точки всё равно должны совпадать с картинкой.
  const initCarousel = (root) => {
    const track = root.querySelector('[data-carousel="track"]');
    if (!track) return;
    let slides = Array.from(track.children);
    if (!slides.length) return;

    const prev = root.querySelector('[data-carousel="prev"]');
    const next = root.querySelector('[data-carousel="next"]');
    const counter = root.querySelector('[data-carousel="current"]');
    const total = root.querySelector('[data-carousel="total"]');
    const dotsBox = root.querySelector('[data-carousel="dots"]');
    const pad = (n) => String(n).padStart(2, '0');

    // Три режима. Обычный: в кадре один слайд, он по центру, соседи
    // подглядывают по краям (блок «Собственная программа»). Лента
    // (data-carousel-strip): в кадре несколько целых карточек, шаг — одна
    // карточка, счётчик показывает номер позиции, а не слайда. Кольцо
    // (data-carousel-loop) — лента без концов: после последней карточки снова
    // первая, по бокам всегда видно соседей, стрелки никогда не гаснут.
    const strip = root.hasAttribute('data-carousel-strip');
    const loop = strip && root.hasAttribute('data-carousel-loop');

    // Кольцо собираем клонами: [копия][оригиналы][копия]. Прокрутка остаётся
    // родной, свайп на телефоне работает сам; когда лента уезжает в копию, то
    // после остановки возвращаем её в середину — картинки там те же, подмены
    // не видно. Клоны скрыты от скринридеров, чтобы не читались по три раза.
    const ring = slides.length;
    const base = loop ? ring : 0;
    if (loop) {
      const head = document.createDocumentFragment();
      const tail = document.createDocumentFragment();
      slides.forEach((slide) => {
        [head, tail].forEach((box) => {
          const copy = slide.cloneNode(true);
          copy.setAttribute('aria-hidden', 'true');
          box.appendChild(copy);
        });
      });
      track.insertBefore(head, slides[0]);
      track.appendChild(tail);
      slides = Array.from(track.children);
    }

    // Сколько карточек в кадре. В ленте с главной карточкой мерить по факту
    // нельзя: карточки в кадре разной ширины, и шаг перестаёт быть равен
    // «ширина кадра / число карточек». Поэтому число берём из CSS-переменной
    // блока (--carousel-per), а измерение остаётся запасным путём.
    const declaredPer = () => {
      const raw = parseFloat(getComputedStyle(root).getPropertyValue('--carousel-per'));
      return Number.isFinite(raw) && raw >= 1 ? Math.round(raw) : 0;
    };

    // Шаг ленты. Считаем по двум первым карточкам: главной среди них не бывает
    // (она всегда в середине кадра), поэтому шаг — ровно «узкая + зазор»,
    // и он не врёт, даже если ширины прямо сейчас доигрывают анимацию.
    const metrics = () => {
      const width = slides[0].offsetWidth;
      const step = slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : width;
      if (!strip || step <= 0) return { step: step || width, per: 1 };
      const per = declaredPer()
        || Math.round((track.clientWidth + (step - width)) / step);
      return { step, per: Math.min(Math.max(1, per), slides.length) };
    };

    const limit = (i) => Math.max(0, Math.min(slides.length - 1, i));

    // Сколько всего позиций. В кольце — сколько настоящих карточек; в обычной
    // ленте позиций меньше, чем карточек: последняя — когда правый край
    // последней карточки встал к правому краю трека.
    const stops = () => {
      if (loop) return ring;
      return strip ? slides.length - metrics().per + 1 : slides.length;
    };

    // Номер позиции для счётчика и точек: в кольце индекс сворачивается
    // по модулю, потому что живьём он гуляет по копиям.
    const label = (i) => (loop ? ((i - base) % ring + ring) % ring : limit(i));

    // Куда должен встать трек на позиции i.
    const stopLeft = (i) => {
      if (strip) return limit(i) * metrics().step;
      // При scroll-snap-align: center просто offsetLeft промахнулся бы.
      const slide = slides[limit(i)];
      return slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
    };

    // Какая карточка главная на позиции i. В ленте это середина кадра
    // (в макете она крупнее соседних, а счётчик при этом показывает «01»);
    // если карточек в кадре меньше трёх, середины нет — и главной тоже.
    const accentOf = (i) => {
      if (!strip) return i;
      const { per } = metrics();
      return per >= 3 ? limit(i + Math.floor(per / 2)) : -1;
    };

    let index = base;
    // Позиция, к которой едем прямо сейчас по клику. Пока прокрутка не доехала,
    // положение из scrollLeft не берём: иначе счётчик отставал бы.
    let pending = -1;
    let pendingTimer;

    // Точки заводим только на настоящие карточки, клоны в счёт не идут.
    const dots = (loop ? slides.slice(base, base + ring) : slides).map((slide, i) => {
      if (!dotsBox) return null;
      const item = document.createElement('li');
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', `Слайд ${i + 1}`);
      dot.addEventListener('click', () => goTo(base + i));
      item.appendChild(dot);
      dotsBox.appendChild(item);
      return dot;
    });

    // Счётчик, точки и стрелки обновляем хоть на каждом кадре прокрутки —
    // они ничего не перекладывают. Ширина главной карточки — отдельно.
    const renderMeta = () => {
      const at = label(index);
      dots.forEach((dot, i) => { if (dot) dot.classList.toggle('is-active', i === at); });
      if (counter) counter.textContent = pad(at + 1);
      // Общее число пересчитывается здесь, а не один раз при старте: в ленте
      // оно зависит от того, сколько карточек влезло, то есть от ширины экрана.
      if (total) total.textContent = pad(stops());
      // У кольца концов нет, гасить стрелки не на чем.
      if (!loop) {
        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index === stops() - 1;
      }
    };

    // Вешает класс главной карточки.
    // animate: true  — ширина переезжает плавно (клик по стрелке: трек едет
    //                  туда же и с той же скоростью, ряд не дёргается);
    // animate: false — мгновенно, с пересчётом позиции трека. Нужно после
    //                  свайпа и при возврате кольца в середину: ширины обязаны
    //                  стать окончательными в том же кадре, иначе ряд поедет
    //                  сам по себе, когда анимация доиграет, — это и есть те
    //                  прыжки, на которые жаловались.
    const applyHero = (i, animate) => {
      const accent = accentOf(i);
      if (!animate) slides.forEach((slide) => { slide.style.transition = 'none'; });
      slides.forEach((slide, n) => slide.classList.toggle('is-active', n === accent));
      if (animate) return;
      track.scrollLeft = stopLeft(i);
      requestAnimationFrame(() => {
        slides.forEach((slide) => { slide.style.transition = ''; });
      });
    };

    const goTo = (i) => {
      // В кольце возвращаемся в середину, только если цель вылезает за край
      // склеенной ленты. Раньше возврат делался перед каждым шагом — и при
      // быстрых кликах, пока предыдущая прокрутка не доехала, ряд мгновенно
      // перескакивал в её конечную точку (замер: рывки по 170–250 px).
      // Запаса копий хватает на целый круг кликов подряд, а после остановки
      // ленту всё равно досаживает в середину settle().
      let target = i;
      if (loop && (target < 0 || target > slides.length - metrics().per)) {
        const here = base + label(index);
        target += here - index;
        index = here;
        applyHero(here, false);
      }
      if (!loop) target = Math.max(0, Math.min(stops() - 1, target));
      index = target;
      pending = target;
      clearTimeout(pendingTimer);
      // Страховка: если плавную прокрутку перебьют пальцем, точка назначения
      // может так и не совпасть — ожидание не должно висеть вечно.
      pendingTimer = setTimeout(() => { pending = -1; }, 700);
      applyHero(target, true);
      renderMeta();
      track.scrollTo({ left: stopLeft(target), behavior: 'smooth' });
    };

    const nearest = () => {
      if (strip) {
        const { step } = metrics();
        return step > 0 ? limit(Math.round(track.scrollLeft / step)) : 0;
      }
      const point = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((slide, i) => {
        const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - point);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    };

    // Кадр прокрутки: обновляем только то, что не меняет раскладку.
    const sync = () => {
      if (pending >= 0 && Math.abs(track.scrollLeft - stopLeft(pending)) > 2) return;
      index = loop ? nearest() : Math.min(nearest(), stops() - 1);
      if (!strip) applyHero(index, true);
      renderMeta();
    };

    // Прокрутка остановилась — досаживаем ленту: возвращаем кольцо в середину
    // и ставим главную карточку. Если она и так на месте (доехали по клику,
    // ширина уже переезжает плавно) — не трогаем, чтобы не рвать анимацию.
    const settle = () => {
      pending = -1;
      clearTimeout(pendingTimer);
      index = loop ? nearest() : Math.min(nearest(), stops() - 1);
      let jump = false;
      if (loop) {
        const norm = base + label(index);
        if (norm !== index) { index = norm; jump = true; }
      }
      const accent = accentOf(index);
      const placed = accent < 0
        ? !slides.some((slide) => slide.classList.contains('is-active'))
        : slides[accent].classList.contains('is-active');
      if (jump || !placed) applyHero(index, false);
      renderMeta();
    };

    if (prev) prev.addEventListener('click', () => goTo(index - 1));
    if (next) next.addEventListener('click', () => goTo(index + 1));

    // Тачпад: горизонтальный жест листает ровно на одну карточку, как стрелка.
    // Родная прокрутка тут не годится — инерция тачпада пролетала несколько
    // карточек, а после остановки лента досаживалась рывком (жалоба клиента
    // 19.09.2026). Палец на телефоне генерирует touch, а не wheel, и сюда
    // не попадает — его держит scroll-snap-stop в layout.css.
    //
    // Жест = серия событий без пауз длиннее 220 мс (вместе с хвостом инерции).
    // Ось жеста решается один раз, по первым ~10 px: иначе палец, легший чуть
    // наискось, половину жеста крутил бы страницу, а половину — ленту.
    // • ось x — один шаг на жест, остальное глотаем;
    // • ось y — это прокрутка страницы. Родную пропускаем, только если в
    //   событии нет горизонтали: иначе браузер заодно сдвинул бы ленту мимо
    //   карточки (или прилип бы к ней и не крутил страницу вовсе), поэтому
    //   такие события крутим сами.
    //
    // ⚠️ Пауза — не единственный признак нового жеста. На Mac хвост инерции
    // идёт без перерывов 1–2 с, и свайп, сделанный поверх него, приходил тем же
    // потоком — ступал только после клика мышью, который гасит инерцию (жалоба
    // клиента 19.09.2026). Поэтому новый жест внутри потока узнаём так:
    // инерция только затухает, а свайп разгоняется — модуль дельты растёт
    // два события подряд; либо сменилось направление.
    let wheelAxis = '';
    let wheelX = 0;
    let wheelY = 0;
    let wheelStepped = false;
    let wheelLast = 0;
    let wheelRise = 0;
    let wheelDir = 0;
    // Свайп в начале сам разгоняется — рост считаем новым жестом только
    // после того, как текущий прошёл пик и пошёл на спад.
    let wheelPeaked = false;
    let wheelIdle;
    const wheelStep = (dir) => {
      wheelStepped = true;
      wheelDir = dir;
      wheelRise = 0;
      wheelPeaked = false;
      goTo(index + dir);
    };
    track.addEventListener('wheel', (e) => {
      if (e.ctrlKey) return; // щипок на тачпаде — это масштаб страницы
      clearTimeout(wheelIdle);
      wheelIdle = setTimeout(() => {
        wheelAxis = '';
        wheelX = 0;
        wheelY = 0;
        wheelStepped = false;
        wheelLast = 0;
        wheelRise = 0;
      }, 220);
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      if (!wheelAxis) {
        wheelX += dx;
        wheelY += dy;
        if (Math.abs(wheelX) + Math.abs(wheelY) >= 10) {
          wheelAxis = Math.abs(wheelX) > Math.abs(wheelY) ? 'x' : 'y';
        }
      }
      if (wheelAxis === 'x') {
        e.preventDefault();
        const size = Math.abs(dx);
        const dir = Math.sign(dx);
        const last = wheelLast;
        wheelLast = size;
        if (!wheelStepped) {
          wheelStep(wheelX > 0 ? 1 : -1);
          return;
        }
        // Мелочь (< 4 px) — хвост инерции или дрожь пальца, по ней не решаем
        if (size < 4) { wheelRise = 0; return; }
        if (dir && dir !== wheelDir) { wheelStep(dir); return; }
        if (size < last) wheelPeaked = true;
        wheelRise = wheelPeaked && size > last * 1.15 + 0.5 ? wheelRise + 1 : 0;
        if (wheelRise >= 2) wheelStep(dir);
        return;
      }
      if (!dx) return;
      e.preventDefault();
      window.scrollBy({ top: dy, behavior: 'instant' });
    }, { passive: false });

    // Скролл сыплет событиями пачками — обновляем не чаще кадра
    let frame = 0;
    let rest;
    track.addEventListener('scroll', () => {
      clearTimeout(rest);
      rest = setTimeout(settle, 160);
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; sync(); });
    }, { passive: true });

    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Число карточек в кадре меняется на брейкпоинтах — позицию
        // пересобираем заново, иначе трек останется между карточками.
        if (!loop) index = Math.min(index, stops() - 1);
        applyHero(index, false);
        renderMeta();
      }, 150);
    });

    applyHero(index, false);
    renderMeta();
  };

  // Блокам с каруселью своего JS не нужно: разметка статичная, достаточно
  // пометить корень атрибутом data-carousel-root.
  document.querySelectorAll('[data-carousel-root]').forEach(initCarousel);

})();
