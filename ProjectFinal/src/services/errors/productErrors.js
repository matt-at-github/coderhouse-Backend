function productCreateValidationError(product) {
  return `Faltó un campo obligatorio para poder crear el producto. 
  Recibimos esto:
    - code:  ${product.code}.
    - title: ${product.title}.
    - description: ${product.description}.
    - price: ${product.price}.
    - thumbnails: ${product.thumbnails}.
    - stock: ${product.stock}.
    - status: ${product.status}.
    Fijate que ninguno diga undefined.
  `;
}

module.exports = { productCreateValidationError };