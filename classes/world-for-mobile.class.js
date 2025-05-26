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
World.prototype.drawMobileControls = function () {
  if (!isMobile()) return;
  this._setupMobileButtons();
  this.mobileButtons.forEach((btn) => this._drawMobileButton(btn));
};

/**
 * Initializes the position and properties of the mobile buttons.
 * @private
 */
World.prototype._setupMobileButtons = function () {
  const w = this.canvas.width;
  const h = this.canvas.height;
  const btnSize = 70,
    margin = 20,
    gap = 30;
  const totalHeight = btnSize * 2 + gap;
  const startY = (h - totalHeight) / 2;
  this.mobileButtons[0] = {
    key: "LEFT",
    x: margin,
    y: startY,
    w: btnSize,
    h: btnSize,
    label: "←",
  };
  this.mobileButtons[1] = {
    key: "ENTER",
    x: margin,
    y: startY + btnSize + gap,
    w: btnSize,
    h: btnSize,
    label: "🧴",
  };
  this.mobileButtons[2] = {
    key: "RIGHT",
    x: w - btnSize - margin,
    y: startY,
    w: btnSize,
    h: btnSize,
    label: "→",
  };
  this.mobileButtons[3] = {
    key: "UP",
    x: w - btnSize - margin,
    y: startY + btnSize + gap,
    w: btnSize,
    h: btnSize,
    label: "⤒",
  };
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
  this.ctx.arc(
    btn.x + btn.w / 2,
    btn.y + btn.h / 2,
    btn.w / 2,
    0,
    2 * Math.PI
  );
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
