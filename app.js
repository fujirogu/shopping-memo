// ===== 画面切り替え =====
function switchTo(screen) {
    document.getElementById('screen-shopping').classList.toggle('hidden', screen !== 'shopping');
    document.getElementById('screen-memo').classList.toggle('hidden', screen !== 'memo');
    document.body.classList.toggle('mode-memo', screen === 'memo');
}

// ===== 音声認識 =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) alert("このブラウザは音声認識に対応していません");

// ----- 買い物メモ -----
const speechButton = document.getElementById("speechButton");
const clearButton  = document.getElementById("clearButton");
const memoList     = document.getElementById("memoList");
const statusText   = document.getElementById("status");

let memos = [];
loadMemos();

const recognition = new SpeechRecognition();
recognition.lang = "ja-JP";
recognition.interimResults = false;
recognition.continuous = false;

speechButton.addEventListener("click", () => {
    statusText.textContent = "音声認識中...";
    recognition.start();
});
recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.trim();
    addMemo(text);
    statusText.textContent = "追加: " + text;
};
recognition.onerror = () => { statusText.textContent = "音声認識エラー"; };
recognition.onend   = () => { setTimeout(() => { statusText.textContent = "待機中"; }, 2000); };

function addMemo(text) { memos.push(text); saveMemos(); renderMemos(); }
function renderMemos() {
    memoList.innerHTML = "";
    for (const memo of memos) {
        const li = document.createElement("li");
        li.textContent = memo;
        li.addEventListener("click", () => {
            if (confirm("削除しますか？")) { memos = memos.filter(x => x !== memo); saveMemos(); renderMemos(); }
        });
        memoList.appendChild(li);
    }
}
function saveMemos() { localStorage.setItem("shoppingMemos", JSON.stringify(memos)); }
function loadMemos() {
    const data = localStorage.getItem("shoppingMemos");
    if (data) { memos = JSON.parse(data); renderMemos(); }
}
clearButton.addEventListener("click", () => {
    if (!confirm("全削除しますか？")) return;
    memos = []; saveMemos(); renderMemos();
});

// ----- 備忘録 -----
const speechButtonMemo = document.getElementById("speechButtonMemo");
const clearButtonMemo  = document.getElementById("clearButtonMemo");
const memoListNote     = document.getElementById("memoListNote");
const statusTextMemo   = document.getElementById("statusMemo");

let notes = [];
loadNotes();

const recognitionMemo = new SpeechRecognition();
recognitionMemo.lang = "ja-JP";
recognitionMemo.interimResults = false;
recognitionMemo.continuous = false;

speechButtonMemo.addEventListener("click", () => {
    statusTextMemo.textContent = "音声認識中...";
    recognitionMemo.start();
});
recognitionMemo.onresult = (event) => {
    const text = event.results[0][0].transcript.trim();
    addNote(text);
    statusTextMemo.textContent = "追加: " + text;
};
recognitionMemo.onerror = () => { statusTextMemo.textContent = "音声認識エラー"; };
recognitionMemo.onend   = () => { setTimeout(() => { statusTextMemo.textContent = "待機中"; }, 2000); };

function addNote(text) { notes.push(text); saveNotes(); renderNotes(); }
function renderNotes() {
    memoListNote.innerHTML = "";
    for (const note of notes) {
        const li = document.createElement("li");
        li.textContent = note;
        li.addEventListener("click", () => {
            if (confirm("削除しますか？")) { notes = notes.filter(x => x !== note); saveNotes(); renderNotes(); }
        });
        memoListNote.appendChild(li);
    }
}
function saveNotes() { localStorage.setItem("shoppingNotes", JSON.stringify(notes)); }
function loadNotes() {
    const data = localStorage.getItem("shoppingNotes");
    if (data) { notes = JSON.parse(data); renderNotes(); }
}
clearButtonMemo.addEventListener("click", () => {
    if (!confirm("全削除しますか？")) return;
    notes = []; saveNotes(); renderNotes();
});
