const speechButton = document.getElementById("speechButton");
const clearButton = document.getElementById("clearButton");
const memoList = document.getElementById("memoList");
const statusText = document.getElementById("status");

let memos = [];

loadMemos();

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("このブラウザは音声認識に対応していません");
}

const recognition = new SpeechRecognition();

recognition.lang = "ja-JP";
recognition.interimResults = false;
recognition.continuous = false;

speechButton.addEventListener("click", () => {

    statusText.textContent = "音声認識中...";

    recognition.start();
});

recognition.onresult = (event) => {

    const text =
        event.results[0][0].transcript.trim();

    addMemo(text);

    statusText.textContent =
        "追加: " + text;
};

recognition.onerror = () => {

    statusText.textContent =
        "音声認識エラー";
};

recognition.onend = () => {

    setTimeout(() => {
        statusText.textContent = "待機中";
    }, 2000);
};

function addMemo(text) {

    memos.push(text);

    saveMemos();

    renderMemos();
}

function renderMemos() {

    memoList.innerHTML = "";

    for (const memo of memos) {

        const li = document.createElement("li");

        li.textContent = memo;

        li.addEventListener("click", () => {

            if (confirm("削除しますか？")) {

                memos = memos.filter(x => x !== memo);

                saveMemos();

                renderMemos();
            }
        });

        memoList.appendChild(li);
    }
}

function saveMemos() {

    localStorage.setItem(
        "shoppingMemos",
        JSON.stringify(memos)
    );
}

function loadMemos() {

    const data =
        localStorage.getItem("shoppingMemos");

    if (data) {

        memos = JSON.parse(data);

        renderMemos();
    }
}

clearButton.addEventListener("click", () => {

    if (!confirm("全削除しますか？")) {
        return;
    }

    memos = [];

    saveMemos();

    renderMemos();
});