const startApp = () => {
  const express = require('express');
  const app = express();
  const PORT = 8080;

  app.get("/operacionSimple", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 1000000; i++) {
      suma += i;
    }
    res.send({ suma });
  })
  app.get("/operacionCompleja", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 5e8; i++) {
      suma += i;
    }
    res.send({ suma });
  })
  app.listen(PORT, () => { console.log('App running at port', PORT) });
}

const cluster = require('cluster');
const { cpus } = require('os');

const maxProcessors = cpus().length;
let child = 0;
if (cluster.isPrimary) {
  for (let index = 0; index < maxProcessors; index++) {
    console.log('New process created', index)
    cluster.fork()
  }
  cluster.on('message', worker => {
    console.log('Message received on worker', worker.pid);
  })
} else {
  console.log('Child process detected', child++, process.pid)
  startApp()
}

