const mongoose = require("mongoose");

if (process.argv.length < 4) {
  console.log("Please provide the password as an argument: node mongo.js <password>");
  process.exit(1);
}

const password = process.argv[2];

const user = process.argv[3];

const url = `mongodb+srv://${user}:${password}@cluster0.bwekvqb.mongodb.net/noteApp?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// mongoose
//   .connect(url)
//   .then((result) => {
//     console.log('connected');

//     const note = new Note({
//       content: 'HTML is Easy',
//       date: new Date(),
//       important: true,
//     });

//     return note.save();
//   })
//   .then(() => {
//     console.log('note saved!');
//     return mongoose.connection.close();
//   })
//   .catch((err) => console.log(err));

mongoose
  .connect(url)
  .then((res) => {
    console.log("1");
    return Note.find({}).then((result) => {
      console.log("2");
      result.forEach((note) => console.log(note));
    });
  })
  .then(() => {
    console.log("3");
    mongoose.connection.close();
  });
