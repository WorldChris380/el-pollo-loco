/**
 * Status bar for the number of collected bottles.
 * @class
 * @extends DrawableObject
 */
class StatusBarBottles extends DrawableObject {
  IMAGES_BOTTLES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  /**
   * Creates a new StatusBarBottles instance.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLES);
    this.img = this.images[this.IMAGES_BOTTLES[0]];
    this.x = 30;
    this.y = 100;
    this.height = 50;
    this.width = 200;
    this.setAmount(0);
  }

  /**
   * Sets the number of bottles and updates the image.
   * @param {number} amount
   */
  setAmount(amount) {
    this.amountOfBottlesOnGround = amount;
    let imagePath = this.IMAGES_BOTTLES[this.resolveImage()];
    this.img = this.images[imagePath];
  }

  /**
   * Determines the correct image for the current bottle count.
   * @returns {number}
   */
  resolveImage() {
    if (this.amountOfBottlesOnGround == 5) return 5;
    else if (this.amountOfBottlesOnGround == 4) return 4;
    else if (this.amountOfBottlesOnGround == 3) return 3;
    else if (this.amountOfBottlesOnGround == 2) return 2;
    else if (this.amountOfBottlesOnGround == 1) return 1;
    else return 0;
  }
}
