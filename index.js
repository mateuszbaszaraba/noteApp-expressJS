const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { user, password } = require('./key');

const app = express();

app.use(express.json());
app.use(cors());

const url = `mongodb+srv://${user}:${password}@cluster0.bwekvqb.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  console.log('----------');
  next();
};

app.use(requestLogger);

app.use(express.static('build'));

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => id)) : 0;
  return maxId + 1;
};

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId,
  };

  notes = notes.concat(note);
  response.json(note);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const note = notes.find((note) => {
    console.log(note.id === id);
    return note.id === id;
  });

  if (note) {
    response.json(note);
  } else {
    response.statusMessage = 'Note not found';
    response.status(404).end();
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
