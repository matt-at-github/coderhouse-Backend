const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  dias: { type: [] },
  nombre: { type: String, index: true },
  horario: { type: String },
  numeroComision: { type: String }
})

const cursoModel = mongoose.model('cursos', cursoSchema)
module.exports = cursoModel; 