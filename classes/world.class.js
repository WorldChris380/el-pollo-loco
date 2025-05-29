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
  lastThrowTime = 0;
  ui;
  paused = false;

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
    this.ui = new WorldUI(this);
    this.setWorld();
    this.run();
    this.createBottlesOnGround();
    this.createCoins();
    this.mobileButtons = [];
    this.endboss = new Endboss(this);
    this.level.enemies.push(this.endboss);
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
    this.drawLoop();
    this.draw();
    requestAnimationFrame(() => this.drawLoop());
  }

  /**
   * Sets the reference to the world in the character.
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Starts the main game logic in an interval.
   */
  run() {
    this.logicInterval = setInterval(() => {
      if (!this.paused) {
        this.checkCollisions();
        this.checkBottleHitsEndboss();
        this.checkThrowObjects();
      }
    }, 180);
  }

  /**
   * Checks if a bottle can be thrown and creates it.
   */
  checkThrowObjects() {
    const now = Date.now();
    if (this._canThrowBottle(now)) {
      this._throwBottle(now);
    }
  }

  /**
   * Checks if the conditions to throw a bottle are met.
   * @private
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  _canThrowBottle(now) {
    return (
      this.keyboard.ENTER &&
      this.collectedBottles > 0 &&
      (!this.lastThrowTime || now - this.lastThrowTime > 300)
    );
  }

  /**
   * Handles the logic for throwing a bottle.
   * @private
   * @param {number} now - Current timestamp.
   */
  _throwBottle(now) {
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

  /**
   * Checks and collects collisions with bottles.
   * Respawns a new bottle at a random X position after collection.
   */
  collidingWithBottles() {
    for (let i = this.bottlesOnGround.length - 1; i >= 0; i--) {
      if (this.character.isCollidingWithDrawable(this.bottlesOnGround[i])) {
        this.bottlesOnGround.splice(i, 1);
        this.collectedBottles++;
        this.statusBarBottles.setAmount(this.collectedBottles);
        let newBottle = new BottlesGround();
        while (Math.abs(newBottle.x - this.character.x) < 150) {
          newBottle.x = 250 + Math.random() * 1000;
        }
        this.bottlesOnGround.push(newBottle);
      }
    }
  }

  /**
   * Checks and collects collisions with coins.
   */
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
    // Für Endboss: Flasche volle Hitbox, sonst wie gehabt
    const a =
      obj1 instanceof ThrowableObject && obj2 instanceof Endboss
        ? { x: obj1.x, y: obj1.y, width: obj1.width, height: obj1.height }
        : obj1.getCollisionBox
        ? obj1.getCollisionBox()
        : obj1;
    const b = obj2.getCollisionBox ? obj2.getCollisionBox() : obj2;
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  /**
   * Returns the number of collected bottles.
   * @returns {number}
   */
  bottlesAvailable() {
    return this.collectedBottles;
  }

  /**
   * Checks collisions with enemies, bottles, and coins.
   */
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

  /**
   * Creates bottles on the ground.
   */
  createBottlesOnGround() {
    for (let i = 0; i < 5; i++) {
      let bottle = new BottlesGround();
      this.bottlesOnGround.push(bottle);
    }
  }

  /**
   * Creates coins on the field.
   */
  createCoins() {
    for (let i = 0; i < 5; i++) {
      let coin = new Coins();
      this.coins.push(coin);
    }
  }

  /**
   * Flips the image of an object horizontally.
   * @param {MoveableObject} moveableObject
   */
  flipImage(moveableObject) {
    this.ctx.save();
    this.ctx.translate(moveableObject.width, 0);
    this.ctx.scale(-1, 1);
    moveableObject.x = moveableObject.x * -1;
  }

  /**
   * Resets the image flip.
   * @param {MoveableObject} moveableObject
   */
  flipImageBack(moveableObject) {
    this.ctx.restore();
    moveableObject.x = moveableObject.x * -1;
  }

  /**
   * Starts the animation loop for drawing the world.
   */
  drawLoop() {
    this.draw();
    requestAnimationFrame(() => this.drawLoop());
  }

  /**
   * Draws the world and its elements.
   */
  draw() {
    this.ui.draw();
  }

  /**
   * Draws mobile control buttons on the canvas.
   */
  drawMobileControls() {
    if (
      isMobile() &&
      typeof this.world.drawMobileControls === "function" &&
      this.world.character.energy > 0 &&
      !(this.world.endboss && this.world.endboss.isDead)
    ) {
      this.world.drawMobileControls();
    }
  }
}
