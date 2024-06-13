// https://www.concentrationcode.com/handlebars-email/
const nodemailer = require('nodemailer');
const nodemailerHandlebars = require('nodemailer-express-handlebars');

const { nodemailConfig, domain } = require('../config/config.js');

class MailController {

  async #sendMailPromise(mailOptions) {
    return await new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, async (error, info) => {
        if (error) {
          reject({ error });
        }
        resolve({ status: info.response });
      });
    });
  }

  async sendProductDeletedNotificaiton(user, product) {
    try {
      const mailOptions = {
        from: 'Soporte OnlyShop <matias.soporte@professionals.com.ar>',
        to: user.email,
        subject: 'Eliminación de Producto',
        template: 'productDeleted',
        context: {
          title: 'Eliminación de Producto',
          name: user.name,
          body: 'Tu producto ' + '[' + product.code + '] ' + product.title + ' ha sido eliminado.',
        },
      };

      const info = await this.#sendMailPromise(mailOptions);
      // Any additional logic after email is sent 
      return { success: true, message: info };
    } catch (error) {
      // Handle error accordingly
      return { success: false, message: error };
    }
  }

  async sendAccountDeleteNotification(user) {
    try {

      const mailOptions = {
        from: 'Soporte OnlyShop <matias.soporte@professionals.com.ar>',
        to: user.email,
        subject: 'Eliminación de Cuenta',
        template: 'accountDeleted',
        context: {
          name: user.name,
          body: 'Tu cuenta ha sido borrada por inactividad prolongada',
        },
      };

      const info = await this.#sendMailPromise(mailOptions);
      // Any additional logic after email is sent
      return { success: true, message: info };
    } catch (error) {
      // Handle error accordingly
      return { success: false, message: error };
    }
  }

}

module.exports = MailController;

// Lo mismo que hizo el profe.
const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'matiasnicolasmoresi@gmail.com',
    pass: nodemailConfig.password
  }
});

// Ruta y Extensión de mis templates de handlebars.
transport.use('compile', nodemailerHandlebars({
  viewEngine: {
    extname: '.handlebars',
    layoutsDir: './src/public/views/layout/',
    defaultLayout: false,
    partialsDir: './src/public/views/partials/'
  },
  viewPath: './src/public/views/emails',
  extname: '.handlebars',
}));
