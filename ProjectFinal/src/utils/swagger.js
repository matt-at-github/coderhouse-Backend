const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion de la App Adoptame',
      description: 'App dedicada a encontrar familias para los perritos de la calle'
    }
  },
  apis: ['./src/docs/**/*.yaml']
};

function initSwagger() {
  const specs = swaggerJSDoc(swaggerOptions);
  return { serve: swaggerUiExpress.serve, setup: swaggerUiExpress.setup(specs) };
}

module.exports = { initSwagger };