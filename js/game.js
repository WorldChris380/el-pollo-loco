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
if (localStorage.getItem("soundOn") !== null) {
  soundOn = localStorage.getItem("soundOn") === "true";
}
let gameAudio = new Audio("audio/game-sound.wav");
gameAudio.loop = true;
let startButtonArea = null;
let startSubButtonAreas = [];
let showStartButton = true;

/**
 * Initializes the game and shows the start screen.
 * Called on window load.
 */
window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  document.getElementById("startscreen").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  showStartButton = true;
  drawStartScreen();
  canvas.addEventListener("click", handleCanvasClick);
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
 * @param {HTMLCanvasElement} canvas - The canvas element.
 */
function setupMobileCanvasControls(canvas) {
  if (!isMobile()) return;
  canvas.addEventListener("touchstart", handleTouch, { passive: false });
  canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
}

/**
 * Binds a click event for the fullscreen button.
 * @param {HTMLCanvasElement} canvasElement - The canvas element.
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
 * @param {MouseEvent|TouchEvent} event - The event object.
 * @param {HTMLCanvasElement} canvasElement - The canvas element.
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
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {HTMLCanvasElement} canvasElement - The canvas element.
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
 * @param {HTMLCanvasElement} canvasElement - The canvas element.
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
    else if (canvasElement.webkitRequestFullscreen)
      canvasElement.webkitRequestFullscreen();
    else if (canvasElement.msRequestFullscreen)
      canvasElement.msRequestFullscreen();
  }
}

/**
 * Changes the mouse cursor when hovering over the fullscreen button.
 * @param {HTMLCanvasElement} canvasElement - The canvas element.
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
 * @param {HTMLCanvasElement} canvasElement - The canvas element.
 */
function addSubButtonClicks(canvasElement) {
  canvasElement.addEventListener("click", function (event) {
    const rect = canvasElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;
    if (checkTutorialClose(x, y)) return;
    if (checkRestartButton(x, y)) return;
    if (!world || !world.subButtonAreas) return;
    world.subButtonAreas.forEach((btn) =>
      handleSubButton(btn, x, y, canvasElement)
    );
  });
}

/**
 * Checks and closes the tutorial if the button was hit.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean}
 * @private
 */
function checkTutorialClose(x, y) {
  if (world && world.showTutorial && world.tutorialCloseButton) {
    const btn = world.tutorialCloseButton;
    if (
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    ) {
      world.showTutorial = false;
      return true;
    }
  }
  return false;
}

/**
 * Checks and restarts the game if the restart button was hit.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean}
 * @private
 */
function checkRestartButton(x, y) {
  if (world && world.restartButtonArea && world.character.energy === 0) {
    const btn = world.restartButtonArea;
    if (
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    ) {
      restartGame();
      return true;
    }
  }
  return false;
}

/**
 * Handles sub buttons (tutorial, legal, sound, fullscreen).
 * @param {Object} btn - The button object.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {HTMLCanvasElement} canvasElement - The canvas element.
 * @private
 */
function handleSubButton(btn, x, y, canvasElement) {
  if (
    x >= btn.x &&
    x <= btn.x + btn.width &&
    y >= btn.y &&
    y <= btn.y + btn.height
  ) {
    if (btn.key === "tutorial") world.showTutorial = true;
    if (btn.key === "legal") window.location.href = "datenschutz.html";
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
  localStorage.setItem("soundOn", soundOn);
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
 * @param {KeyboardEvent} event
 */
window.addEventListener("keydown", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) keyboard.RIGHT = true;
  if (event.keyCode == 37 || event.keyCode == 65) keyboard.LEFT = true;
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32)
    keyboard.UP = true;
  if (event.keyCode == 40 || event.keyCode == 83) keyboard.DOWN = true;
  if (event.keyCode == 13 || event.keyCode == 69) keyboard.ENTER = true;
});

/**
 * Keyboard event: key released.
 * @param {KeyboardEvent} event
 */
window.addEventListener("keyup", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) keyboard.RIGHT = false;
  if (event.keyCode == 37 || event.keyCode == 65) keyboard.LEFT = false;
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32)
    keyboard.UP = false;
  if (event.keyCode == 40 || event.keyCode == 83) keyboard.DOWN = false;
  if (event.keyCode == 13 || event.keyCode == 69) keyboard.ENTER = false;
});

/**
 * Handles touch events for mobile controls, sub buttons, tutorial, and restart.
 * @param {TouchEvent} e - The touch event.
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
    if (
      typeof isFullscreenButton === "function" &&
      isFullscreenButton(x, y, canvas)
    ) {
      toggleFullscreen(canvas);
      return;
    }
  }
}

/**
 * Handles the end of a touch event for mobile controls.
 * @param {TouchEvent} e - The touch event.
 */
function handleTouchEnd(e) {
  if (!world || !world.mobileButtons) return;
  world.mobileButtons.forEach((btn) => {
    world.pressedButtons[btn.key] = false;
    keyboard[btn.key] = false;
  });
}

/**
 * Checks mobile control buttons on touch.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean}
 * @private
 */
function handleMobileButtons(x, y) {
  let hit = false;
  world.mobileButtons.forEach((btn) => {
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      world.pressedButtons[btn.key] = true;
      keyboard[btn.key] = true;
      hit = true;
    }
  });
  return hit;
}

/**
 * Checks sub buttons on touch.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean}
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
        if (btn.key === "legal") window.location.href = "datenschutz.html";
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

/**
 * Draws the start sub buttons on the canvas.
 */
function drawStartSubButtons() {
  const buttonWidth = 150;
  const buttonHeight = 40;
  const gap = 20;
  const totalWidth = buttonWidth * 4 + gap * 3;
  const startX = (canvas.width - totalWidth) / 2;
  const y = canvas.height - 50;
  const buttons = [
    { label: "Legal Notice", key: "legal" },
    { label: "Tutorial", key: "tutorial" },
    { label: soundOn ? "Sound Off" : "Sound On", key: "sound" },
    { label: "Fullscreen", key: "fullscreen" },
  ];
  startSubButtonAreas = [];
  buttons.forEach((btn, i) => {
    const x = startX + i * (buttonWidth + gap);
    ctx.save();
    ctx.fillStyle = "rgba(160,34,10,0.9)";
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(btn.label, x + buttonWidth / 2, y + buttonHeight / 2);
    ctx.restore();
    startSubButtonAreas.push({
      x,
      y,
      width: buttonWidth,
      height: buttonHeight,
      key: btn.key,
    });
  });
}

/**
 * Checks if the start button was clicked.
 * @param {MouseEvent} event - The mouse event.
 */
function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (showTutorialOverlayActive && tutorialCloseButtonArea) {
    if (
      x >= tutorialCloseButtonArea.x &&
      x <= tutorialCloseButtonArea.x + tutorialCloseButtonArea.width &&
      y >= tutorialCloseButtonArea.y &&
      y <= tutorialCloseButtonArea.y + tutorialCloseButtonArea.height
    ) {
      showTutorialOverlayActive = false;
      showStartButton = true;
      drawStartScreen();
      return;
    }
  }

  if (
    showStartButton &&
    startButtonArea &&
    x >= startButtonArea.x &&
    x <= startButtonArea.x + startButtonArea.width &&
    y >= startButtonArea.y &&
    y <= startButtonArea.y + startButtonArea.height
  ) {
    showStartButton = false;
    document.getElementById("startscreen").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    init();
    return;
  }

  if (showStartButton && startSubButtonAreas) {
    for (const btn of startSubButtonAreas) {
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        handleStartSubButton(btn);
        return;
      }
    }
  }
}

/**
 * Draws the start screen image and the start button on the canvas.
 */
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawStartSubButtons();
  };
  if (img.complete) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawStartSubButtons();
  }
}

/**
 * Handles the start sub buttons actions: tutorial, legal, sound, fullscreen.
 * @param {Object} btn - The button object containing key and other properties.
 */
function handleStartSubButton(btn) {
  if (btn.key === "tutorial") {
    showStartButton = false;
    showTutorialOverlay();
  }
  if (btn.key === "legal") {
    showStartButton = false;
    showLegalOverlay();
  }
  if (btn.key === "sound") {
    soundOn = !soundOn;
    handleSoundToggle();
    drawStartScreen();
  }
  if (btn.key === "fullscreen") {
    toggleFullscreen(canvas);
  }
}

/**
 * Draws the start button on the canvas.
 */
function drawStartButton() {
  const btnWidth = 260;
  const btnHeight = 60;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = 40;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Start game", canvas.width / 2, btnY + btnHeight / 2);
  ctx.restore();
  startButtonArea = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
}
