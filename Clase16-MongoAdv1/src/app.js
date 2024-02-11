const password = 'Cn9o0TqM4pQak0kx';


const mongoose = require('mongoose');


// const main = async () => {
//   const databaseName = 'OnlyShop';
//   const uri = `mongodb+srv://matiasnicolasmoresi:${password}@cluster0.5jasxmm.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
//   await mongoose.connect(uri)
//     .then(() => { console.log('Connection OK') })
//     .catch((error) => { console.log(`Connection error -> ${error}`) });
//   const userModel = require('./models/user.model.js');
//   const response = await userModel.find({ edad: { $lt: 19 } }).explain('executionStats');
//   const { nReturned, executionTimeMillis } = response?.executionStats;

//   console.log('executionStats.nReturned', nReturned);
//   console.log('executionStats.executionTimeMillis', executionTimeMillis);
// }
// main();

const start = async () => {

  const databaseName = 'CoderHouse';
  const uri = `mongodb+srv://matiasnicolasmoresi:${password}@cluster0.5jasxmm.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
  await mongoose.connect(uri)
    .then(() => { console.log(`Connection OK`) })
    .catch((error) => { console.log(`Connection error -> ${error}`) });

  const cursoModel = require('./models/cursos.model.js');
  const cursoBackend = await cursoModel.findById('65ba5e71a8c30eeb918c6b54');
  // console.log(cursoBackend);

  const alumnoModel = require('./models/alumnos.model.js');
  const estudiante = await alumnoModel.findById('65ba5e6aa8c30eeb918c6b4e');
  if (!estudiante.cursos.includes(cursoBackend._id)) {
    estudiante.cursos.push(cursoBackend);
    const updateResponse = await alumnoModel.findByIdAndUpdate(estudiante._id, estudiante, { new: true }).populate('cursos');
    console.log('updateResponse', updateResponse);
  }
}

start();