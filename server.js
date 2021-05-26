

const { json } = require('body-parser');
const fs = require("fs");
const express = require('express');
const path = require('path');
const dataPath = './db/db.json'

const app = express();
const PORT = process.env.PORT || 8080;



app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Read File function for reading json

const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      throw err;
    }
    callback(returnJson ? JSON.parse(data) : data);
  });
};


// Write File Function

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err;
    }
    callback();
  });
};

//Route for  notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//Route for landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Route for api for getting all sotred notes
app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});

// Route for api for entering new note
app.post('/api/notes', (req, res) => {
  readFile(data => {
    data = data.concat(req.body);
    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send('new note added');
    });
  },
    true);
});

// Route fir deleting stored note
app.delete('/api/notes/:id', (req, res) => {
  const NoteId = req.params.id;
  readFile(data => {
    data = data.filter(selected => {
      return selected.title != NoteId;
    })
    writeFile(JSON.stringify(data, null, 2), () => {
      res.status(200).send(`${NoteId} removed`);
    });
  },
    true);
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
