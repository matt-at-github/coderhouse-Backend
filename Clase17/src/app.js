const express = require('express')
const app = express();
const PUERTO = 8080;

const handlebars = require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views')

require('./database.js');

const orderModel = require('./models/orders.model.js')

app.get('/', async (req, res) => {

  const page = req.query.page || 1;
  const limit = 2;

  try {
    const ordernesQuery = await orderModel.paginate({}, { limit, page })

    const ordenes = ordernesQuery.docs.map(m => {
      return {
        nombre: m.nombre,
        tam: m.tam,
        precio: m.precio,
        cantidad: m.cantidad
      }
    });
    
    res.status(200).render('pizzas', { ordenes });
  } catch (error) {
    console.error(`error => ${error}`);
    res.status(500).send(`Internal server error => ${error}`)
  }
})

app.listen(PUERTO, () => { console.log(`Server up at port ${PUERTO}`) })