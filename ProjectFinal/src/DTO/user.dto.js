class UserDTO {
  constructor(user) {
    console.log('user.dto', 'constructor', user);
    this.email = user.email;
    this.id = user._id;
    this.nombre = user.first_name;
    this.apellido = user.last_Name;
    this.role = user.role;
    this.cartId = user.cartId;
    this.login = true;
    this.userName = `${user.first_name} ${user.last_name}`;
  }
}

module.exports = UserDTO;