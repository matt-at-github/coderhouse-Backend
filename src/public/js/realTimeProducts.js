// eslint-disable-next-line no-undef
const socket = io();

function createProductNode(product) {

  const wrapper = document.getElementById('productWrapper');

  const child = document.getElementById('parent').cloneNode(true);
  // child.
  child.getElementsByClassName('text-reset productLink')[1].href = `/api/products/${product.id}`;
  child.getElementsByClassName('card-title')[0].innerHTML = product.title;
  child.getElementsByClassName('card-text')[0].innerHTML = product.description;

  const deleteButton = document.getElementById('deleteProduct');
  deleteButton.addEventListener('click', () => {
    console.log('deleteProduct', product.id);
    socket.emit('deleteProduct', product.id);
  });
  console.log(deleteButton);

  child.classList.remove('d-none');
  wrapper.appendChild(child);
}

socket.on('connectionResponse', (data) => {
  data.message.forEach(product => {
    createProductNode(product);
  });
});

const abortUpdate = document.getElementById('abortUpdate');
abortUpdate.addEventListener("click", () => { console.log('update aborted'); });

const regiterNewProduct = document.getElementById("registerProduct");
regiterNewProduct.addEventListener("click", () => {
  const newProduct = getFieldsValues();
  if (newProduct) {
    socket.emit('regiterNewProduct', newProduct);
  } else {
    // eslint-disable-next-line no-undef
    Swal.fire({
      icon: "error",
      title: "Error de validación",
      text: "Algun campo esta vacío."
    });
  }
});

socket.on('regiterNewProductResponse', (response) => {
  // eslint-disable-next-line no-undef
  Swal.fire({
    icon: (response.success === true ? "success" : "error"),
    title: response.title,
    text: response.text
  });
  createProductNode(response.product);
});

// Auxiliary methods
function getFieldsValues() {
  const product = {
    code: document.getElementById("code").value,
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnails: [],
    stock: document.getElementById("stock").value,
    status: true,
  };
  return Object.values(product).includes("") ? false : product;
}