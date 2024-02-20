function isJsonString(str) {
  if (str === undefined) { return true; }
  try {
    var json = JSON.parse(str);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}

module.exports = { isJsonString };