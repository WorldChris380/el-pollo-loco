let mousePos = { x: 0, y: 0 };
let startScreenImg = new Image();
let startScreenImgLoaded = false;
startScreenImg.src = "img/9_intro_outro_screens/start/startscreen_1.png";
startScreenImg.onload = function () {
  startScreenImgLoaded = true;
  if (typeof ctx !== "undefined" && ctx) {
    drawStartScreen();
  }
};

/**
 * Zeichnet den Startscreen inkl. Bild, Startbutton und Subbuttons.
 */
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (startScreenImgLoaded) {
    ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawStartSubButtons();
  }
}

/**
 * Draws the start button on the canvas and saves its area.
 */
function drawStartButton() {
  const btnWidth = 260;
  const btnHeight = 60;
  const btnX = getStartButtonX(btnWidth);
  const btnY = getStartButtonY();
  drawStartButtonRect(btnX, btnY, btnWidth, btnHeight);
  drawStartButtonLabel(btnX, btnY, btnWidth, btnHeight);
  saveStartButtonArea(btnX, btnY, btnWidth, btnHeight);
}

/**
 * Calculates the X position for the start button.
 * @private
 */
function getStartButtonX(btnWidth) {
  return canvas.width / 2 - btnWidth / 2;
}

/**
 * Calculates the Y position for the start button.
 * @private
 */
function getStartButtonY() {
  return 40;
}

/**
 * Draws the start button rectangle.
 * @private
 */
function drawStartButtonRect(btnX, btnY, btnWidth, btnHeight) {
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
  ctx.restore();
}

/**
 * Draws the start button label.
 * @private
 */
function drawStartButtonLabel(btnX, btnY, btnWidth, btnHeight) {
  ctx.save();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Start game", btnX + btnWidth / 2, btnY + btnHeight / 2);
  ctx.restore();
}

/**
 * Saves the start button area for hit detection.
 * @private
 */
function saveStartButtonArea(btnX, btnY, btnWidth, btnHeight) {
  startButtonArea = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
}

/**
 * Draws the start sub buttons on the canvas.
 */
function drawStartSubButtons() {
  const buttonWidth = 120;
  const buttonHeight = 40;
  const gap = 10;
  const totalWidth = buttonWidth * 4 + gap * 3;
  const startX = 40;
  const y = canvas.height - 50;
  const buttons = getStartSubButtonConfigs();
  startSubButtonAreas = [];
  buttons.forEach((btn, i) =>
    drawSingleStartSubButton(btn, i, startX, y, buttonWidth, gap)
  );
}

/**
 * Returns the configuration for the start sub buttons.
 * @returns {Array<Object>} Array of button configs
 */
function getStartSubButtonConfigs() {
  return [
    { label: "Imprint", key: "imprint" },
    { label: "Legal Notice", key: "legal" },
    { label: "Tutorial", key: "tutorial" },
    { label: soundOn ? "Sound Off" : "Sound On", key: "sound" },
    { label: "Fullscreen", key: "fullscreen" },
  ];
}

/**
 * Draws a single start sub button and saves its area.
 * @param {Object} btn - Button config
 * @param {number} i - Index
 * @param {number} startX - Start X position
 * @param {number} y - Y position
 * @param {number} buttonWidth - Button width
 * @param {number} gap - Gap between buttons
 */
function drawSingleStartSubButton(btn, i, startX, y, buttonWidth, gap) {
  const x = startX + i * (buttonWidth + gap);
  const isHover = isMouseOverButton(x, y, buttonWidth, 40);
  drawStartSubButtonRect(x, y, buttonWidth, 40, isHover, btn.label);
  saveStartSubButtonArea(x, y, buttonWidth, 40, btn.key);
}

/**
 * Checks if the mouse is over the button.
 * @private
 */
function isMouseOverButton(x, y, width, height) {
  return (
    mousePos.x >= x &&
    mousePos.x <= x + width &&
    mousePos.y >= y &&
    mousePos.y <= y + height
  );
}

/**
 * Draws the button rectangle and label.
 * @private
 */
function drawStartSubButtonRect(x, y, width, height, isHover, label) {
  ctx.save();
  ctx.fillStyle = isHover
    ? "rgba(200,60,10,0.95)"
    : "rgba(160,34,10,0.9)";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + width / 2, y + height / 2);
  ctx.restore();
}

/**
 * Saves the button area for hit detection.
 * @private
 */
function saveStartSubButtonArea(x, y, width, height, key) {
  startSubButtonAreas.push({
    x,
    y,
    width,
    height,
    key,
  });
}

/**
 * Handles the start sub buttons actions: tutorial, legal, sound, fullscreen.
 * Executes the corresponding action based on the button key.
 * @param {Object} btn - The button object containing key and other properties.
 */
function handleStartSubButton(btn) {
  switch (btn.key) {
    case "tutorial":
      handleTutorialButton();
      break;
    case "legal":
      handleLegalButton();
      break;
    case "imprint":
      handleImprintButton();
      break;
    case "sound":
      handleSoundButton();
      break;
    case "fullscreen":
      handleFullscreenButton();
      break;
  }
}

/**
 * Handles the tutorial button action.
 * @private
 */
function handleTutorialButton() {
  showStartButton = false;
  showTutorialOverlay();
}

/**
 * Handles the legal button action.
 * @private
 */
function handleLegalButton() {
  showStartButton = false;
  showLegalOverlay();
}

/**
 * Handles the imprint button action.
 * @private
 */
function handleImprintButton() {
  showStartButton = false;
  showImprintOverlay();
}

/**
 * Handles the sound button action.
 * @private
 */
function handleSoundButton() {
  soundOn = !soundOn;
  handleSoundToggle();
  drawStartScreen();
}

/**
 * Handles the fullscreen button action.
 * @private
 */
function handleFullscreenButton() {
  toggleFullscreen(canvas);
}

/**
 * Initializes the canvas and draws the start screen on window load.
 * Also adds the mousemove listener for hover effects.
 */
window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  drawStartScreen();
  addCanvasMousemoveListener();
};

/**
 * Adds a mousemove event listener to the canvas to handle hover effects.
 */
function addCanvasMousemoveListener() {
  canvas.addEventListener("mousemove", handleCanvasMousemove);
}