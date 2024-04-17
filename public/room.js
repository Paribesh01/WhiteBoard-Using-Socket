const socket = io();
var canvas;
var context;

window.addEventListener("load", () => {
  // let isClean = true;
  let name = document.querySelector(".name");
  if (name.innerText == "Name") {
    const currentURL = window.location.href;
    const lastPart = currentURL.split("/").pop();
    console.log(lastPart);
    let user;

    while (!user) {
      user = prompt("Enter your name");
    }
    name.innerText = user;
    socket.emit("joinUser", { roomId: lastPart, user });
    canvas = document.getElementById("mycanvas");
    context = canvas.getContext("2d");
    canvas.width = 780;
    canvas.height = 490;
    context.strokeStyle = "#913d88";
    context.lineWidth = 2;

    canvas.onmousedown = startDrawing;
    canvas.onmouseup = stopDrawing;
    canvas.onmousemove = draw;

    document.querySelector(".clear").addEventListener("click", () => {
      const currentURL = window.location.href;
      const lastPart = currentURL.split("/").pop();

      clearCanvas();
      socket.emit("clear", { roomId: lastPart });
    });

    //socket

    socket.on("move", (data) => {
      // if (isClean) {
      // clearCanvas();
      // isClean = false;
      // }
      context.moveTo(data.x, data.y);
    });
    socket.on("draw", (data) => {
      // isClean = false;
      context.lineTo(data.x, data.y);
      context.stroke();
    });
    socket.on("clear", () => {
      clearCanvas();
    });

    function startDrawing(e) {
      // if (isClean) {
      //   clearCanvas();
      //   // isClean = false;
      // }

      isDrawing = true;

      context.beginPath();
      context.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
      const currentURL = window.location.href;
      const lastPart = currentURL.split("/").pop();

      socket.emit("move", {
        roomId: lastPart,
        x: e.pageX - canvas.offsetLeft,
        y: e.pageY - canvas.offsetTop,
      });
    }

    function draw(e) {
      if (isDrawing == true) {
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;

        const currentURL = window.location.href;
        const lastPart = currentURL.split("/").pop();

        context.lineTo(x, y);
        context.stroke();
        isCleared = false;
        socket.emit("draw", {
          roomId: lastPart,
          x: e.pageX - canvas.offsetLeft,
          y: e.pageY - canvas.offsetTop,
        });
      }
    }

    function stopDrawing() {
      isDrawing = false;
    }
    function clearCanvas() {
      // isClean = true;
      context.fillStyle = "white";
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
    }
  }
});
