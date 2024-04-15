const generateInfoError = (user) => {
  return ` Los datos estan incompletos o no son válidos. 
  Necesitamos recibir los siguientes datos: 
  - Nombre: String, peero recibimos ${user.first_name}
  - Apellido: String, peeero recibimos ${user.last_name}
  - Email: String, recibimos ${user.email}
  `;
};

module.exports = { generateInfoError };