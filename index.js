let db = null;
function createDB() {
  const dbName = document.querySelector('#dbName').value;
  const dbVersion = document.querySelector('#dbVersion').value;
  const request = indexedDB.open(dbName, dbVersion);

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    const pNotes = db.createObjectStore('personal_notes', { keyPath: 'title', value: 'content' });
    const tNotes = db.createObjectStore('todo_notes', { keyPath: 'title', value: 'content' });
    console.log('onupgradeneeded', db);
  }
  request.onsuccess = (e) => {
    db = e.target.result;
    console.log('onsuccess', db);
  }
  request.onerror = (e) => {
    console.log('onerror', e);
  }
}

function addNote() {
  const note = {
    title: 'Note 1' + Math.random(),
    text: "This is a note"
  }
  const tx = db.transaction('personal_notes', 'readwrite');
  tx.onerror = (e) => {
    console.log('tx error', e);
  }
  const pNotes = tx.objectStore('personal_notes');
  pNotes.add(note);
}
function viewNotes() {
  const tx = db.transaction('personal_notes', 'readonly');
  const pNotes = tx.objectStore('personal_notes');
  const request = pNotes.openCursor();
  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      console.log('viewNotes', e.target.result);
      cursor.continue();
    }
  }
}