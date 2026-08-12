// form.js — блок 18: маска телефона, валидация, отправка, экран успеха.
// Форма живёт только в модалке; открывает её window.openForm(topic) из main.js.
(() => {
  'use strict';

  const modal = document.getElementById('form');
  if (!modal) return;

  const windowEl = modal.querySelector('.form-modal__window');
  const form = modal.querySelector('.form');
  const success = modal.querySelector('.form-modal__success');
  const nameInput = form.querySelector('[name="name"]');
  const phoneInput = form.querySelector('[name="phone"]');
  const consentInput = form.querySelector('[name="consent"]');
  const schoolsEl = form.querySelector('.form__schools');
  const schoolInputs = Array.from(form.querySelectorAll('[name="school"]'));
  const topicInput = form.querySelector('[name="topic"]');
  const submitBtn = form.querySelector('.form__submit');
  const closeBtn = windowEl.querySelector('.form-modal__close');

  // Телефоны — тот же порог, что и в CSS (мобильная раскладка формы ≤767)
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  let lastFocused = null;

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

  const phoneDigits = () => phoneInput.value.replace(/\D/g, '');

  phoneInput.addEventListener('input', () => {
    phoneInput.value = formatPhone(phoneInput.value);
  });

  // Клик в пустое поле сразу ставит +7, чтобы не пришлось его набирать
  phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value) phoneInput.value = '+7 (';
  });

  phoneInput.addEventListener('blur', () => {
    if (phoneDigits().length <= 1) phoneInput.value = '';
  });

  /* ---------- валидация ---------- */

  function setError(input, message) {
    const field = input.closest('.form__field');
    const box = form.querySelector('[data-error-for="' + input.name + '"]');

    if (field) field.classList.toggle('form__field--error', Boolean(message));
    if (box) box.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  // Радиогруппа — не одно поле: у неё нет своей `.form__field`, а невыбранным
  // считается сразу весь набор. Поэтому подсветку вешаем на fieldset,
  // а aria-invalid проставляем каждому переключателю.
  function setSchoolError(message) {
    const box = form.querySelector('[data-error-for="school"]');

    schoolsEl.classList.toggle('form__schools--error', Boolean(message));
    schoolInputs.forEach((i) => i.setAttribute('aria-invalid', message ? 'true' : 'false'));
    if (box) box.textContent = message || '';
  }

  function validate() {
    let firstInvalid = null;

    if (!nameInput.value.trim()) {
      setError(nameInput, 'Укажите имя');
      firstInvalid = firstInvalid || nameInput;
    } else {
      setError(nameInput, '');
    }

    // 10 цифр без кода страны — полный российский номер
    if (phoneDigits().length !== 10) {
      setError(phoneInput, 'Укажите номер полностью');
      firstInvalid = firstInvalid || phoneInput;
    } else {
      setError(phoneInput, '');
    }

    if (schoolInputs.length && !schoolInputs.some((i) => i.checked)) {
      setSchoolError('Выберите ступень');
      // Фокусируем fieldset, а не радио: у переключателей width/height 0,
      // фокус на них невидим и экран к ошибке не прокручивается
      firstInvalid = firstInvalid || schoolsEl;
    } else {
      setSchoolError('');
    }

    if (!consentInput.checked) {
      setError(consentInput, 'Нужно согласие на обработку данных');
      firstInvalid = firstInvalid || consentInput;
    } else {
      setError(consentInput, '');
    }

    return firstInvalid;
  }

  [nameInput, phoneInput].forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validate();
    });
  });

  consentInput.addEventListener('change', () => {
    if (consentInput.getAttribute('aria-invalid') === 'true') validate();
  });

  // Выбрал школу — ошибка группы снимается сразу, не дожидаясь повторной отправки
  schoolInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.getAttribute('aria-invalid') === 'true') validate();
    });
  });

  /* ---------- отправка ---------- */

  // Куда слать заявки, клиент ещё не решил (почта / Telegram / CRM).
  // Пока имитация; когда решит — здесь появится один fetch, остальное не меняется.
  function sendLead(data) {
    return new Promise((resolve) => {
      console.info('Заявка (имитация отправки):', data);
      setTimeout(resolve, 600);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const invalid = validate();
    if (invalid) {
      invalid.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    submitBtn.disabled = true;

    sendLead(data).then(() => {
      submitBtn.disabled = false;
      form.hidden = true;
      success.hidden = false;
      success.querySelector('.form-modal__success-btn').focus();
    });
  });

  /* ---------- открытие и закрытие ---------- */

  function open(topic = '') {
    form.hidden = false;
    success.hidden = true;

    // reset() обязательно до подстановки темы — иначе он затрёт скрытое поле
    form.reset();
    topicInput.value = topic || '';
    [nameInput, phoneInput, consentInput].forEach((i) => setError(i, ''));
    setSchoolError('');

    lastFocused = document.activeElement;
    modal.hidden = false;
    window.lockScroll();

    // ⚠️ На телефоне фокус в поле НЕ ставим (просьба клиента 22.07.2026).
    // iOS поднимает клавиатуру и сам подкручивает форму к активному полю —
    // верх окна с крестиком уезжает за экран, и закрыть форму нечем.
    // Фокус отдаём крестику: клавиатура не появляется, но точка входа
    // остаётся внутри модалки — это нужно и ловушке фокуса ниже, и Esc,
    // и чтением с экрана (иначе фокус остался бы на кнопке за модалкой).
    if (isMobile()) closeBtn.focus();
    else nameInput.focus();
  }

  function close() {
    if (modal.hidden) return;

    modal.hidden = true;
    window.unlockScroll();

    if (lastFocused) lastFocused.focus();
    lastFocused = null;
  }

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-form-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Фокус не должен уходить из открытой модалки
  document.addEventListener('focusin', (e) => {
    if (modal.hidden || windowEl.contains(e.target)) return;
    windowEl.querySelector('.form-modal__close').focus();
  });

  // Заменяем заглушку из main.js на реальное открытие модалки
  window.openForm = open;
})();
