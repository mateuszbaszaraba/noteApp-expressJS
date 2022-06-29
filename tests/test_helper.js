const Note = require("../models/note.js");
const User = require("../models/user");

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

const initialUser = {
  username: "testingUser",
  name: "testName",
  password: "something",
};

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

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialNotes,
  initialUser,
  generateNonExistingId,
  notesInDb,
  usersInDb,
};
