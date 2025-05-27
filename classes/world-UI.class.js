class WorldUI {
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.canvas = world.canvas;
  }

  /**
   * Draws the game field and all objects.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToCanvas(this.world.level.background);
    this.ctx.translate(-this.world.camera_x, 0);
    if (this.world.showTutorial) this.drawTutorial();
    else if (this.world.character.energy === 0) this.drawGameOverImage();
    else this._drawGameObjects();
    if (
      isMobile() &&
      typeof this.world.drawMobileControls === "function" &&
      this.world.character.energy > 0
    ) {
      this.world.drawMobileControls();
    }
  }

  /**
   * Draws all main game objects an
   *
   *
   *
   *
   * d overlays.
   * @private
   */
  _drawGameObjects() {
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToCanvas(this.world.level.clouds);
    this.addToCanvas(this.world.character);
    this.addObjectsToCanvas(this.world.level.enemies);
    this.addObjectsToCanvas(this.world.bottlesOnGround);
    this.addObjectsToCanvas(this.world.throwableObjects);
    this.addObjectsToCanvas(this.world.coins);
    this.ctx.translate(-this.world.camera_x, 0);
    this.addToCanvas(this.world.statusBar);
    this.addToCanvas(this.world.statusBarCoins);
    this.addToCanvas(this.world.statusBarBottles);
    this.addToCanvas(this.world.statusBarEndboss);
    this.drawSubButtons();
    if (
      typeof this.drawMobileControls === "function" &&
      this.world.character.energy > 0
    ) {
      this.drawMobileControls();
    }
  }

  /**
   * Draws the Game Over image and the restart button.
   */
  drawGameOverImage() {
    if (!this.world.gameOverSoundPlayed && soundOn) {
      gameOverAudio.currentTime = 0;
      gameOverAudio.play();
      this.world.gameOverSoundPlayed = true;
    }
    const img = new Image();
    img.src = "img/You won, you lost/Game over A.png";
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = 400;
    const height = 200;
    img.onload = () => {
      this._drawGameOverImage(img, centerX, centerY, width, height);
    };
    if (img.complete) {
      this._drawGameOverImage(img, centerX, centerY, width, height);
    }
  }

  /**
   * Draws the Game Over image and restart button.
   * @private
   * @param {HTMLImageElement} img
   * @param {number} centerX
   * @param {number} centerY
   * @param {number} width
   * @param {number} height
   */
  _drawGameOverImage(img, centerX, centerY, width, height) {
    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.drawImage(
      img,
      centerX - width / 2,
      centerY - height / 2,
      width,
      height
    );
    this.ctx.restore();
    this.drawRestartButton(centerX, centerY + height / 2 + 40);
  }

  /**
   * Draws the restart button and saves its position.
   * @param {number} x - X position of the button.
   * @param {number} y - Y position of the button.
   */
  drawRestartButton(x, y) {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const btnX = x - buttonWidth / 2;
    const btnY = y;
    this._drawRestartButtonRect(btnX, btnY, buttonWidth, buttonHeight, x);
    this.world.restartButtonArea = {
      x: btnX,
      y: btnY,
      width: buttonWidth,
      height: buttonHeight,
    };
  }

  /**
   * Draws the restart button rectangle and label.
   * @private
   * @param {number} btnX
   * @param {number} btnY
   * @param {number} buttonWidth
   * @param {number} buttonHeight
   * @param {number} labelX
   */
  _drawRestartButtonRect(btnX, btnY, buttonWidth, buttonHeight, labelX) {
    this.ctx.save();
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = "#a0220a";
    this.ctx.fillRect(btnX, btnY, buttonWidth, buttonHeight);
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(btnX, btnY, buttonWidth, buttonHeight);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 26px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("New game", labelX, btnY + buttonHeight / 2);
    this.ctx.restore();
  }

  /**
   * Adds a list of objects to the canvas.
   * @param {Array} objects
   */
  addObjectsToCanvas(objects) {
    objects.forEach((obj) => {
      this.addToCanvas(obj);
    });
  }

  /**
   * Draws the sub buttons at the bottom of the canvas.
   */
  drawSubButtons() {
    const buttonWidth = 150;
    const buttonHeight = 40;
    const gap = 20;
    const totalWidth = buttonWidth * 4 + gap * 3;
    const startX = (this.canvas.width - totalWidth) / 2;
    const y = this.canvas.height - 50;
    const buttons = [
      { label: "Legal Notice", key: "legal" },
      { label: "Tutorial", key: "tutorial" },
      { label: soundOn ? "Sound Off" : "Sound On", key: "sound" },
      { label: "Fullscreen", key: "fullscreen" },
    ];
    this.world.subButtonAreas = [];
    buttons.forEach((btn, i) =>
      this._drawSubButton(btn, i, startX, buttonWidth, gap, y, buttonHeight)
    );
  }

  /**
   * Draws a single sub button and saves its area.
   * @private
   * @param {Object} btn
   * @param {number} i
   * @param {number} startX
   * @param {number} buttonWidth
   * @param {number} gap
   * @param {number} y
   * @param {number} buttonHeight
   */
  _drawSubButton(btn, i, startX, buttonWidth, gap, y, buttonHeight) {
    const x = startX + i * (buttonWidth + gap);
    this.ctx.save();
    this.ctx.fillStyle = "rgba(160,34,10,0.9)";
    this.ctx.fillRect(x, y, buttonWidth, buttonHeight);
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(btn.label, x + buttonWidth / 2, y + buttonHeight / 2);
    this.ctx.restore();
    this.world.subButtonAreas.push({
      x,
      y,
      width: buttonWidth,
      height: buttonHeight,
      key: btn.key,
    });
  }

  /**
   * Draws the tutorial overlay and the close button.
   */
  drawTutorial() {
    this._drawTutorialOverlay();
    this._drawTutorialText();
    this._drawTutorialCloseButton();
  }

  /**
   * Draws the tutorial overlay background.
   * @private
   */
  _drawTutorialOverlay() {
    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(60, 40, this.canvas.width - 120, this.canvas.height - 80);
    this.ctx.globalAlpha = 1;
    this.ctx.restore();
  }

  /**
   * Draws the tutorial text.
   * @private
   */
  _drawTutorialText() {
    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 36px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Tutorial", this.canvas.width / 2, 100);
    this.ctx.font = "20px Arial";
    this.ctx.textAlign = "left";
    let lines = [
      "Controls:",
      "→ or D: Move right",
      "← or A: Move left",
      "↑ or W or SPACE: Jump",
      "ENTER or E: Throw bottle",
    ];
    let y = 150;
    for (let line of lines) {
      this.ctx.fillText(line, 100, y);
      y += 35;
    }
    this.ctx.restore();
  }

  /**
   * Draws the close button for the tutorial overlay.
   * @private
   */
  _drawTutorialCloseButton() {
    const btnWidth = 180;
    const btnHeight = 50;
    const btnX = this.canvas.width / 2 - btnWidth / 2;
    const btnY = this.canvas.height - 120;
    this.ctx.save();
    this.ctx.fillStyle = "#a0220a";
    this.ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("Close", this.canvas.width / 2, btnY + btnHeight / 2);
    this.ctx.restore();
    this.world.tutorialCloseButton = {
      x: btnX,
      y: btnY,
      width: btnWidth,
      height: btnHeight,
    };
  }

  /**
   * Adds an object to the canvas and flips it if necessary.
   * @param {MoveableObject} moveableObject
   */
  addToCanvas(moveableObject) {
    if (moveableObject.otherDirection) this.world.flipImage(moveableObject);
    moveableObject.draw(this.ctx);
    this.ctx.drawImage(
      moveableObject.img,
      moveableObject.x,
      moveableObject.y,
      moveableObject.width,
      moveableObject.height
    );
    if (moveableObject.otherDirection) this.world.flipImageBack(moveableObject);
  }
}
