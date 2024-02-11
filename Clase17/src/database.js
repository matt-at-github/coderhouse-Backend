const password = 'Cn9o0TqM4pQak0kx';
const databaseName = 'PizzaStore';
const uri = `mongodb+srv://matiasnicolasmoresi:${password}@cluster0.5jasxmm.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

const mongoose = require('mongoose');



const connect = async () => {
  mongoose.connect(uri)
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((error) => console.error(`Error: ${error}`));
}

const stages = async () => {
  const result = await orderModel.aggregate([
    { $match: { tam: 'familiar' } }, // stage1  | extraemos un sub grupo
    {
      $group: { // stage2 | agrupamos y sumamos las cantidades
        _id: '$nombre',
        total: { $sum: '$cantidad' } // los $ se usan para determinar que son propiedades del modelo.
      }
    },
    { $sort: { total: -1 } }, // stage3 | ordenamos
    {
      $group: {
        _id: 1,
        orders: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        '_id': 0,
        orders: '$orders'
      }
    },
    { $merge: { into: 'reports' } }
  ]);


  console.log(result);
}

const pagination = async () => {
  const result = await orderModel.paginate({ 'tam': 'familiar' }, { limit: 2, page: 2 });
  console.log(result)
}

connect();
// stages();
// pagination();
