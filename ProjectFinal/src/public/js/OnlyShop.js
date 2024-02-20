function addUrlParameter(name, value) {
  let searchParams = new URLSearchParams(window.location.search);
  searchParams.set(name, value);
  window.location.search = searchParams.toString();
}
