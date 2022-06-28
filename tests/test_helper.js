const Note = require("../models/note.js");

const initialNotes = [
  {
    content: "first note",
    date: new Date(),
    important: false,
  },
  {
    content: "interesting content",
    date: new Date(),
    important: true,
  },
];

const generateNonExistingId = async () => {
  const note = new Note({ content: "nth important", date: new Date() });
  await note.save();
  await note.remove();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};

module.exports = {
  initialNotes,
  generateNonExistingId,
  notesInDb,
};
