const SITE_KEY = '0x4AAAAAAA1K1jrmgz4eYx4s';

const translateBtn = document.getElementById('translate-btn');

function onLoadTurnstile() {
  translateBtn.disabled = true;
  turnstile.render('#turnstile-widget', {
    sitekey: SITE_KEY,
    callback: onTurnstileSuccess,
    'error-callback': onTurnstileError,
    'expired-callback': onTurnstileExpired,
  });
}

async function onTurnstileSuccess(token) {
  const formData = new FormData();
  formData.append('cf-turnstile-response', token);

  const response = await fetch('/auth', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    translateBtn.disabled = false;
  } else {
    translateBtn.disabled = true;
    alert('認証に失敗しました。再度お試しください。');
  }
}

function onTurnstileError() {
  translateBtn.disabled = true;
  alert('Turnstileエラーが発生しました。再度お試しください。');
}

function onTurnstileExpired() {
  translateBtn.disabled = true;
  turnstile.reset();
}
