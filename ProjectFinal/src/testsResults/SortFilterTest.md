# Postman Query

`{{base_url}}/api/products?sort={"price":-1}`
`{{base_url}}/api/products?sort={"price":1}`
---

# Postman Test script: 
  Con el objectivo de simplificar el resultado a la hora de leerlo.

```
pm.test("Show products code, title, stock and price", function () {
  const payload = pm.response.json().payload;
  req.logger.debug(payload.map(m => {
      return { code: m.code.substring(0,3), title: m.title.substring(0,10), stock: m.stock, price:m.price.$numberDecimal }
  }));
});
```

# Resultados
---
GET http://localhost:8080/api/products?sort={"price":-1}: {...}
[
   { code: 'GPU', title: 'Gigabyte A', stock: 5,  price: '470' },
  { code: 'GPU', title: 'Gigabyte N', stock: 10, price: '410' },
  { code: 'GPU', title: 'MSI Nvidia', stock: 7,  price: '350' },
  { code: 'PLP', title: 'Philips Hu', stock: 10, price: '350' },
  { code: 'PLP', title: 'Philips Hu', stock: 15, price: '260' },
  { code: 'TEC', title: 'LOGITECH G', stock: 10, price: '199' },
  { code: 'aur', title: 'Auriculres', stock: 12, price: '120' },
  { code: 'mou', title: 'Mouse Geni', stock: 50, price: '18' },
  { code: 'aur', title: 'Auriculare', stock: 12, price: '13' },
  { code: 'mic', title: 'Mic Rzer  ', stock: 24, price: '8' } 
]
  
En este caso pedí que me lo traiga de manera descendente, y así lo veo, el precio mas alto siendo el primero y llendo hacía abajo (por cuestiones de paginación no han salido todos los productos).

--- 
GET http://localhost:8080/api/products?sort={"price":1}: {...}
[
  { code: 'mic', title: 'Mic Asus  ', stock: 14, price: '5' },
  { code: 'mic', title: 'Mic Rzer  ', stock: 24, price: '8' },
  { code: 'aur', title: 'Auriculare', stock: 12, price: '13' },
  { code: 'mou', title: 'Mouse Geni', stock: 50, price: '18' },
  { code: 'aur', title: 'Auriculres', stock: 12, price: '120' },
  { code: 'TEC', title: 'LOGITECH G', stock: 10, price: '199' },
  { code: 'PLP', title: 'Philips Hu', stock: 15, price: '260' },
  { code: 'GPU', title: 'MSI Nvidia', stock: 7,  price: '350' },
  { code: 'PLP', title: 'Philips Hu', stock: 10, price: '350' },
  { code: 'GPU', title: 'Gigabyte N', stock: 10, price: '410' } 
]
Similiar al caso de arriba, solo que estas vez en ascendente, mismo resultado (mismo caso de paginación).

La basde de datos a la que te conectás para hacer las consultas es la mía u otra?
Cabe destacar que en mi esquema de productos, para el precio particularmente, estoy usando un tipo distinto a _Number_.Será eso lo que cause alguna diferencia?