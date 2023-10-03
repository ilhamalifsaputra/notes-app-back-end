const {nanoid} = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const {title, tags, body} = request.payload;

  const id = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;

  const newNote = {
    title, tags, body, id, createAt, updateAt,
  };
  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dibuat',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  };

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dibuat',
  });
  response.code(500);
  return response;
};

const getAllNoteHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNotebyIdHandler = (request, h) => {
  const {id} = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const {id} = request.params;
  const {title, tags, body} = request.payload;
  const updateAt = new Date().toISOString();

  index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updateAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(202);
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan, ID tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(202);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus, ID tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNoteHandler,
  getNotebyIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
