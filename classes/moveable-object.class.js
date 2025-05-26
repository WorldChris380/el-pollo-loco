/**
 * Base class for all moveable objects in the game.
 * Contains methods for movement, collision, energy, and animation.
 * @class
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {
  otherDirection = false;
  speedY = 0;
  acceleration = 1;
  energy = 100;
  lastHit = 0;

  /**
   * Applies gravity to the object.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 150;
    }
  }

  /**
   * Checks if this object collides with another moveable object.
   * @param {MoveableObject} moveableObject
   * @returns {boolean}
   */
  isColliding(moveableObject) {
    return (
      this.x + this.width > moveableObject.x &&
      this.y + this.height > moveableObject.y &&
      this.x < moveableObject.x + moveableObject.width &&
      this.y < moveableObject.y + moveableObject.height
    );
  }

  /**
   * Reduces the object's energy when hit.
   */
  hit() {
    this.energy -= 0.05;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is dead.
   * @returns {boolean}
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks if the object was recently hit.
   * @returns {boolean}
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Makes the object jump.
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Plays an animation from an array of images.
   * @param {string[]} images - Array of image paths.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.images[path];
    this.currentImage++;
  }
}
