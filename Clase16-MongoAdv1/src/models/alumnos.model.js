const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, index: true },
  apellido: { type: String },
  email: { type: String, unique: true, required: true },
  edad: { type: Number },
  cursos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cursos'
  }]
})

const alumnoModel = mongoose.model('alumnos', alumnoSchema)
module.exports = alumnoModel; 