/**
 * Represents a bottle lying on the ground in the game.
 * @class
 * @extends DrawableObject
 */
class BottlesGround extends DrawableObject {
  IMAGES_BOTTLES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new bottle at a random position.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLES_ON_GROUND);
    this.x = 250 + Math.random() * 1000;
    this.y = 355;
    this.height = 70;
    this.width = 80;
    this.setAmountOfBottles(this.amountOfBottlesOnGround);
  }

  /**
   * Returns a narrower collision box for the bottle.
   * @returns {{x:number, y:number, width:number, height:number}}
   */
  getCollisionBox() {
    const shrink = 40;
    return {
      x: this.x + shrink,
      y: this.y,
      width: this.width - 2 * shrink,
      height: this.height,
    };
  }

  /**
   * Sets the number of bottles and updates the image.
   * @param {number} amountOfBottlesOnGround
   */
  setAmountOfBottles(amountOfBottlesOnGround) {
    this.amountOfBottlesOnGround = amountOfBottlesOnGround;
    let imagePath =
      this.IMAGES_BOTTLES_ON_GROUND[
        Math.floor(Math.random() * this.IMAGES_BOTTLES_ON_GROUND.length)
      ];
    this.img = this.images[imagePath];
  }
}
