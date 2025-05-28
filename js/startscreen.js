let mousePos = { x: 0, y: 0 };

// Bild nur einmal laden!
let startScreenImg = new Image();
let startScreenImgLoaded = false;
startScreenImg.src = "img/9_intro_outro_screens/start/startscreen_1.png";
startScreenImg.onload = function () {
  startScreenImgLoaded = true;
  // Nur zeichnen, wenn ctx schon existiert!
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
  let isHover =
    mousePos.x >= x &&
    mousePos.x <= x + buttonWidth &&
    mousePos.y >= y &&
    mousePos.y <= y + 40;

  ctx.save();
  ctx.fillStyle = isHover
    ? "rgba(200,60,10,0.95)" // Hover-Farbe
    : "rgba(160,34,10,0.9)";
  ctx.fillRect(x, y, buttonWidth, 40);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(btn.label, x + buttonWidth / 2, y + 20);
  ctx.restore();
  startSubButtonAreas.push({
    x,
    y,
    width: buttonWidth,
    height: 40,
    key: btn.key,
  });
}

/**
 * Handles the start sub buttons actions: tutorial, legal, sound, fullscreen.
 * Executes the corresponding action based on the button key.
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
  if (btn.key === "imprint") {
    showStartButton = false;
    showImprintOverlay();
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
 * Initializes the canvas and draws the start screen on window load.
 * Also adds the mousemove listener for hover effects.
 */
window.onload = function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  drawStartScreen();
  addCanvasMousemoveListener();
};

function addCanvasMousemoveListener() {
  canvas.addEventListener("mousemove", handleCanvasMousemove);
}