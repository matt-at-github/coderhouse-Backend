// const ProductModel = require('../models/products.model.js');
const ProductService = require('../services/products.service.js');

class ProductController {

  async getProducts(req) {

    try {
      const filter = req.query.filter ? JSON.parse(req.query.filter) : undefined;
      const sort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      const products = await ProductService.getProducts(filter, limit, page, sort);
      if (!products.success) {
        return { code: 400, message: products.message, success: false };
      }
      return { code: 200, data: products, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async getProductByID(id) {
    try {
      const products = await ProductService.findOne({ _id: id });
      return { code: 200, data: products, success: true };
    } catch (error) {
      return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async createProduct(req) {
    try {
      const products = await ProductService.find();
      const validation = runBodyValidations(req.body, products);
      if (!validation.success) {
        return { code: validation.code, message: validation.message, success: false };
      }

      const result = await (new ProductService(req.body)).save();
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
      const pid = req.params.pid;
      const updateProduct = await ProductService.findByIdAndUpdate(pid, req.body, { new: true });
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
      const pid = req.params.pid;
      const deleteProduct = await ProductService.findByIdAndDelete(pid);
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

function runBodyValidations(toValidate, products) {

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

  if (products.some(f => f.code === toValidate.code?.trim() ?? '')) {
    return { success: false, message: `Product code for '${toValidate.title}' is duplicated. Product was not added.`, code: 400 };
  }

  return { success: true };
}

