const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = (request) => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     GetNote:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: Content of the note
 *         date:
 *           type: string
 *           format: date
 *           description: Creation date of the note
 *         important:
 *           type: boolean
 *           description: Inportance of the note
 *         id:
 *           type: string
 *           description: Id of the note
 *       example:
 *         content: Some interesting content
 *         date: 2022-06-27T13:41:12.306Z
 *         important: false
 *         id: 62b9b378e1aa8ecefa401d78
 */

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: The notes managing API
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Returns the list of all the notes
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: The list of the Notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GetNote'
 */

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

/**
 * @swagger
 * /api/notes/{$id}:
 *   get:
 *     summary: Get the note by ID
 *     tags: [Notes]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *     responses:
 *       200:
 *         description: The list of the Notes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetNote'
 *       404:
 *         description: Note with this ID not found
 */

notesRouter.get("/:id", async (request, response, next) => {
  const note = await Note.findById(request.params.id);
  if (note) {
    return response.json(note);
  } else {
    return response.status(404).end();
  }
});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (body.content === undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

notesRouter.put("/:id", async (request, response, next) => {
  const { content, important } = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" },
  );
  response.json(updatedNote);
});

module.exports = notesRouter;
