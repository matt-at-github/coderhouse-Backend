const ProductsMongoDBDAO = require('../DAO/products/products.mongoDb.dao.js');
const productDAO = new ProductsMongoDBDAO();

const CustomError = require('../services/errors/utils/errors.js');
const { EErrors } = require('../services/errors/utils/enums.js');
const { productCreateValidationError } = require('../services/errors/productErrors.js');

const { jwtConfig } = require('../config/config.js');
const { generateProduct } = require('./utils/generators.js');

class ProductController {

  mockProducts;
  paginatedProducts;
  constructor() {
    this.mockProducts = [];
    this.paginatedProducts = {};
  }

  renderMockedProducts(req, res) {
    //req.logger.debug('product.controller', 'renderMockedProducts');
    try {
      //req.logger.debug('product.controller', 'renderMockedProducts', 'products', this.mockProducts.length);
      if (this.mockProducts.length === 0) {
        let pagination = 1;
        // req.logger.debug('product.controller', 'renderMockedProducts', 'pagination', pagination);
        for (let index = 0; index < 100; index++) {
          const product = generateProduct();
          this.mockProducts.push(product);

          if (!this.paginatedProducts[pagination]) { this.paginatedProducts[pagination] = []; }
          this.paginatedProducts[pagination].push(product);
          if (this.paginatedProducts[pagination].length % 10 === 0) {
            // req.logger.debug('product.controller', 'renderMockedProducts', `this.paginatedProducts[${pagination}]`, this.paginatedProducts[pagination]?.map(m => m.title));
            pagination++;
          }
        }
        // req.logger.debug('product.controller', 'renderMockedProducts', 'products', this.mockProducts.length);
      }

      const page = parseInt(req.query.page ?? 1);
      const totalPages = this.mockProducts.length / 10;
      // req.logger.debug('product.controller', 'renderMockedProducts', 'page', page > 1, {

      //   hasNextPage: page < totalPages,
      //   nextPage: page < totalPages ? page + 1 : undefined,

      //   hasPrevPage: page > 1,
      //   prevPage: page > 1 ? page - 1 : undefined,

      //   pagingCounter: page
      // });

      const toRender = {
        products: this.paginatedProducts[page],
        totalDocs: this.mockProducts.length,
        page: page,
        totalPages,
        limit: 10,
        hasNextPage: page < totalPages,
        nextPage: page < totalPages ? page + 1 : undefined,
        hasPrevPage: page > 1,
        prevPage: page > 1 ? page - 1 : undefined,
        pagingCounter: page
      };
      res.render('products', toRender);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  async getProducts(req, res) {
    try {
      const data = await getProductData(req);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }

  async getRealTimeProducts() {
    try {
      const req = { query: { limit: 1000 } };
      return await productDAO.getProducts(req);
    } catch (error) {
      return { status: 500, error: 'Internal Server Error', message: error.message };
    }
  }

  async createRealtimeProduct(body) {
    try {
      
      const validation = runBodyValidations(body);
      
      if (!validation.success) {
        throw CustomError.createError({ code: EErrors.FIELD_MANDATORY, cause: 'Fallo en validación', message: productCreateValidationError(body) });
      }
      const result = await productDAO.createProduct({ body });
      if (!result) {
        return { message: result.message ?? result, status: 400 };
      }
      return { result, status: 200, success: true };
    } catch (error) {
      // req.logger.error({ code: 500, message: error.message || 'Internal Server Error', success: false });
      return ({ code: 500, message: error.message || 'Internal Server Error', success: false });
    }
  }

  async deleteRealtimeProduct(id) {
    try {
      
      const result = await productDAO.deleteProduct({ params: { pid: id } });
      if (!result) {
        return { message: result.message ?? result, status: 400, success: true };
      }
      return { result: result, status: 200, success: true, message: 'Producto borrado' };
    } catch (error) {
      // req.logger.error({ code: 500, message: error.message || 'Internal Server Error', success: false });
      return ({ code: 500, message: error.message || 'Internal Server Error', success: false });
    }
  }

  async renderProducts(req, res) {
    try {
      if (!req.cookies[jwtConfig.tokenName]) { return res.redirect('users/login'); }
      //req.logger.debug('product.controller', 'res.locals.user', res.locals.user);
      const data = await getProductData(req);
      return res.render('products', data);
    } catch (error) {
      return res.status(500).render('error', { error: 'Internal Server Error', message: error.message });
    }
  }

  async getProductByID(req, res) {
    try {
      const data = await getProductDataByID(req);
      if (!data) { return res.status(404).json({ message: 'Product not found.' }); }
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }

  async renderProductByID(req, res) {
    try {
      const data = await getProductDataByID(req);
      return res.render('product', data);
    } catch (error) {
      return res.status(500).render('error', { error: 'Internal Server Error', message: error.message });
    }
  }

  async createProduct(req, res, next) {
    try {
      //req.logger.debug('product.controller', 'createProduct', 'body', req.body);
      const validation = runBodyValidations(req.body);
      //req.logger.debug('product.controller', 'createProduct', 'validation', validation);
      if (!validation.success) {
        //req.logger.debug('product.controller', 'createProduct', 'creating custom error');
        throw CustomError.createError({ code: EErrors.FIELD_MANDATORY, cause: 'Fallo en validación', message: productCreateValidationError(req.body) });
        // return res.status(validation.code).json({ message: validation.message });
      }
      const result = await productDAO.createProduct(req);
      //req.logger.debug('product.controller', 'createProduct', 'result', result);
      if (!result) {
        return res.status(400).json({ message: result.message });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      req.logger.error({ code: 500, message: error.message || 'Internal Server Error', success: false });
      next(error);
    }
  }

  async editProduct(req, res) {
    try {
      const updateProduct = await ProductsMongoDBDAO.editProduct(req);
      if (!updateProduct) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      return res.status(200).json({ data: updateProduct });
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async deleteProduct(req, res) {
    try {

      const deleteProduct = await productDAO.deleteProduct(req);
      if (!deleteProduct) {
        return res.status(404).json({ message: 'Product not found.' });
      }
      return res.status(200).json({ data: deleteProduct });
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }
}

// Auxliary methods
async function getProductDataByID(req) {
  try {
    const product = await productDAO.getProductByID(req);
    return product;
  } catch (error) {
    throw new Error('Error getting product data: ' + error.message);
  }
}

async function getProductData(req) {
  try {
    const products = await productDAO.getProducts(req);
    if (!products.success) {
      throw new Error(products.message);
    }

    return {
      products: products.payload,
      totalDocs: products.totalDocs,
      page: products.page,
      totalPages: products.totalPages,
      limit: products.limit,
      hasNextPage: products.hasNextPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      prevPage: products.prevPage,
      pagingCounter: products.pagingCounter,
      // session: req.session
    };
  } catch (error) {
    throw new Error('Error getting product data: ' + error.message);
  }
}

function runBodyValidations(toValidate) {

  const validateFields = (toValidate) => {
    const { title, description, price, thumbnails, code, stock, status = true } = { ...toValidate };
    const emptyEntries = [];
    Object.entries({ title, description, price, thumbnails, code, stock, status })
      .forEach(([key, value]) => {
        if (key !== 'thumbnails') {
          if (value === null || value === undefined || value.toString()?.trim() === '') {
            emptyEntries.push(key);
          }
        }
      });
    return (emptyEntries);
  };

  const invalidField = validateFields(toValidate);
  if (invalidField.length > 0) {
    return { success: false, message: `Fields [${invalidField.join(', ')}] empty. All fields are mandatory. Product was not added.`, code: 400 };
  }

  return { success: true };
}

module.exports = ProductController;