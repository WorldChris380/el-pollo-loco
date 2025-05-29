// world-UI-gameover.class.js
class WorldUIGameOver {
  constructor(worldUI) {
    this.worldUI = worldUI;
    this.world = worldUI.world;
    this.ctx = worldUI.ctx;
    this.canvas = worldUI.canvas;
  }
  /**
   * Draws the Game Over image and the restart/home buttons.
   */
  drawGameOverImage() {
    this.world.paused = true;
    this._handleGameOverSound();
    this._prepareGameOverImage();
  }

  /**
   * Handles the Game Over sound logic.
   * @private
   */
  _handleGameOverSound() {
    if (!this.world.gameOverSoundPlayed && soundOn) {
      if (typeof winAudio !== "undefined" && !winAudio.paused) {
        winAudio.pause();
        winAudio.currentTime = 0;
      }
      if (typeof gameOverAudio !== "undefined" && gameOverAudio.paused) {
        gameOverAudio.currentTime = 0;
        gameOverAudio.play().catch(() => {});
      }
      this.world.gameOverSoundPlayed = true;
    }
  }

  /**
   * Prepares and draws the Game Over image.
   * @private
   */
  _prepareGameOverImage() {
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
   * Handles the game win sound and image display.
   */
  drawGameWinImage() {
    this.world.paused = true;
    this.worldUI._handleGameWinSound();
    this._drawGameWinImage();
  }

  /**
   * Draws the Game Over image and both buttons.
   * @private
   * @param {HTMLImageElement} img - The image to draw.
   * @param {number} centerX - X center of the image.
   * @param {number} centerY - Y center of the image.
   * @param {number} width - Width of the image.
   * @param {number} height - Height of the image.
   */
  _drawGameOverImage(img, centerX, centerY, width, height) {
    this._drawGameOverBackground(img, centerX, centerY, width, height);
    this._drawGameOverButtons(centerX, centerY, width, height);
  }

  /**
   * Draws the Game Over background image.
   * @private
   */
  _drawGameOverBackground(img, centerX, centerY, width, height) {
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
  }

  /**
   * Draws the New Game and Home buttons.
   * @private
   */
  _drawGameOverButtons(centerX, centerY, width, height) {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const btnY = centerY + height / 2 + 40;
    this._drawNewGameButton(centerX, btnY, buttonWidth, buttonHeight);
    this.worldUI._drawHomeButton(centerX, btnY, buttonWidth, buttonHeight);
  }

  /**
   * Draws the game win image on the canvas.
   * @private
   */
  _drawGameWinImage() {
    this._ensureWinImageLoaded();
    if (this.winImage && this.winImage.complete) {
      this._drawWinImageOnCanvas();
    }
  }

  /**
   * Ensures the win image is loaded and sets up onload handler.
   * @private
   */
  _ensureWinImageLoaded() {
    if (!this.winImage) {
      this.winImage = new Image();
      this.winImage.src = "img/You won, you lost/You Won B.png";
      this.winImage.onload = () => this._drawWinImageOnCanvas();
    }
  }

  /**
   * Draws the win image at the center of the canvas.
   * @private
   */
  _drawWinImageOnCanvas() {
    this._drawGameOverImage(
      this.winImage,
      this.canvas.width / 2,
      this.canvas.height / 2,
      400,
      200
    );
  }

  /**
   * Draws the New Game button and saves its area.
   * @private
   */
  _drawNewGameButton(centerX, btnY, buttonWidth, buttonHeight) {
    const btnX = centerX - buttonWidth - 20;
    this.worldUI._drawRestartButtonRect(
      btnX, btnY, buttonWidth,
      buttonHeight,
      btnX + buttonWidth / 2,
      "New game"
    );
    this.world.restartButtonArea = {
      x: btnX,
      y: btnY,
      width: buttonWidth,
      height: buttonHeight,
    };
  }
}
