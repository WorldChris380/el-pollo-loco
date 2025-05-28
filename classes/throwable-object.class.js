/**
 * Represents a throwable object (bottle) in the game.
 * @class
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
  IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGE_BOTTLE_BROKEN = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  isBroken = false;
  brokenAnimationIndex = 0;
  rotationFrame = 0;

  /**
   * Creates a new throwable object.
   * @param {number} x - X position.
   * @param {number} y - Y position.
   * @param {boolean} otherDirection - Direction.
   * @param {World} world - The game world.
   */
  constructor(x, y, otherDirection, world) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.loadImages(this.IMAGES);
    this.loadImages(this.IMAGE_BOTTLE_BROKEN);
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.x = x;
    this.y = y;
    this.height = 70;
    this.width = 80;
    this.world = world;
    this.rotationFrame = 0;
    this.startRotationAnimation();
    this.throw();
    this.otherDirection = otherDirection;
  }

  /**
   * Breaks the bottle and plays animation/sound.
   */
  break() {
    if (this.isBroken) return;
    this.isBroken = true;
    this.speed = 0;
    this.speedY = 0;
    this.brokenAnimationIndex = 0;
    if (soundOn) {
      bottleBreakAudio.currentTime = 0;
      bottleBreakAudio.play();
    }
    this.playBrokenAnimation();
  }

  /**
   * Plays the breaking animation and removes the object AFTER the animation.
   */
  playBrokenAnimation() {
    let animationInterval = setInterval(() => {
      if (this.brokenAnimationIndex < this.IMAGE_BOTTLE_BROKEN.length) {
        this.img =
          this.images[this.IMAGE_BOTTLE_BROKEN[this.brokenAnimationIndex]];
        this.brokenAnimationIndex++;
      } else {
        clearInterval(animationInterval);
        if (this.world && this.world.throwableObjects) {
          let idx = this.world.throwableObjects.indexOf(this);
          if (idx > -1) this.world.throwableObjects.splice(idx, 1);
        }
      }
    }, 50);
  }

  /**
   * Throws the bottle and animates its trajectory.
   */
  throw() {
    if (this.world.character.isSleeping) this.wakeCharacter();
    this.speedY = 18;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (!this.isBroken) {
        this.moveBottle();
        this.checkEnemyCollision();
        if (this.y >= 355) this.break();
      }
    }, 25);
  }
  /**
   * Spinning the bottle while it is thrown.
   */
  draw(ctx) {
    super.draw(ctx);
  }

  /**
   * Starts the bottle rotation animation while flying.
   */
  startRotationAnimation() {
    this.rotationInterval = setInterval(() => {
      if (!this.isBroken) {
        this.rotationFrame =
          (this.rotationFrame + 1) % this.IMAGES_BOTTLE_ROTATION.length;
        this.img = this.images[this.IMAGES_BOTTLE_ROTATION[this.rotationFrame]];
      } else {
        clearInterval(this.rotationInterval);
      }
    }, 60); // 60ms pro Frame, ca. 16 FPS
  }

  /**
   * Wakes up the character if sleeping.
   */
  wakeCharacter() {
    this.world.character.isSleeping = false;
    this.world.character.lastActionTime = Date.now();
    this.world.character.playAnimation(this.world.character.IMAGES_IDLE);
  }

  /**
   * Moves the bottle in the correct direction.
   */
  moveBottle() {
    if (this.otherDirection) this.x -= 6;
    else this.x += 6;
  }

  /**
   * Checks collision with enemies using a slimmer hitbox.
   */
  checkEnemyCollision() {
    if (this.world && this.world.enemies) {
      this.world.enemies.forEach((enemy) => {
        if (
          this.isCollidingWithSlimEnemy(enemy) &&
          !enemy.isDead &&
          !(enemy instanceof Endboss)
        ) {
          if (typeof enemy.die === "function") enemy.die();
          else {
            enemy.isDead = true;
            if (enemy.handleDeadAnimation) enemy.handleDeadAnimation();
          }
          this.break();
        }
      });
    }
  }

  /**
   * Checks collision with a slimmer enemy hitbox.
   * @param {Object} enemy
   * @returns {boolean}
   */
  isCollidingWithSlimEnemy(enemy) {
    const shrink = 20;
    const a = this.getCollisionBox();
    const b = {
      x: enemy.x + shrink,
      y: enemy.y,
      width: enemy.width - 2 * shrink,
      height: enemy.height,
    };
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  /**
   * Returns a narrower collision box for the bottle.
   * @returns {{x:number, y:number, width:number, height:number}}
   */
  getCollisionBox() {
    const shrink = 30;
    return {
      x: this.x + shrink,
      y: this.y,
      width: this.width - 2 * shrink,
      height: this.height,
    };
  }
}
