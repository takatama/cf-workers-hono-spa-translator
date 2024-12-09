// あなたのSite Keyに書き換えてください
const SITE_KEY = '0x4AAAAAAA1K1jrmgz4eYx4s';

const TurnstileManager = (() => {
  let callbacks = {};

  function init(widgetId, options = {}) {
    callbacks = {
      started: options.onStarted || (() => {}),
      success: options.onSuccess || (() => {}),
      error: options.onError || (() => {}),
      expired: options.onExpired || (() => {}),
    };

    // 初期化開始のコールバックを呼び出し
    callbacks.started();

    // Turnstileウィジェットを描画
    turnstile.render(widgetId, {
      sitekey: SITE_KEY,
      callback: handleSuccess,
      'error-callback': handleError,
      'expired-callback': handleExpired,
    });
  }

  async function handleSuccess(token) {
    try {
      const formData = new FormData();
      formData.append('cf-turnstile-response', token);

      const response = await fetch('/auth', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        callbacks.success();
      } else {
        callbacks.error();
        alert('認証に失敗しました。再度お試しください。');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      callbacks.error();
    }
  }

  function handleError() {
    callbacks.error();
    alert('Turnstileエラーが発生しました。再度お試しください。');
  }

  function handleExpired() {
    callbacks.expired();
    turnstile.reset();
  }

  return { init };
})();

function onLoadTurnstile() {
  const translateBtn = document.getElementById('translate-btn');
  
  TurnstileManager.init('#turnstile-widget', {
    onStarted: () => {
      translateBtn.disabled = true;
    },
    onSuccess: () => {
      translateBtn.disabled = false;
    },
    onError: () => {
      translateBtn.disabled = true;
    },
    onExpired: () => {
      translateBtn.disabled = true;
    },
  });
}
