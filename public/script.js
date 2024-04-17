const socket = io();

const createButton = document.querySelector(".create");

createButton.addEventListener("click", () => {
  const name = document.querySelector(".name").value;

  if (name) {
    socket.emit("newRoom", name);
    createRoom(name);
    document.querySelector(".name").value = "";
  }
});

socket.on("newRoom", (name) => {
  createRoom(name);
});

const createRoom = (name) => {
  const div = document.createElement("div");
  div.textContent = name;
  const a = document.createElement("a");
  a.href = `/${name}`;
  a.innerText = "Join";
  div.appendChild(a);
  document.querySelector(".rooms").appendChild(div);
};

const aTags = document.querySelectorAll(".room");

// aTags.forEach((aTag) => {
//   aTag.addEventListener("click", (e) => {
//     const roomId = e.target.id;
//     const user = prompt("Enter your name");
//     socket.emit("joinUser", { roomId, user });
//   });
// });

// const sendName = (e) => {
//   const roomId = e.target.id;
//   const user = prompt("Enter your name");
//   socket.emit("joinUser", { roomId, user });
// };

socket.on("user-connected", (data) => {
  console.log(data);
});
