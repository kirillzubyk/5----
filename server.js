const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

const db = new sqlite3.Database('diary.db');

db.run(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    entryText TEXT
  )
`);

// Отправка записей при подключении клиента
io.on('connection', (socket) => {
  sendEntriesToSocket(socket);

  // Добавление новой записи
  socket.on('addEntry', (entry) => {
    db.run('INSERT INTO entries (date, entryText) VALUES (?, ?)', [entry.date, entry.entryText], function (err) {
      if (err) {
        console.error(err.message);
        return;
      }

      entry.id = this.lastID;
      io.emit('entryAdded', entry);
    });
  });

  // Удаление записи
  socket.on('deleteEntry', (id) => {
    db.run('DELETE FROM entries WHERE id = ?', [id], function (err) {
      if (err) {
        console.error(err.message);
        return;
      }

      io.emit('entryDeleted', id);
    });
  });
});

// Отправка всех записей сокету
function sendEntriesToSocket(socket) {
  db.all('SELECT * FROM entries', (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }

    socket.emit('entries', rows);
  });
}

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

