const { mongoConnectionConfig } = require('../config/config.js');
const mongoose = require('mongoose');
mongoose.connect(mongoConnectionConfig.url);

const supertest = require('supertest');
const mocha = require('mocha');
const { expect } = require('chai');

const describe = mocha.describe;
const it = mocha.it;

const requester = supertest('http://localhost:8080');

describe('Cart testing', function () {

  it('Al pedir carro por ID, recibir la colección de productos.', async function () {

    const response = await requester.get('/api/carts/65d5f0ff9eb37697d3bc39d7');
    const products = response._body.data.products;

    expect(Array.isArray(products)).to.be.true;
  });

  mocha.before(async function () {
    const response = await requester.post('/users/login').send({ email: 'matias@yopmail.com', password: '1234' });

    this.token = response.headers['set-cookie'][0];
  });

  it('Al agregar un producto al carrito.', async function () {

    const response = await requester
      .post('/api/carts/65d5f0ff9eb37697d3bc39d7/products/65d5ee231c053a4901f13ab0')
      .set('Cookie', `${this.token}`)
      ;

    expect(response.statusCode).to.be.equal(200);
  });

  it('Al limpiar el carrito.', async function () {

    const response = await requester
      .delete('/api/carts/65d5f0ff9eb37697d3bc39d7')
      ;

    expect(response.statusCode).to.be.equal(200);
  });
});