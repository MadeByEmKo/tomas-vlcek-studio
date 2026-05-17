/* ============================================================
   form.js — Contact form submission via Apps Script
   ============================================================ */

'use strict';

const FORM_API_URL = 'https://script.google.com/macros/s/AKfycbw2nek2df3jPkD2Su9vvMOMEBnAEMn0eM2MvEc3PmIJxtqSv1HnSV9MZzKQgd3Bql05aQ/exec'; // same URL as in cms.js

const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('formSubmit');
const formMsg    = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem('tv_lang') || 'cs';

    // Basic validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      showMsg(lang === 'en' ? 'Please fill in all required fields.' : 'Vyplňte prosím všechna povinná pole.', 'error');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('span[data-i18n]').style.opacity = '0.5';

    const body = { action: 'contact', name, email, phone: form.phone.value.trim(), message };

    if (FORM_API_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
      // Simulate success (no API yet)
      await new Promise(r => setTimeout(r, 800));
      showMsg(
        lang === 'en'
          ? '✓ Thank you! Your message has been sent. I\'ll be in touch soon.'
          : '✓ Děkuji! Vaše zpráva byla odeslána. Ozvu se vám co nejdříve.',
        'success'
      );
      form.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('span[data-i18n]').style.opacity = '1';
      return;
    }

    try {
      const res  = await fetch(FORM_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.status === 'ok') {
        showMsg(
          lang === 'en'
            ? '✓ Thank you! Your message has been sent. I\'ll be in touch soon.'
            : '✓ Děkuji! Vaše zpráva byla odeslána. Ozvu se vám co nejdříve.',
          'success'
        );
        form.reset();
      } else throw new Error();
    } catch {
      showMsg(
        lang === 'en'
          ? 'Something went wrong. Please try again or email us directly.'
          : 'Něco se pokazilo. Zkuste to prosím znovu nebo nám napište přímo na email.',
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('span[data-i18n]').style.opacity = '1';
    }
  });
}

function showMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className = `form-status ${type}`;
  formMsg.style.display = 'block';
  setTimeout(() => { formMsg.style.display = 'none'; }, 7000);
}
