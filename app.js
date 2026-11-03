const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const languageSelect = document.querySelector("#language");
const transcriptField = document.querySelector("#transcript");
const statusMessage = document.querySelector("#status");
const statusIndicator = document.querySelector("#status-indicator");
const copyButton = document.querySelector("#copy");
const downloadButton = document.querySelector("#download");
const clearButton = document.querySelector("#clear");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
let finalTranscript = "";
let shouldKeepListening = false;

function setStatus(message, listening = false) {
  statusMessage.textContent = message;
  statusIndicator.classList.toggle("is-listening", listening);
}

function setListening(listening) {
  startButton.disabled = listening;
  stopButton.disabled = !listening;
  languageSelect.disabled = listening;
}

function showTranscript(interimTranscript = "") {
  transcriptField.value = `${finalTranscript}${interimTranscript}`;
}

function startRecognition() {
  if (!recognition || !shouldKeepListening) {
    return;
  }

  try {
    recognition.start();
  } catch (error) {
    if (error.name !== "InvalidStateError") {
      shouldKeepListening = false;
      setListening(false);
      setStatus("音声認識を開始できませんでした。もう一度お試しください。");
    }
  }
}

if (!SpeechRecognition) {
  startButton.disabled = true;
  setStatus("このブラウザーは音声認識に対応していません。ChromeまたはEdgeをお試しください。");
} else {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = languageSelect.value;

  recognition.addEventListener("start", () => {
    setListening(true);
    setStatus("聞き取り中です。マイクに向かって話してください。", true);
  });

  recognition.addEventListener("result", (event) => {
    let interimTranscript = "";

    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    showTranscript(interimTranscript);
  });

  recognition.addEventListener("error", (event) => {
    if (event.error === "no-speech") {
      setStatus("音声が聞き取れませんでした。マイクに向かって話してください。", true);
      return;
    }

    shouldKeepListening = false;
    setListening(false);
    const messages = {
      "not-allowed": "マイクの使用が許可されていません。ブラウザーの設定をご確認ください。",
      "service-not-allowed": "音声認識サービスを利用できません。",
      "audio-capture": "マイクが見つかりません。接続を確認してください。",
      network: "ネットワークエラーです。接続を確認して、もう一度お試しください。",
    };
    setStatus(messages[event.error] || "音声認識中にエラーが発生しました。");
  });

  recognition.addEventListener("end", () => {
    if (shouldKeepListening) {
      window.setTimeout(startRecognition, 250);
      return;
    }

    setListening(false);
    setStatus("文字起こしを停止しました。");
  });

  startButton.addEventListener("click", () => {
    shouldKeepListening = true;
    setStatus("音声認識を開始しています…");
    startRecognition();
  });

  stopButton.addEventListener("click", () => {
    shouldKeepListening = false;
    recognition.stop();
  });

  languageSelect.addEventListener("change", () => {
    recognition.lang = languageSelect.value;
  });
}

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(transcriptField.value);
    setStatus("文字起こし結果をコピーしました。");
  } catch (error) {
    setStatus("コピーできませんでした。ブラウザーのクリップボード権限をご確認ください。");
  }
});

downloadButton.addEventListener("click", () => {
  const file = new Blob([transcriptField.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "transcription.txt";
  link.click();
  URL.revokeObjectURL(url);
});

clearButton.addEventListener("click", () => {
  finalTranscript = "";
  showTranscript();
  setStatus("文字起こし結果をクリアしました。");
});
