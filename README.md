# Introducción
Querido tutor, creo que para poder testear esto hace falta un buen tutorial, así que acá voy:

# Endpoints de Productos
## GET
  `{{base_url}}/api/products` 
  - query.parameters:
    - sort    {"id":-1}: parseable JSON
    - filter  {"id":-1}: parseable JSON
    - limit   3: Number
    - page    3: Number

  Obtiene todos los productos que cumplan con el filtro.
---
  `{{base_url}}/api/products/:pid`
  - No hay *query.paremeters* para este endpoint.
  - pid: Number

  Obtiene el produco del identificador envíado.
---
  `{{base_url}}/api/products/:pid/delete`
  - No hay *query.paremeters* para este endpoint.
  - pid: Number

  Elimina el producto del identificador envíado.
## POST
  `{{base_url}}/api/products`
  - No hay *query.paremeters* para este endpoint.
  
  - Body esperado:
    `{
      "id": *automatic*
      "title": String
      "description": String
      "price": Schema.Types.Decimal128
      "code": String 
      "stock": Number
      "status": Boolean | *optional*
    }`

  Crea un producto con las propiedades envíadas.
## PUT
  `{{base_url}}/api/products/:pid`
  - No hay *query.paremeters* para este endpoint.
  - pid: Number
  - Body esperado: Cualquiera de las propiedades del POST.

  Actualiza caulquiera de las propiedades del producto encontrado por su ID.

# Endpoint de Carts
## GET
  `{{base_url}}/api/carts`
  - No hay *query.paremeters* para este endpoint.

  Obtiene todos los carritos existentes.

  `{{base_url}}/api/carts/:cid`
  - query.parameters:
    - cid: Number

  Obtiene el carrito por ID.
## POST
  `{{base_url}}/api/carts`
  - No hay *query.paremeters* para este endpoint.
  - Body esperado: `{"productId": Schema.Types.ObjectId }`
  
  Crea un carrito y le asigna el producto envíado por el body.

  `{{base_url}}/api/carts/:cid/product/:pid`
  - query.parameters:
    - cid: Number
    - pid: mongoose.Schema.Types.ObjectId

  Agrega el producto envíado, sumando cantidad en 1.
## PUT
  `{{base_url}}/api/carts/:cid`
  - query.parameters:
    - cid: Number
  - Body esperado: `[{"producto": Schema.Types.ObjectId, "cantidad": Number }]`

  Sobre escribe el contenido del carrito con lo envíado en el body.

  `{{base_url}}/api/carts/:cid/products/:pid`
  - query.parameters:
    - cid: Number
    - pid: mongoose.Schema.Types.ObjectId
  - Body esperado: `{"cantidad": Number }`

  Agrega la cantidad indicada en el body del producto enviado por su id, al carrito indicado por su id
## DELETE
  `{{base_url}}/api/carts/:cid`
  - query.parameters:
    - cid: Number

  Vacía el contenido del carrito.
  
  `{{base_url}}/api/carts/:cid/product/:pid`
  - query.parameters:
    - cid: Number
    - pid: mongoose.Schema.Types.ObjectId

  Remueve el item del carrito en la totalidad de su cantidad.