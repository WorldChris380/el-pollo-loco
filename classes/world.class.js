/**
 * The World class manages the game, game objects, rendering, and collisions.
 * Contains methods for drawing, collision checks, object creation, and game logic control.
 * Mobile control buttons are rendered on the canvas.
 */
class World {
  character;
  ctx;
  canvas;
  camera_x = 0;
  showTutorial = false;
  statusBar = new StatusBar();
  statusBarCoins = new StatusBarCoins();
  statusBarBottles = new StatusBarBottles();
  statusBarEndboss = new StatusBarEndboss();
  bottlesOnGround = [];
  throwableObjects = [];
  collectedBottles = 0;
  coins = [];
  collectedCoins = 0;
  mobileButtons = [];
  pressedButtons = {};
  lastThrowTime = 0; // Füge dies als Eigenschaft der World-Klasse hinzu (z.B. ganz oben in der Klasse)

  /**
   * Initializes the world and starts the game.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Object} keyboard - The keyboard object.
   */
  constructor(canvas, keyboard) {
    this.character = new Character();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = createLevel1();
    this.background = this.level.background;
    this.clouds = this.level.clouds;
    this.enemies = this.level.enemies;
    this.draw();
    this.setWorld();
    this.run();
    this.createBottlesOnGround();
    this.createCoins();
    this.endboss = new Endboss(this);
    this.level.enemies.push(this.endboss);
    this.drawLoop();
  }

  /** Sets the reference to the world in the character. */
  setWorld() {
    this.character.world = this;
  }

  /** Starts the main game logic in an interval. */
  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkBottleHitsEndboss();
      this.checkThrowObjects();
    }, 180);
  }

  /** Checks if a bottle can be thrown and creates it. */
  checkThrowObjects() {
    const now = Date.now();
    if (
      this.keyboard.ENTER &&
      this.collectedBottles > 0 &&
      (!this.lastThrowTime || now - this.lastThrowTime > 1000)
    ) {
      this.collectedBottles--;
      this.statusBarBottles.setAmount(this.collectedBottles);
      let offsetX = this.character.otherDirection ? -50 : 50;
      let bottle = new ThrowableObject(
        this.character.x + offsetX,
        this.character.y + this.character.height - 70,
        this.character.otherDirection,
        this
      );
      this.throwableObjects.push(bottle);
      this.lastThrowTime = now;
    }
  }

  /** Checks and collects collisions with bottles. */
  collidingWithBottles() {
    for (let i = this.bottlesOnGround.length - 1; i >= 0; i--) {
      if (this.character.isCollidingWithDrawable(this.bottlesOnGround[i])) {
        this.bottlesOnGround.splice(i, 1);
        this.collectedBottles++;
        this.statusBarBottles.setAmount(this.collectedBottles);
      }
    }
  }

  /** Checks and collects collisions with coins. */
  collidingWithCoins() {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      if (this.character.isCollidingWithDrawable(this.coins[i])) {
        this.coins.splice(i, 1);
        this.collectedCoins++;
        this.statusBarCoins.setAmountOfCoins(this.collectedCoins);
        if (soundOn) {
          coinAudio.currentTime = 0;
          coinAudio.play();
        }
      }
    }
  }

  /**
   * Checks if a thrown bottle hits the endboss.
   */
  checkBottleHitsEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (
        this.endboss &&
        this.isColliding(bottle, this.endboss) &&
        !this.endboss.isDead &&
        !bottle.isBroken
      ) {
        bottle.break();
        this.endboss.hit();
        this.statusBarEndboss.setPercentage(this.endboss.energy);
      }
    });
  }

  /**
   * Checks if two objects collide.
   * @param {Object} obj1
   * @param {Object} obj2
   * @returns {boolean}
   */
  isColliding(obj1, obj2) {
    const a = obj1.getCollisionBox ? obj1.getCollisionBox() : obj1;
    const b = obj2.getCollisionBox ? obj2.getCollisionBox() : obj2;
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  /** Returns the number of collected bottles. */
  bottlesAvailable() {
    return this.collectedBottles;
  }

  /** Checks collisions with enemies, bottles, and coins. */
  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          if (enemy.isDead) return;
          if (this.character.isFallingOn(enemy)) enemy.die();
          else {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
          }
        }
      });
      this.collidingWithBottles();
      this.collidingWithCoins();
    }, 200);
  }

  /** Creates bottles on the ground. */
  createBottlesOnGround() {
    for (let i = 0; i < 10; i++) {
      let bottle = new BottlesGround();
      this.bottlesOnGround.push(bottle);
    }
  }

  /** Creates coins on the field. */
  createCoins() {
    for (let i = 0; i < 10; i++) {
      let coin = new Coins();
      this.coins.push(coin);
    }
  }

  /** Draws the game field and all objects. */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToCanvas(this.level.background);
    this.ctx.translate(-this.camera_x, 0);
    if (this.showTutorial) this.drawTutorial();
    else if (this.character.energy === 0) this.drawGameOverImage();
    else this._drawGameObjects();
  }

  /**
   * Draws all main game objects and overlays.
   * @private
   */
  _drawGameObjects() {
    this.drawSubButtons();
    this.addObjectsToCanvas(this.level.clouds);
    this.addToCanvas(this.statusBar);
    this.addToCanvas(this.statusBarCoins);
    this.addToCanvas(this.statusBarBottles);
    this.addToCanvas(this.statusBarEndboss);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToCanvas(this.coins);
    this.addToCanvas(this.character);
    this.addObjectsToCanvas(this.level.enemies);
    this.addObjectsToCanvas(this.bottlesOnGround);
    this.addObjectsToCanvas(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    if (
      typeof this.drawMobileControls === "function" &&
      this.character.energy > 0
    ) {
      this.drawMobileControls();
    }
  }

  /**
   * Draws the Game Over image and the restart button.
   */
  drawGameOverImage() {
    if (!this.gameOverSoundPlayed && soundOn) {
      gameOverAudio.currentTime = 0;
      gameOverAudio.play();
      this.gameOverSoundPlayed = true;
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
    this.restartButtonArea = {
      x: btnX,
      y: btnY,
      width: buttonWidth,
      height: buttonHeight,
    };
  }

  /**
   * Draws the restart button rectangle and label.
   * @private
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

  /** Adds a list of objects to the canvas. */
  addObjectsToCanvas(objects) {
    objects.forEach((obj) => {
      this.addToCanvas(obj);
    });
  }

  /** Draws the sub buttons at the bottom of the canvas. */
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
    this.subButtonAreas = [];
    buttons.forEach((btn, i) =>
      this._drawSubButton(btn, i, startX, buttonWidth, gap, y, buttonHeight)
    );
  }

  /**
   * Draws a single sub button and saves its area.
   * @private
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
    this.subButtonAreas.push({
      x,
      y,
      width: buttonWidth,
      height: buttonHeight,
      key: btn.key,
    });
  }

  /** Draws the tutorial overlay and the close button. */
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
      "Steuerung:",
      "→ oder D: Nach rechts laufen",
      "← oder A: Nach links laufen",
      "↑ oder W oder SPACE: Springen",
      "ENTER oder E: Flasche werfen",
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
    this.ctx.fillText("Schließen", this.canvas.width / 2, btnY + btnHeight / 2);
    this.ctx.restore();
    this.tutorialCloseButton = {
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
  addToCanvas(moveableObject, bottle) {
    if (moveableObject.otherDirection) this.flipImage(moveableObject);
    moveableObject.draw(this.ctx);
    // moveableObject.drawFrame(this.ctx);
    this.ctx.drawImage(
      moveableObject.img,
      moveableObject.x,
      moveableObject.y,
      moveableObject.width,
      moveableObject.height
    );
    if (moveableObject.otherDirection) this.flipImageBack(moveableObject);
  }

  /** Flips the image of an object horizontally. */
  flipImage(moveableObject) {
    this.ctx.save();
    this.ctx.translate(moveableObject.width, 0);
    this.ctx.scale(-1, 1);
    moveableObject.x = moveableObject.x * -1;
  }

  /** Resets the image flip. */
  flipImageBack(moveableObject) {
    this.ctx.restore();
    moveableObject.x = moveableObject.x * -1;
  }

  /** Starts the animation loop for drawing the world. */
  drawLoop() {
    this.draw();
    requestAnimationFrame(() => this.drawLoop());
  }
}

/**
 * Handles touch events for mobile controls and restart button.
 * Splits logic into helper functions for max 14 lines per function.
 * @param {TouchEvent} e
 */
function handleTouch(e) {
  if (e.cancelable) e.preventDefault();
  if (!world || !world.mobileButtons) return;
  for (let touch of e.touches) {
    const { x, y } = getTouchPosition(touch);
    if (handleMobileButtonTouch(x, y)) return;
    handleRestartButtonTouch(x, y);
  }
}

/**
 * Calculates the touch position relative to the canvas.
 * @param {Touch} touch
 * @returns {{x: number, y: number}}
 */
function getTouchPosition(touch) {
  const rect = canvas.getBoundingClientRect();
  const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
  return { x, y };
}

/**
 * Handles touch logic for mobile control buttons.
 * @param {number} x
 * @param {number} y
 * @returns {boolean} True if a mobile button was pressed.
 */
function handleMobileButtonTouch(x, y) {
  let hitMobileButton = false;
  world.mobileButtons.forEach((btn) => {
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      world.pressedButtons[btn.key] = true;
      keyboard[btn.key] = true;
      hitMobileButton = true;
    }
  });
  return hitMobileButton;
}

/**
 * Handles touch logic for the Game Over restart button.
 * @param {number} x
 * @param {number} y
 */
function handleRestartButtonTouch(x, y) {
  if (world && world.restartButtonArea && world.character.energy === 0) {
    const btn = world.restartButtonArea;
    if (
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    ) {
      restartGame();
    }
  }
}
