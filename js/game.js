let canvas;
let ctx;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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
