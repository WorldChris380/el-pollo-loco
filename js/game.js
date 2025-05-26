/**
 * Main game logic for El Pollo Loco.
 * Initializes the canvas, world, controls, and audio.
 * Includes functions for start, sound, fullscreen, touch and click events, as well as keyboard handling.
 * Stores the sound status in Local Storage.
 * @module game
 */

let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let soundOn = true;
if (localStorage.getItem('soundOn') !== null) {
  soundOn = localStorage.getItem('soundOn') === 'true';
}
let gameAudio = new Audio("audio/game-sound.wav");
gameAudio.loop = true;

/**
 * Initializes the game and shows the start screen.
 */
window.onload = function () {
  document.getElementById("startscreen").style.display = "flex";
  document.getElementById("canvas").style.display = "none";
  document.getElementById("startgame-btn")
    .addEventListener("click", function () {
      document.getElementById("startscreen").style.display = "none";
      document.getElementById("canvas").style.display = "block";
      init();
    });
};

/**
 * Initializes the game, world, fullscreen, sub buttons, and mobile controls.
 */
function init() {
  gameAudio.currentTime = 0;
  if (soundOn) gameAudio.play();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  let canvasElement = document.getElementById("canvas");
  addFullscreenClick(canvasElement);
  mouseOverForFullscreen(canvasElement);
  addSubButtonClicks(canvasElement);
  setupMobileCanvasControls(canvas);
}

/**
 * Binds touch events for mobile controls to the canvas.
 * @param {HTMLCanvasElement} canvas
 */
function setupMobileCanvasControls(canvas) {
  if (!isMobile()) return;
  canvas.addEventListener("touchstart", handleTouch, {passive: false});
  canvas.addEventListener("touchend", handleTouchEnd, {passive: false});
}

/**
 * Binds a click event for the fullscreen button.
 * @param {HTMLCanvasElement} canvasElement
 */
function addFullscreenClick(canvasElement) {
  canvasElement.addEventListener("click", function (event) {
    const { x, y } = getCanvasCoordinates(event, canvasElement);
    if (isFullscreenButton(x, y, canvasElement)) {
      toggleFullscreen(canvasElement);
    }
  });
}

/**
 * Calculates the canvas coordinates from an event.
 * @param {MouseEvent|TouchEvent} event
 * @param {HTMLCanvasElement} canvasElement
 * @returns {{x: number, y: number}}
 */
function getCanvasCoordinates(event, canvasElement) {
  const rect = canvasElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;
  return { x, y };
}

/**
 * Checks if the coordinates are on the fullscreen button.
 * @param {number} x
 * @param {number} y
 * @param {HTMLCanvasElement} canvasElement
 * @returns {boolean}
 */
function isFullscreenButton(x, y, canvasElement) {
  return (
    x >= canvasElement.width - 190 &&
    x <= canvasElement.width - 10 &&
    y >= canvasElement.height - 60 &&
    y <= canvasElement.height - 20
  );
}

/**
 * Toggles fullscreen mode for the canvas.
 * @param {HTMLCanvasElement} canvasElement
 */
function toggleFullscreen(canvasElement) {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  } else {
    if (canvasElement.requestFullscreen) canvasElement.requestFullscreen();
    else if (canvasElement.webkitRequestFullscreen) canvasElement.webkitRequestFullscreen();
    else if (canvasElement.msRequestFullscreen) canvasElement.msRequestFullscreen();
  }
}

/**
 * Changes the mouse cursor when hovering over the fullscreen button.
 * @param {HTMLCanvasElement} canvasElement
 */
function mouseOverForFullscreen(canvasElement) {
  canvasElement.addEventListener("mousemove", function (event) {
    const rect = canvasElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;
    if (
      x >= canvasElement.width - 190 &&
      x <= canvasElement.width - 10 &&
      y >= canvasElement.height - 60 &&
      y <= canvasElement.height - 20
    ) {
      canvasElement.style.cursor = "pointer";
    } else {
      canvasElement.style.cursor = "default";
    }
  });
}

/**
 * Binds click events for sub buttons, tutorial, and restart to the canvas.
 * @param {HTMLCanvasElement} canvasElement
 */
function addSubButtonClicks(canvasElement) {
  canvasElement.addEventListener("click", function (event) {
    const rect = canvasElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;
    if (checkTutorialClose(x, y)) return;
    if (checkRestartButton(x, y)) return;
    if (!world || !world.subButtonAreas) return;
    world.subButtonAreas.forEach((btn) => handleSubButton(btn, x, y, canvasElement));
  });
}

/**
 * Checks and closes the tutorial if the button was hit.
 * @private
 */
function checkTutorialClose(x, y) {
  if (world && world.showTutorial && world.tutorialCloseButton) {
    const btn = world.tutorialCloseButton;
    if (x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
      world.showTutorial = false;
      return true;
    }
  }
  return false;
}

/**
 * Checks and restarts the game if the restart button was hit.
 * @private
 */
function checkRestartButton(x, y) {
  if (world && world.restartButtonArea && world.character.energy === 0) {
    const btn = world.restartButtonArea;
    if (x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
      restartGame();
      return true;
    }
  }
  return false;
}

/**
 * Handles sub buttons (tutorial, legal, sound, fullscreen).
 * @private
 */
function handleSubButton(btn, x, y, canvasElement) {
  if (x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
    if (btn.key === "tutorial") world.showTutorial = true;
    if (btn.key === "legal") window.open("datenschutz.html", "_blank");
    if (btn.key === "sound") {
      soundOn = !soundOn;
      handleSoundToggle();
    }
    if (btn.key === "fullscreen") toggleFullscreen(canvasElement);
  }
}

/**
 * Toggles sound on/off and saves the status in Local Storage.
 */
function handleSoundToggle() {
  localStorage.setItem('soundOn', soundOn);
  if (!soundOn) {
    gameAudio.pause();
    if (window.walkAudio) walkAudio.pause();
    if (window.jumpAudio) jumpAudio.pause();
    if (window.hurtAudio) hurtAudio.pause();
    if (window.endbossWalkAudio) endbossWalkAudio.pause();
    if (window.coinAudio) coinAudio.pause();
    if (window.bottleBreakAudio) bottleBreakAudio.pause();
    if (window.gameOverAudio) gameOverAudio.pause();
  } else {
    gameAudio.currentTime = 0;
    gameAudio.play();
  }
}

/**
 * Checks if the game is running on a mobile device.
 * @returns {boolean}
 */
function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

/**
 * Restarts the game after Game Over.
 */
function restartGame() {
  gameAudio.currentTime = 0;
  if (soundOn) gameAudio.play();
  world = null;
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

/**
 * Keyboard event: key pressed.
 */
window.addEventListener("keydown", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) keyboard.RIGHT = true;
  if (event.keyCode == 37 || event.keyCode == 65) keyboard.LEFT = true;
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32) keyboard.UP = true;
  if (event.keyCode == 40 || event.keyCode == 83) keyboard.DOWN = true;
  if (event.keyCode == 13 || event.keyCode == 69) keyboard.ENTER = true;
});

/**
 * Keyboard event: key released.
 */
window.addEventListener("keyup", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) keyboard.RIGHT = false;
  if (event.keyCode == 37 || event.keyCode == 65) keyboard.LEFT = false;
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32) keyboard.UP = false;
  if (event.keyCode == 40 || event.keyCode == 83) keyboard.DOWN = false;
  if (event.keyCode == 13 || event.keyCode == 69) keyboard.ENTER = false;
});

/**
 * Handles touch events for mobile controls, sub buttons, tutorial, and restart.
 * @param {TouchEvent} e
 */
function handleTouch(e) {
  if (e.cancelable) e.preventDefault();
  if (!world || !world.mobileButtons) return;
  for (let touch of e.touches) {
    const rect = canvas.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
    if (handleMobileButtons(x, y)) return;
    if (checkTutorialClose(x, y)) return;
    if (handleSubButtonsTouch(x, y)) return;
    if (checkRestartButton(x, y)) return;
    if (typeof isFullscreenButton === "function" && isFullscreenButton(x, y, canvas)) {
      toggleFullscreen(canvas);
      return;
    }
  }
}

/**
 * Checks mobile control buttons on touch.
 * @private
 */
function handleMobileButtons(x, y) {
  let hit = false;
  world.mobileButtons.forEach((btn) => {
    if (
      x >= btn.x &&
      x <= btn.x + btn.w &&
      y >= btn.y &&
      y <= btn.y + btn.h
    ) {
      world.pressedButtons[btn.key] = true;
      keyboard[btn.key] = true;
      hit = true;
    }
  });
  return hit;
}

/**
 * Checks sub buttons on touch.
 * @private
 */
function handleSubButtonsTouch(x, y) {
  if (world.subButtonAreas) {
    for (const btn of world.subButtonAreas) {
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        if (btn.key === "tutorial") world.showTutorial = true;
        if (btn.key === "legal") window.open("datenschutz.html", "_blank");
        if (btn.key === "sound") {
          soundOn = !soundOn;
          handleSoundToggle();
        }
        if (btn.key === "fullscreen") toggleFullscreen(canvas);
        return true;
      }
    }
  }
  return false;
}
