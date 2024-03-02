// eslint-disable-next-line no-unused-vars
function spinner(elementName, isButton) {

  const button = document.getElementById(elementName);
  if (isButton) {
    button.setAttribute('disabled', '');
  }

  button.classList.add('disabled');

  // Create the loader div
  var loaderDiv = document.createElement('div');
  loaderDiv.className = 'loader';
  loaderDiv.style.display = 'block';

  // Create the loading div
  var loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';

  // Append the loading div to the loader div
  loaderDiv.appendChild(loadingDiv);

  // Append the loader div to the button
  button.innerText = elementName === 'registerBtn' ? 'Creando cuenta...' : 'Ingresando...';
  button.appendChild(loaderDiv);
}
