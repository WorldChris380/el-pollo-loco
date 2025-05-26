/**
 * Represents a background image in the game.
 * @class
 * @extends MoveableObject
 */
class Background extends MoveableObject {
  height = 480;
  width = 720;

  /**
   * Creates a new Background object.
   * @param {string} imagePath - Path to the background image.
   * @param {number} x - X position of the background.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
