document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt");
  const translateBtn = document.getElementById("translate-btn");
  const errorMessage = document.getElementById("translate-error-message");
  const historyList = document.getElementById("history-list");
  const translateForm = document.getElementById("translate-form");

  // 入力欄の変更を監視してボタンの有効化を制御
  promptInput.addEventListener("input", () => {
    translateBtn.disabled = promptInput.value.trim() === "";
  });

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // 翻訳履歴の追加
  function addToHistory(inputText, translatedText) {
    const historyItem = document.createElement("li");
    historyItem.innerHTML = `<strong>日本語:</strong> ${escapeHTML(inputText)}<br><strong>英語:</strong> ${escapeHTML(translatedText)}`;
    historyList.appendChild(historyItem);
    historyList.scrollTop = historyList.scrollHeight; // 履歴リストをスクロールダウン
  }

  // 翻訳処理
  async function translateText(event) {
    event.preventDefault();
    translateBtn.disabled = true;
    errorMessage.style.display = "none";

    try {
      const formData = new FormData(translateForm);
      const response = await fetch(`/api/translate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const translatedText = await response.text();
      addToHistory(promptInput.value, translatedText);
      promptInput.value = "";
    } catch (error) {
      console.error("エラー: ", error);
      errorMessage.textContent = "翻訳に失敗しました。もう一度試してください。";
      errorMessage.style.display = "block";
      translateBtn.disabled = false;
    }
  }

  // フォームの送信イベントに翻訳処理をバインド
  translateForm.addEventListener("submit", translateText);

  // Enterキーでの送信を制御
  promptInput.addEventListener("keydown", (event) => {
    if (!event.isComposing && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!translateBtn.disabled) {
        translateForm.requestSubmit();
      }
    }
  });

  // ページ読み込み時に入力欄にフォーカス
  promptInput.focus();
});
