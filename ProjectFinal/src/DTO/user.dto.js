class UserDTO {
  constructor(user) {
    console.log('user.dto', 'ctor', user);
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