// consultation.js — блок 14 «Финальная форма» (ТЗ 06.09.2026, §18).
//
// Новый блок: раньше заявку принимала только модалка (js/form.js), а на странице
// не было секции с полями. Маска телефона и разбор ошибок повторяют js/form.js —
// поведение полей на странице и в модалке должно быть одинаковым.
//
// ⚠️ Куда уходит заявка. Живая форма сайта — click-форма Битрикс24 (js/bitrix.js
// переопределяет window.openForm и кликает по скрытой .b24-trigger). Своя отправка
// без интеграции слала бы заявки в никуда, поэтому здесь мы проверяем поля,
// складываем состояние в скрытые поля и передаём человека в форму Битрикса.
// Пункт 1 списка «на ревью»: как только клиент даст ID формы онлайн-школы
// (лучше embed-типа), поля отсюда можно будет отправлять напрямую.
(() => {
  'use strict';

  const root = document.querySelector('.consultation');
  if (!root) return;

  const form = root.querySelector('.consultation__form');
  const success = root.querySelector('.consultation__success');
  if (!form) return;

  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const gradeInput = form.querySelector('[name="grade"]');
  const hidden = {
    school_stage: form.querySelector('[name="school_stage"]'),
    education_format: form.querySelector('[name="education_format"]'),
    price: form.querySelector('[name="price"]'),
    cta_location: form.querySelector('[name="cta_location"]'),
  };

  /* ---------- маска +7 (___) ___-__-__ ---------- */

  function formatPhone(raw) {
    let digits = raw.replace(/\D/g, '');

    // 8 и 7 в начале считаем кодом страны
    if (digits[0] === '8' || digits[0] === '7') digits = digits.slice(1);
    digits = digits.slice(0, 10);

    if (!digits) return '';

    let out = '+7 (' + digits.slice(0, 3);
    if (digits.length >= 3) out += ') ' + digits.slice(3, 6);
    if (digits.length >= 6) out += '-' + digits.slice(6, 8);
    if (digits.length >= 8) out += '-' + digits.slice(8, 10);
    return out;
  }

  // ⚠️ Код страны отбрасываем: маска всегда пишет «+7 (», и без этой строки
  // в полном номере насчитывалось 11 цифр вместо 10 — валидный номер отбивался.
  const phoneDigits = () => {
    if (!phoneInput) return '';
    const digits = phoneInput.value.replace(/\D/g, '');
    return digits[0] === '7' || digits[0] === '8' ? digits.slice(1) : digits;
  };

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });

    // Клик в пустое поле сразу ставит +7, чтобы не пришлось его набирать
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value) phoneInput.value = '+7 (';
    });

    // Ушли из поля, где стоит только подставленный «+7 (» — убираем его,
    // иначе placeholder не виден и поле выглядит заполненным
    phoneInput.addEventListener('blur', () => {
      if (!phoneDigits()) phoneInput.value = '';
    });
  }

  /* ---------- валидация ---------- */

  function setError(input, message) {
    if (!input) return;
    const field = input.closest('.consultation__field');
    const box = form.querySelector('[data-error-for="' + input.name + '"]');

    if (field) field.classList.toggle('consultation__field--invalid', Boolean(message));
    if (box) box.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate() {
    let firstInvalid = null;

    if (nameInput) {
      const ok = nameInput.value.trim().length >= 2;
      setError(nameInput, ok ? '' : 'Напишите, как к вам обращаться');
      if (!ok && !firstInvalid) firstInvalid = nameInput;
    }

    if (phoneInput) {
      const ok = phoneDigits().length === 10;
      setError(phoneInput, ok ? '' : 'Введите номер телефона полностью');
      if (!ok && !firstInvalid) firstInvalid = phoneInput;
    }

    if (gradeInput) {
      const ok = Boolean(gradeInput.value);
      setError(gradeInput, ok ? '' : 'Выберите класс ребёнка');
      if (!ok && !firstInvalid) firstInvalid = gradeInput;
    }

    return firstInvalid;
  }

  // Сообщение об ошибке снимаем сразу, как человек начал править поле:
  // держать красную рамку во время набора — значит ругаться на незаконченный ввод
  [nameInput, phoneInput, gradeInput].forEach((input) => {
    if (!input) return;
    const event = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(event, () => setError(input, ''));
  });

  /* ---------- скрытые поля (§18) ---------- */

  // Ступень по номеру класса: человек выбирает класс, а в заявке по §18 нужна
  // ступень. Пишем только в своё скрытое поле и не трогаем window.setSchoolStage —
  // выбор в блоке «Выберите класс» сделан осознанно, и перебивать его выпадашкой
  // в конце страницы было бы неожиданно.
  // ⚠️ Коды ступеней те же, что во всех остальных блоках (primary / middle /
  // senior — см. data-stage у карточек классов и id ступеней в pricing.js).
  // Сначала здесь возвращались русские названия, и в одно и то же скрытое поле
  // попадало то «средняя школа» (когда класс выбран), то «middle» (когда
  // ступень бралась из состояния страницы) — в отчётах это два разных значения.
  function stageByGrade(grade) {
    const n = parseInt(grade, 10);
    if (!n) return '';
    if (n <= 4) return 'primary';
    if (n <= 9) return 'middle';
    return 'senior';
  }

  function syncHidden() {
    const choice = window.schoolChoice || {};
    const grade = gradeInput ? gradeInput.value : '';

    if (hidden.school_stage) {
      hidden.school_stage.value = stageByGrade(grade) || choice.school_stage || '';
    }
    if (hidden.education_format) hidden.education_format.value = choice.education_format || '';
    if (hidden.price) hidden.price.value = choice.price || '';
    if (hidden.cta_location) hidden.cta_location.value = 'consultation';
  }

  // Выбор в блоках «Классы», «Форматы» и «Стоимость» приезжает сюда событием
  // school-choice (см. main.js) — форма всегда несёт актуальное состояние.
  document.addEventListener('school-choice', syncHidden);
  if (gradeInput) gradeInput.addEventListener('change', syncHidden);
  syncHidden();

  /* ---------- отправка ---------- */

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }

    syncHidden();

    // cta_location в общем состоянии тоже проставляем: аналитика §22 читает его
    // оттуда, а сюда человек пришёл не через делегированный клик по [data-open-form]
    if (window.schoolChoice) window.schoolChoice.cta_location = 'consultation';

    if (typeof window.openForm === 'function') window.openForm('Консультация');
  });

  /* ---------- экран успеха ---------- */

  // ⚠️ ТЗ §18: клик по кнопке не считается успешной заявкой. Экран «Заявка
  // отправлена» показываем только по подтверждению от формы Битрикса.
  // Имя события зависит от версии загрузчика, поэтому слушаем оба варианта
  // и на window, и на document. ⚠️ Проверить на боевой форме онлайн-школы,
  // когда клиент даст её ID (пункт 1 списка «на ревью»): если ни одно событие
  // не приходит, блок успеха просто не показывается — ложного «отправлено» не будет.
  function showSuccess() {
    if (!success) return;
    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
  }

  ['b24:form:success', 'b24:form:submit'].forEach((name) => {
    window.addEventListener(name, showSuccess);
    document.addEventListener(name, showSuccess);
  });
})();
