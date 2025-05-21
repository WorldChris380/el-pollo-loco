class World {
  character = new Character();
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
  bottlesOnGround = [];
  throwableObjects = [];
  collectedBottles = 0;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
    this.createBottlesOnGround();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 180);
  }

  checkThrowObjects() {
    if (this.keyboard.ENTER) {
      if (this.collectedBottles > 0) {
        this.collectedBottles--;
        this.statusBarBottles.setAmount(this.collectedBottles);
        let bottle = new ThrowableObject(
          this.character.x + 100,
          this.character.y + 100,
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

  bottlesAvailable() {
    return this.collectedBottles;
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
        this.collidingWithBottles();
      }),
        200;
    });
  }

  createBottlesOnGround() {
    for (let i = 0; i < 10; i++) {
      let bottle = new BottlesGround();
      this.bottlesOnGround.push(bottle);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToCanvas(this.level.background);
    this.ctx.translate(-this.camera_x, 0);

    // Space for fixed objects
    this.addObjectsToCanvas(this.level.clouds);
    this.addToCanvas(this.statusBar);
    this.addToCanvas(this.statusBarCoins);
    this.addToCanvas(this.statusBarBottles);

    this.ctx.translate(this.camera_x, 0);

    // Space for moving objects
    this.addObjectsToCanvas(this.bottlesOnGround);
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
