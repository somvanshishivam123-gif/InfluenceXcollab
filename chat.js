const socket = io();

// 👇 temporary login (baad me real login lagaenge)
const userId = prompt("Enter your ID (e.g. influencer1 / brand1)");
const role = prompt("Enter role (influencer/brand)");
const otherUserId = prompt("Enter other user ID");

// 👇 same room dono side generate hoga
const roomId = [userId, otherUserId].sort().join("_");

socket.emit("join", { userId, role });
socket.emit("join_room", roomId);

function sendMessage() {
  const input = document.getElementById("message");
  const message = input.value;

  if (message.trim() === "") return;

  socket.emit("send_message", {
    roomId,
    message
  });

  input.value = "";
}

socket.on("receive_message", (data) => {
  const chatBox = document.getElementById("chat-box");

  const msg = document.createElement("p");
  msg.innerHTML = `<b>${data.sender}:</b> ${data.message}`;

  chatBox.appendChild(msg);
});