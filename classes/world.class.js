class World {
  character;
  background = level1.background;
  clouds = level1.clouds;
  enemies = level1.enemies;
  ctx;
  canvas;
  camera_x = 0;
  level = level1;
  statusBar = new StatusBar();
  statusBarCoins = new StatusBarCoins();
  statusBarBottles = new StatusBarBottles();
  statusBarEndboss = new StatusBarEndboss();
  bottlesOnGround = [];
  throwableObjects = [];
  collectedBottles = 0;
  coins = [];
  collectedCoins = 0;

  constructor(canvas) {
    this.character = new Character();
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
    this.createBottlesOnGround();
    this.createCoins();
    this.endboss = new Endboss(this);
    this.level.enemies.push(this.endboss);
    console.log(this.level.enemies);
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkBottleHitsEndboss();
      this.checkThrowObjects();
    }, 180);
  }

  checkThrowObjects() {
    if (this.keyboard.ENTER) {
      if (this.collectedBottles > 0) {
        this.collectedBottles--;
        this.statusBarBottles.setAmount(this.collectedBottles);
        let offsetX = this.character.otherDirection ? -50 : 50;

        let bottle = new ThrowableObject(
          this.character.x + offsetX,
          this.character.y + this.character.height - 70,
          this.character.otherDirection
        );
        this.throwableObjects.push(bottle);
      }
    }
  }

  collidingWithBottles() {
    if (this.bottlesOnGround.length > 0) {
      for (let i = this.bottlesOnGround.length - 1; i >= 0; i--) {
        if (this.character.isCollidingWithDrawable(this.bottlesOnGround[i])) {
          this.bottlesOnGround.splice(i, 1);
          this.collectedBottles++;
          this.statusBarBottles.setAmount(this.collectedBottles);
        }
      }
    }
  }

  collidingWithCoins() {
    if (this.coins.length > 0) {
      for (let i = this.coins.length - 1; i >= 0; i--) {
        if (this.character.isCollidingWithDrawable(this.coins[i])) {
          this.coins.splice(i, 1);
          this.collectedCoins++;
          this.statusBarCoins.setAmountOfCoins(this.collectedCoins);
        }
      }
    }
  }

  checkBottleHitsEndboss() {
    this.throwableObjects.forEach((bottle) => {
      if (
        this.endboss &&
        this.isColliding(bottle, this.endboss) &&
        !this.endboss.isDead &&
        !bottle.isBroken
      ) {
        console.log("Kollision: Bottle trifft Endboss!");
        this.endboss.hit();
        this.statusBarEndboss.setPercentage(this.endboss.energy);
        bottle.break();
      }
    });
  }

  // Hilfsfunktion für generische Kollision
  isColliding(obj1, obj2) {
    return (
      obj1.x + obj1.width > obj2.x &&
      obj1.y + obj1.height > obj2.y &&
      obj1.x < obj2.x + obj2.width &&
      obj1.y < obj2.y + obj2.height
    );
  }

  bottlesAvailable() {
    return this.collectedBottles;
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          if (enemy.isDead) {
            return;
          }
          if (this.character.isFallingOn(enemy)) {
            enemy.die();
          } else {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
          }
        }
      });
      this.collidingWithBottles();
      this.collidingWithCoins();
    }, 200);
  }
  createBottlesOnGround() {
    for (let i = 0; i < 10; i++) {
      let bottle = new BottlesGround();
      this.bottlesOnGround.push(bottle);
    }
  }

  createCoins() {
    for (let i = 0; i < 10; i++) {
      let coin = new Coins();
      this.coins.push(coin);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToCanvas(this.level.background);
    this.ctx.translate(-this.camera_x, 0);
    this.fullscreen();
    this.addObjectsToCanvas(this.level.clouds);
    this.addToCanvas(this.statusBar);
    this.addToCanvas(this.statusBarCoins);
    this.addToCanvas(this.statusBarBottles);
    this.addToCanvas(this.statusBarEndboss);
    this.ctx.translate(this.camera_x, 0);
    // Space for moving objects
    this.addObjectsToCanvas(this.bottlesOnGround);
    this.addObjectsToCanvas(this.coins);
    this.addToCanvas(this.character);
    this.addObjectsToCanvas(this.level.enemies);
    this.addObjectsToCanvas(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    // Draw wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  fullscreen() {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 255, 0.7)";
    this.ctx.fillRect(
      this.canvas.width - 160,
      this.canvas.height - 60,
      150,
      40
    );
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(
      "Fullscreen",
      this.canvas.width - 140,
      this.canvas.height - 32
    );
    this.ctx.restore();
  }

  addObjectsToCanvas(objects) {
    objects.forEach((Object) => {
      this.addToCanvas(Object);
    });
  }

  addToCanvas(moveableObject, bottle) {
    if (moveableObject.otherDirection) {
      this.flipImage(moveableObject);
    }

    moveableObject.draw(this.ctx);
    moveableObject.drawFrame(this.ctx);

    this.ctx.drawImage(
      moveableObject.img,
      moveableObject.x,
      moveableObject.y,
      moveableObject.width,
      moveableObject.height
    );
    if (moveableObject.otherDirection) {
      this.flipImageBack(moveableObject);
    }
  }

  flipImage(moveableObject) {
    this.ctx.save();
    this.ctx.translate(moveableObject.width, 0);
    this.ctx.scale(-1, 1);
    moveableObject.x = moveableObject.x * -1;
  }

  flipImageBack(moveableObject) {
    this.ctx.restore();
    moveableObject.x = moveableObject.x * -1;
  }
}
