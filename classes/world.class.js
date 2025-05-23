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
          if (soundOn) {
            coinAudio.currentTime = 0;
            coinAudio.play();
          }
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
        this.endboss.hit();
        this.statusBarEndboss.setPercentage(this.endboss.energy);
        bottle.break();
      }
    });
  }

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

    if (this.showTutorial) {
      this.drawTutorial();
    } else if (this.character.energy === 0) {
      this.drawGameOverImage();
    } else {
      this.drawSubButtons();
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
    }
    // Draw wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  drawGameOverImage() {
    if (!this.gameOverSoundPlayed) {
      if (!this.gameOverSoundPlayed && soundOn) {
        gameOverAudio.currentTime = 0;
        gameOverAudio.play();
        this.gameOverSoundPlayed = true;
      }
    }
    const img = new Image();
    img.src = "img/You won, you lost/Game over A.png";
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = 400;
    const height = 200;
    img.onload = () => {
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
    };
    if (img.complete) {
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
  }

  drawRestartButton(x, y) {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const btnX = x - buttonWidth / 2;
    const btnY = y;
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
    this.ctx.fillText("New game", x, btnY + buttonHeight / 2);
    this.ctx.restore();
    this.restartButtonArea = {
      x: btnX,
      y: btnY,
      width: buttonWidth,
      height: buttonHeight,
    };
  }

  addObjectsToCanvas(objects) {
    objects.forEach((obj) => {
      this.addToCanvas(obj);
    });
  }

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
    buttons.forEach((btn, i) => {
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
    });
  }

  drawTutorial() {
    // Hintergrund
    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.fillStyle = "#222";
    this.ctx.fillRect(60, 40, this.canvas.width - 120, this.canvas.height - 80);
    this.ctx.globalAlpha = 1;
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

    // Schließen-Button
    const btnWidth = 180;
    const btnHeight = 50;
    const btnX = this.canvas.width / 2 - btnWidth / 2;
    const btnY = this.canvas.height - 120;
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

    // Für Klickerkennung:
    this.tutorialCloseButton = {
      x: btnX,
      y: btnY,
      width: btnWidth,
      height: btnHeight,
    };
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
