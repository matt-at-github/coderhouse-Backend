//Creamos una instancia de socket.io del lado del cliente ahora: 
// eslint-disable-next-line no-undef
const socket = io();

//Creamos una variable para guardar el usuario: 
const userBox = document.getElementById("idBox");
const chatBox = document.getElementById("chatBox");

// Cargamos el chat al salir del campo de identificación

userBox.addEventListener("blur", () => {
  if (userBox.value.trim().length > 0) {
    socket.emit("pullMessages", { user: userBox.value });
    userBox.style = "cursor: not-allowed; pointer-events: none; background-color: lightgrey;";
  }
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      //trim nos permite sacar los espacios en blanco del principio y del final de un string. 
      //Si el mensaje tiene más de 0 caracteres, lo enviamos al servidor. 
      socket.emit("message", { user: userBox.value, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

//Listener de Mensajes: 
socket.on("reply", (data) => {

  const messageBox = document.getElementById("messagesBox");

  const messages = [];
  data.forEach(element => {
    console.log(element.message);
    messages.push(`<div class="message message-right mx-3">
    <div class="message-text-wrapper">
      <div class="message-text">
        ${element.message}
      </div>  
      </div>
    </div>`);
  });

  messageBox.innerHTML = messages.join('');
});