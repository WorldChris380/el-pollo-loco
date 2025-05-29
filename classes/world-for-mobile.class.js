/**
 * This file contains the methods for drawing and animating the mobile control buttons.
 * It is separated for clarity.
 */

/**
 * Extension of the World class with methods for mobile control buttons.
 * Draws and manages the mobile buttons on the canvas.
 */

/**
 * Draws all mobile control buttons on the canvas.
 */
World.prototype._setupMobileButtons = function () {
  const w = this.canvas.width;
  const h = this.canvas.height;
  const btnSize = 70,
    margin = 20,
    gap = 30;
  const totalHeight = btnSize * 2 + gap;
  const startY = this._getMobileButtonsStartY(h, totalHeight);
  this.mobileButtons = this._createMobileButtons(
    w,
    startY,
    btnSize,
    margin,
    gap
  );
};

/**
 * Calculates the Y start position to vertically center the mobile buttons on the canvas.
 * @param {number} h - Canvas height.
 * @param {number} totalHeight - Total height of all mobile buttons including gaps.
 * @returns {number} The Y coordinate to start drawing the buttons.
 */
World.prototype._getMobileButtonsStartY = function (h, totalHeight) {
  return (h - totalHeight) / 2;
};

/**
 * Creates the mobile control buttons with position and label.
 * @param {number} w - Canvas width.
 * @param {number} startY - Y start position.
 * @param {number} btnSize - Button size.
 * @param {number} margin - Margin from edge.
 * @param {number} gap - Gap between buttons.
 * @returns {Array<Object>} Array of button objects.
 */
World.prototype._createMobileButtons = function (
  w,
  startY,
  btnSize,
  margin,
  gap
) {
  return [
    this._createMobileButton("LEFT", margin, startY, btnSize, "←"),
    this._createMobileButton(
      "ENTER", margin, startY + btnSize + gap, btnSize, "🧴"),
    this._createMobileButton(
      "RIGHT", w - btnSize - margin, startY, btnSize, "→"),
    this._createMobileButton(
      "UP", w - btnSize - margin, startY + btnSize + gap, btnSize, "⤒"),
  ];
};

/**
 * Helper to create a single mobile button object.
 * @param {string} key - Button key.
 * @param {number} x - X position.
 * @param {number} y - Y position.
 * @param {number} size - Button size.
 * @param {string} label - Button label.
 * @returns {Object} Button object.
 * @private
 */
World.prototype._createMobileButton = function (key, x, y, size, label) {
  return { key, x, y, w: size, h: size, label };
};

/**
 * Draws a single mobile button.
 * @private
 * @param {Object} btn - Button object with position and label.
 */
World.prototype._drawMobileButton = function (btn) {
  this.ctx.save();
  this.ctx.globalAlpha = this.pressedButtons[btn.key] ? 0.7 : 0.4;
  this.ctx.fillStyle = "#a0220a";
  this.ctx.beginPath();
  this.ctx.arc(btn.x + btn.w / 2, btn.y + btn.h / 2, btn.w / 2, 0, 2 * Math.PI);
  this.ctx.fill();
  this.ctx.font = "bold 32px Arial";
  this.ctx.fillStyle = "#fff";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
  this.ctx.restore();
};

/**
 * Starts the animation loop for drawing the world.
 */
World.prototype.drawLoop = function () {
  this.draw();
  requestAnimationFrame(() => this.drawLoop());
};

let showTutorialOverlayActive = false;

/**
 * Shows the tutorial overlay.
 */
function showTutorialOverlay() {
  showTutorialOverlayActive = true;
  drawTutorialOverlayBackground();
  drawTutorialOverlayText();
  drawTutorialCloseButton();
  saveTutorialCloseButtonArea();
}

/**
 * Draws the background for the tutorial overlay.
 * @private
 */
function drawTutorialOverlayBackground() {
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#222";
  ctx.fillRect(60, 40, canvas.width - 120, canvas.height - 80);
  ctx.globalAlpha = 1;
}

/**
 * Draws the tutorial text.
 * @private
 */
function drawTutorialOverlayText() {
  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Tutorial", canvas.width / 2, 100);
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  let lines = [
    "Steuerung:","→ oder D: Nach rechts laufen","← oder A: Nach links laufen","↑ oder W oder SPACE: Springen","ENTER oder E: Flasche werfen"];
  let y = 150;
  for (let line of lines) {
    ctx.fillText(line, 100, y);
    y += 35;
  }
}

/**
 * Draws the close button for the tutorial overlay.
 * @private
 */
function drawTutorialCloseButton() {
  const btnWidth = 180;
  const btnHeight = 50;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = canvas.height - 120;
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Close", canvas.width / 2, btnY + btnHeight / 2);
  ctx.restore();
}

/**
 * Saves the area of the close button for click detection.
 * @private
 */
function saveTutorialCloseButtonArea() {
  const btnWidth = 180;
  const btnHeight = 50;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = canvas.height - 120;
  tutorialCloseButtonArea = {
    x: btnX,
    y: btnY,
    width: btnWidth,
    height: btnHeight,
  };
}

/**
 * Redirects the user to the privacy policy (datenschutz) page.
 */
function showLegalOverlay() {
  window.location.href = "datenschutz.html";
}

/**
 * Redirects the user to the imprint (impressum) page.
 */
function showImprintOverlay() {
  window.location.href = "imprint.html";
}

/**
 * Closes the legal overlay and returns to the start screen.
 */
function closeLegalOverlay() {
  document.getElementById("legal-overlay").style.display = "none";
  showStartButton = true;
  drawStartScreen();
}

/**
 * Draws all mobile control buttons on the canvas.
 */
World.prototype.drawMobileControls = function () {
  this._setupMobileButtons();
  this.mobileButtons.forEach((btn) => this._drawMobileButton(btn));
};
