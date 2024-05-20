// eslint-disable-next-line no-undef
const socket = io();

function createProductNode(product) {

  const wrapper = document.getElementById('productWrapper');

  const child = document.getElementById('parent').cloneNode(true);
  child.getElementsByClassName('text-reset productLink')[0].href = `/api/products/${product._id}`;
  child.getElementsByClassName('card-title')[0].innerHTML = product.title;
  child.getElementsByClassName('card-text')[0].innerHTML = product.description;

  const user = window.locals.user;
  const button = child.querySelector('button');
  if (user.role === 'admin' || product.owner?.toString() === user.id) {
    button.classList.remove('d-none');
    child.querySelector('button').addEventListener('click', () => {
      socket.emit('deleteProduct', product._id);
    });
  } else {
    if (button) {
      button.classList.add('d-none');
    }
  }

  child.classList.remove('d-none');
  wrapper.appendChild(child);
}

socket.on('connectionResponse', (data) => {
  const wrapper = document.getElementById('productWrapper');
  wrapper.innerHTML = '';
  data.payload.forEach(product => {
    createProductNode(product);
  });
});

const abortUpdate = document.getElementById('abortUpdate');
abortUpdate.addEventListener('click', () => { });

const regiterNewProduct = document.getElementById('registerProduct');
regiterNewProduct.addEventListener('click', () => {
  const newProduct = getFieldsValues();
  if (newProduct) {
    socket.emit('regiterNewProduct', newProduct);
  } else {
    // eslint-disable-next-line no-undef
    Swal.fire({
      icon: 'error',
      title: 'Error de validación',
      text: 'Algun campo esta vacío.'
    });
  }
});

socket.on('regiterNewProductResponse', (response) => {
  // eslint-disable-next-line no-undef
  Swal.fire({
    icon: (response.success === true ? 'success' : 'error'),
    title: response.title,
    text: response.text
  });
  createProductNode(response.product);
});

socket.on('productDeleted', (response) => {
  // eslint-disable-next-line no-undef
  Swal.fire({
    icon: (response.success === true ? 'success' : 'error'),
    title: response.title,
    text: response.text
  });

  const wrapper = document.getElementById('productWrapper');
  wrapper.innerHTML = '';

  response.products.payload.forEach((product) => {
    createProductNode(product);
  });
});

// Auxiliary methods
function getFieldsValues() {
  const product = {
    code: document.getElementById('code').value,
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    thumbnails: [],
    stock: document.getElementById('stock').value,
    status: true,
    owner: window.locals.user.id
  };
  return Object.values(product).includes('') ? false : product;
}