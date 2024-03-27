const { responseDialog } = require('../utils/response.js');

const ProductsMongoDBDAO = require('../DAO/products/products.mongoDb.dao.js');
const productDAO = new ProductsMongoDBDAO();

class ProductController {

  async getProducts(req, res) {
    console.log('product.controller', 'getProducts');
    try {
      if (!req.session.login) { return res.redirect('/sessions/login'); }

      const products = await productDAO.getProducts(req);
      if (!products.success) {
        return responseDialog(res, 400, products.message);
      }

      return res.render('products', {
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
        session: req.session
      });

    } catch (error) {
      return responseDialog(res, 500, 'Product Controller error', error);
    }
  }

  async getProductByID(req, res) {
    try {

      const product = await productDAO.getProductByID(req);
      if (!product) {
        return responseDialog(res, 400, product.message);
      }

      return res.render('product', {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        session: req.session
      });

    } catch (error) {
      return responseDialog(res, 500, 'Product Controller error', error);
    }
  }

  async createProduct(req) {
    try {

      const validation = runBodyValidations(req.body);
      if (!validation.success) {
        return { code: validation.code, message: validation.message, success: false };
      }

      const result = await productDAO.createProduct(req);
      if (!result) {
        return { code: 400, message: result.message, success: false };
      }

      return { code: 200, data: result, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async editProduct(req) {
    try {
      const updateProduct = await ProductsMongoDBDAO.editProduct(req);
      if (!updateProduct) {
        return { code: 404, message: 'Product not found.', success: false };
      }

      return { code: 200, data: updateProduct, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async deleteProduct(req) {
    try {

      const deleteProduct = await productDAO.deleteProduct(req);
      if (!deleteProduct) {
        return { code: 404, message: 'Product not found.', success: false };
      }
      return { code: 200, data: deleteProduct, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }
}

module.exports = ProductController;

// Auxliary methods
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