/* ============================================================
   form.js — Contact form with validation & Apps Script API
   ============================================================ */
'use strict';

const API_URL = 'https://script.google.com/macros/s/AKfycbw2nek2df3jPkD2Su9vvMOMEBnAEMn0eM2MvEc3PmIJxtqSv1HnSV9MZzKQgd3Bql05aQ/exec';

const form    = document.getElementById('contactForm');
const submit  = document.getElementById('formSubmit');
const statusEl = document.getElementById('formMsg');

if (!form) throw new Error('Contact form not found');

// ── Validation ────────────────────────────────────────────────
function validate() {
  let ok = true;
  form.querySelectorAll('[required]').forEach(el => {
    const valid = el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
    el.classList.toggle('invalid', !valid);
    if (!valid) ok = false;
  });
  return ok;
}

form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('invalid'));
});

// ── Status message ────────────────────────────────────────────
function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className   = `form-status ${type}`;
  statusEl.hidden      = false;
  setTimeout(() => { statusEl.hidden = true; }, 7000);
}

// ── Submit ────────────────────────────────────────────────────
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validate()) return;

  const lang = localStorage.getItem('tv_lang') || 'cs';
  const btnText = submit.querySelector('span');

  submit.disabled  = true;
  btnText.textContent = lang === 'en' ? 'Sending…' : 'Odesílám…';

  const body = new URLSearchParams({
    action:  'contact',
    name:    form.querySelector('[name="name"]').value.trim(),
    email:   form.querySelector('[name="email"]').value.trim(),
    phone:   form.querySelector('[name="phone"]').value.trim(),
    message: form.querySelector('[name="message"]').value.trim(),
  });

  try {
    const res  = await fetch(API_URL, { method: 'POST', body });
    const data = await res.json();

    if (data.status === 'ok') {
      showStatus(lang === 'en' ? '✓ Your message was sent successfully. I will get back to you shortly.' : '✓ Zpráva byla úspěšně odeslána. Brzy se vám ozvu.', 'ok');
      form.reset();
    } else {
      throw new Error(data.message || 'Server error');
    }
  } catch (err) {
    console.error('[Form]', err);
    showStatus(lang === 'en' ? '✗ Something went wrong. Please try again or email directly.' : '✗ Něco se pokazilo. Zkuste to znovu nebo napište přímo e-mailem.', 'err');
  } finally {
    submit.disabled  = false;
    btnText.textContent = lang === 'en' ? 'Send Message' : 'Odeslat zprávu';
  }
});
