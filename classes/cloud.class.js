/**
 * Represents a cloud in the game.
 * @class
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
  y = 20;
  height = 350;
  width = 500;
  speed = 0.15;

  /**
   * Creates a new cloud at a random position.
   */
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.moveLeft();
  }

  /**
   * Animates the cloud (moves it to the left).
   */
  animate() {
    this.moveLeft();
  }
}
