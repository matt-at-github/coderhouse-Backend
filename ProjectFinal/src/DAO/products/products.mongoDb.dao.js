const ProductModel = require('../../models/products.model.js');

class ProductsMongoDBDAO {

  async getProducts(req) {//,queryFilter = {}, queryLimit = 10, queryPage = 1, querySort = { id: 1 }) {
    console.log('products.mongo.dao', 'getProducts');
    try {

      const queryFilter = req.query.filter ? JSON.parse(req.query.filter) : undefined;
      const querySort = req.query.sort ? JSON.parse(req.query.sort) : undefined;
      const queryLimit = parseInt(req.query.limit) || 10;
      const queryPage = parseInt(req.query.page) || 1;

      const { docs, totalDocs, limit, page, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage, pagingCounter } = await ProductModel.paginate(queryFilter, { limit: queryLimit, page: queryPage, sort: querySort });

      const products = docs.map(m => {
        return m.toObject();
      });

      return {
        success: products.length > 0,
        totalDocs,
        page,
        totalPages,
        limit,
        hasNextPage,
        nextPage,
        hasPrevPage,
        prevPage,
        pagingCounter,
        payload: products
      };

    } catch (error) {
      return console.error(`Product Service error -> ${error}`);
    }
  }

  async getProductsByID(productsId) {
    // console.log('products.mongo.dao', 'getProductsbyID', 'productsId', productsId);
    try {
      const products = await ProductModel.find({ _id: { $in: productsId } });
      return products;
    } catch (error) {
      throw new Error('Error at getting product', error);
    }
  }

  async getProductByID(req) {
    console.log('products.mongo.dao', 'getProductsbyID');
    try {
      const product = await ProductModel.findOne({ _id: req.params.pid });
      return product;
    } catch (error) {
      throw new Error('Error at getting product', error);
    }
  }

  async createProduct(req) {
    console.log('products.mongo.dao', 'createProduct');
    try {

      const product = await ProductModel.find({ code: req.body.code });
      if (product) {
        return { code: 401, message: 'Product already exists', success: false };
      }

      const result = await (new ProductModel(req.body)).save();
      if (!result) {
        return { code: 400, message: result.message, success: false };
      }

      return product;
    } catch (error) {
      throw new Error('Error at creating product', error);
      // return { code: 500, message: error.message || 'Internal Server Error', success: false };
    }
  }

  async batchUpdateProductsStock(productsToUpdate) {
    console.log('products.mongo.dao', 'batchUpdateProductsStock');
    const updatedProducts = [];
    try {
      productsToUpdate.forEach(async (product) => {
        console.log('products.mongo.dao', 'batchUpdateProductsStock', 'product', product);
        updatedProducts.push(await ProductModel.findByIdAndUpdate(product._id, { stock: product.newStock }, { new: true }));
      });
      return updatedProducts;
    } catch (error) {
      throw new Error('Error at updating product', error);
    }
  }

  async editProduct(req) {
    console.log('products.mongo.dao', 'editProduct');
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
      return updatedProduct;
    } catch (error) {
      throw new Error('Error at updating product', error);
    }
  }

  async deleteProduct(req) {
    console.log('products.mongo.dao', 'deleteProduct');
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);
      return deletedProduct;
    } catch (error) {
      throw new Error('Error at deleting product', error);
    }
  }
}

module.exports = ProductsMongoDBDAO;