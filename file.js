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

document.getElementById("text").addEventListener("input", function(){
  setModified();
  updateStatus();
});

updateFileName();
updateModified();
updateStatus();
