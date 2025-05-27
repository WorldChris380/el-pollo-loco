/**
 * Represents a chicken (enemy) in the game.
 * @class
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
  speed = 0.15 + Math.random() * 0.5;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  /**
   * Creates a new chicken at a random position.
   */
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 300 + Math.random() * 1000;
    this.y = 355;
    this.height = 70;
    this.width = 70;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.isDead = false;
  }

  /**
   * Kills the chicken (changes image and speed).
   */
  die() {
    this.isDead = true;
    this.img = this.images[this.IMAGES_DEAD[0]];
    this.speed = 0;
  }

  /**
   * Animates the chicken (walking and animation).
   */
  animate() {
    setInterval(() => {
      if (!this.isDead && this.world && !this.world.paused) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isDead && this.world && !this.world.paused) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }
}
