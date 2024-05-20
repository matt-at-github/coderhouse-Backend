const { mongoConnectionConfig } = require('../config/config.js');
const mongoose = require('mongoose');
mongoose.connect(mongoConnectionConfig.url);

const supertest = require('supertest');
const mocha = require('mocha');
const { expect } = require('chai');

const describe = mocha.describe;
const it = mocha.it;

const requester = supertest('http://localhost:8080');

describe('Session testing', function () {

  it('Recibir un array al pedir todos los productos', async function () {

    const response = await requester.get('/api/products');
    expect(Array.isArray(response._body.products)).to.be.true;
  });

  it('Obtener los detalles del producto al pedirlo', async function () {

    const response = await requester.get('/api/products/65d37daf9e1fc34968b99133');
    expect(response._body).to.have.property('title');
    expect(response._body).to.have.property('description');
    expect(response._body).to.have.property('price');
    expect(response._body).to.have.property('code');
    expect(response._body).to.have.property('stock');
  });

  it('Crear nuevo producto', async function () {

    const newProduct = {
      code: 'testprod',
      title: 'producto prueba',
      description: 'Esto es una prueba',
      price: 12,
      stock: 100,
      status: true
    };
    const response = await requester.post('/api/products').send(newProduct);

    const prod = response._body.data;

    expect(prod).to.have.property('title');
    expect(prod).to.have.property('description');
    expect(prod).to.have.property('price');
    expect(prod).to.have.property('code');
    expect(prod).to.have.property('stock');
    expect(prod).to.have.property('status');
  });

});