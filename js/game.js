let canvas;
let ctx;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  let canvasElement = document.getElementById("canvas");
  canvasElement.addEventListener("click", function (event) {
    const rect = canvasElement.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;

    if (
      x >= canvasElement.width - 200 &&
      x <= canvasElement.width - 10 &&
      y >= canvasElement.height - 60 &&
      y <= canvasElement.height - 20
    ) {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      ) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (canvasElement.requestFullscreen) {
          canvasElement.requestFullscreen();
        } else if (canvasElement.webkitRequestFullscreen) {
          canvasElement.webkitRequestFullscreen();
        } else if (canvasElement.msRequestFullscreen) {
          canvasElement.msRequestFullscreen();
        }
      }
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32) {
    keyboard.UP = true;
  }
  if (event.keyCode == 40 || event.keyCode == 83) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 13 || event.keyCode == 69) {
    keyboard.ENTER = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32) {
    keyboard.UP = false;
  }
  if (event.keyCode == 40 || event.keyCode == 83) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 13 || event.keyCode == 69) {
    keyboard.ENTER = false;
  }
});
