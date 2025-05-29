class WorldUI {
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.canvas = world.canvas;
    this.winImage = null;
    this.gameOverUI = new WorldUIGameOver(this);
  }

  /**
   * Draws the game field and all objects.
   */
  draw() {
    this._clearAndDrawBackground();
    this._drawMainOrOverlay();
    this._drawMobileControlsIfNeeded();
  }

  /**
   * Clears the canvas and draws the background.
   * @private
   */
  _clearAndDrawBackground() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToCanvas(this.world.level.background);
    this.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Draws either the main game objects or overlays (tutorial, game over, win).
   * @private
   */
  _drawMainOrOverlay() {
    if (this.world.showTutorial) {
      this.drawTutorial();
    } else if (this.world.character.energy === 0) {
      this.gameOverUI.drawGameOverImage();
    } else if (this.world.endboss && this.world.endboss.isDead) {
      this.gameOverUI.drawGameWinImage();
    } else {
      this._drawGameObjects();
    }
  }

  /**
   * Draws mobile controls if on mobile and game is running.
   * @private
   */
  _drawMobileControlsIfNeeded() {
    if (
      isMobile() &&
      typeof this.world.drawMobileControls === "function" &&
      this.world.character.energy > 0 &&
      !(this.world.endboss && this.world.endboss.isDead)
    ) {
      this.world.drawMobileControls();
    }
  }

  /**
   * Draws all main game objects and overlays.
   * @private
   */
  _drawGameObjects() {
    this._drawWorldObjects();
    this._drawStatusBars();
    this.drawSubButtons();
    this._drawMobileControlsIfActive();
  }

  /**
   * Draws all world objects (clouds, character, enemies, items).
   * @private
   */
  _drawWorldObjects() {
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToCanvas(this.world.level.clouds);
    this.addToCanvas(this.world.character);
    this.addObjectsToCanvas(this.world.level.enemies);
    this.addObjectsToCanvas(this.world.bottlesOnGround);
    this.addObjectsToCanvas(this.world.throwableObjects);
    this.addObjectsToCanvas(this.world.coins);
    this.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Draws all status bars.
   * @private
   */
  _drawStatusBars() {
    this.addToCanvas(this.world.statusBar);
    this.addToCanvas(this.world.statusBarCoins);
    this.addToCanvas(this.world.statusBarBottles);
    this.addToCanvas(this.world.statusBarEndboss);
  }

  /**
   * Draws mobile controls if available and game is running.
   * @private
   */
  _drawMobileControlsIfActive() {
    if (
      typeof this.drawMobileControls === "function" &&
      this.world.character.energy > 0
    ) {
      this.drawMobileControls();
    }
  }

  /**
   * Plays the game win sound if not already played.
   * @private
   */
  _handleGameWinSound() {
    if (!this.world.gameWinSoundPlayed && soundOn) {
      if (typeof gameOverAudio !== "undefined" && !gameOverAudio.paused) {
        gameOverAudio.pause();
        gameOverAudio.currentTime = 0;
      }
      winAudio.currentTime = 0;
      winAudio.play().catch(() => {});
      this.world.gameWinSoundPlayed = true;
    }
  }

  /**
   * Draws the Home button and saves its area.
   * @private
   */
  _drawHomeButton(centerX, btnY, buttonWidth, buttonHeight) {
    const homeBtnX = centerX + 20;
    this._drawRestartButtonRect(
      homeBtnX,
      btnY,
      buttonWidth,
      buttonHeight,
      homeBtnX + buttonWidth / 2,
      "Home"
    );
    this.world.homeButtonArea = {
      x: homeBtnX,
      y: btnY,
      width: buttonWidth,
      height: buttonHeight,
    };
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
    this.WorldUI._drawRestartButtonRect(btnX, btnY, buttonWidth, buttonHeight, x);
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
  _drawRestartButtonRect(btnX, btnY, buttonWidth, buttonHeight, labelX, label) {
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
    this.ctx.fillText(label, labelX, btnY + buttonHeight / 2);
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
    const startX = 370;
    const y = this.canvas.height - 50;
    const buttons = [
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
      "Controls:", "→ or D: Move right", "← or A: Move left", "↑ or W or SPACE: Jump", "ENTER or E: Throw bottle",];
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
    this._drawCloseButtonRect(btnX, btnY, btnWidth, btnHeight);
    this._saveTutorialCloseButtonArea(btnX, btnY, btnWidth, btnHeight);
  }

  /**
   * Draws the close button rectangle and label.
   * @private
   */
  _drawCloseButtonRect(btnX, btnY, btnWidth, btnHeight) {
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
  }

  /**
   * Saves the area of the tutorial close button for hit detection.
   * @private
   */
  _saveTutorialCloseButtonArea(btnX, btnY, btnWidth, btnHeight) {
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
