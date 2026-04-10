let currentFileName = "text.txt";
let modified = false;

function updateFileName(){
  document.getElementById("filename").textContent =
    "File: " + currentFileName;
}

function updateModified(){
  document.getElementById("modified").textContent =
    modified ? "*" : "";
}

function updateStatus(){
  const text = document.getElementById("text").value;

  const lines = text.split("\n").length;
  const chars = text.length;

  document.getElementById("linecount").textContent =
    "Line: " + lines;

  document.getElementById("charcount").textContent =
    "Chars: " + chars;
}

function setModified(){
  modified = true;
  updateModified();
}

async function loadFile(){
  try{
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: "Text Files",
        accept: { "text/plain": [".txt", ".mml", ".html"] }
      }]
    });

    currentFileName = handle.name;
    updateFileName();

    const file = await handle.getFile();
    const text = await file.text();

    document.getElementById("text").value = text;

    modified = false;
    updateModified();
    updateStatus();

  }catch(e){
    console.log(e);
  }
}

function processText(text) {

  // ① 改行コード統一（CRLF → LF）
  text = text.replace(/\r\n/g, '\n');

  // ② 行頭の//削除
  //text = text.replace(/^\/\/\s?/gm, '');

  // ③ タブ → 半角スペース2つ
  text = text.replace(/\t/g, '  ');

  // ④ 全角スペース → 半角
  text = text.replace(/　/g, ' ');

  return text;
}

async function editFile() {
  let text = document.getElementById("text").value;

  text = processText(text);

  document.getElementById("text").value = text;
}

async function saveFile(){
  try{
    const text = document.getElementById("text").value;

    const handle = await window.showSaveFilePicker({
      suggestedName: currentFileName,
      types: [{
        description: "Text Files",
        accept: { "text/plain": [".txt", ".mml", ".html"] }
      }]
    });

    currentFileName = handle.name;
    updateFileName();

    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();

    modified = false;
    updateModified();
    updateStatus();

  }catch(e){
    console.log(e);
  }
}

// --- textarea へのドラッグ＆ドロップ機能 ---

const textArea = document.getElementById("text");

// ドラッグ中（textareaの上に乗っている間）の処理
textArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  textArea.style.backgroundColor = "#f0f8ff"; // ドロップ可能であることを示す色
});

// ドラッグが離れた、またはキャンセルされた時の処理
textArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  textArea.style.backgroundColor = ""; // 元の色に戻す
});

// ドロップされた時の処理
textArea.addEventListener('drop', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  textArea.style.backgroundColor = ""; // 背景色を戻す

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    const file = files[0];
    
    try {
      const text = await file.text();
      
      // 既存のステータス更新処理を流用
      currentFileName = file.name;
      updateFileName();
      
      document.getElementById("text").value = text;
      
      modified = false;
      updateModified();
      updateStatus();
    } catch (err) {
      console.error("ファイルの読み込みに失敗しました:", err);
    }
  }
});

document.getElementById("text").addEventListener("input", function(){
  setModified();
  updateStatus();
});

updateFileName();
updateModified();
updateStatus();
