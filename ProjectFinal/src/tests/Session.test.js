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

  it('Al iniciar sesión, debe retornar el token', async function () {

    const loginCredentials = { email: 'matiasnicolasmoresi@gmail.com', password: '1234' };
    const response = await requester.post('/users/login').send(loginCredentials);

    const cookieName = response.headers['set-cookie'][0].split('=')[0];
    expect(cookieName).to.be.equal('OnlyShopToken');
  });

  it('iniciar sesión con mail inválido', async function () {

    const loginCredentials = { email: 'matiasnicolasmoresi@gmail', password: '123' };
    const response = await requester.post('/users/login').send(loginCredentials);

    expect(response.status).to.be.equal(404);
  });

  it('iniciar sesión con contraseña inválido', async function () {

    const loginCredentials = { email: 'matiasnicolasmoresi@gmail.com', password: '123' };
    const response = await requester.post('/users/login').send(loginCredentials);

    expect(response.status).to.be.equal(404);
  });
});