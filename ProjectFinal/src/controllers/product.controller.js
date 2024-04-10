const ProductsMongoDBDAO = require('../DAO/products/products.mongoDb.dao.js');
const productDAO = new ProductsMongoDBDAO();

const { jwtConfig } = require('../config/config.js');

class ProductController {

  async getProducts(req, res) {
    try {
      const data = await getProductData(req);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }

  async renderProducts(req, res) {
    try {
      if (!req.cookies[jwtConfig.tokenName]) { return res.redirect('users/login'); }
      console.log('product.controller', 'res.locals.user', res.locals.user);
      const data = await getProductData(req);
      return res.render('products', data);
    } catch (error) {
      return res.status(500).render('error', { error: 'Internal Server Error', message: error.message });
    }
  }

  async getProductByID(req, res) {
    try {
      const data = await getProductDataByID(req);
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

  async createProduct(req, res) {
    try {

      const validation = runBodyValidations(req.body);
      if (!validation.success) {
        return res.status(validation.code).json({ message: validation.message });
      }

      const result = await productDAO.createProduct(req);
      if (!result) {
        return res.status(400).json({ message: result.message });
      }
      return res.status(200).json({ data: result });
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
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

module.exports = ProductController;

// Auxliary methods
async function getProductDataByID(req) {
  try {
    const product = await productDAO.getProductByID(req);
    if (!product) {
      throw new Error('No product found.');
    }
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
      session: req.session
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