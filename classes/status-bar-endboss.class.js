/**
 * Status bar for the endboss's health.
 * @class
 * @extends DrawableObject
 */
class StatusBarEndboss extends DrawableObject {
  IMAGES_STATUSBAR_END_BOSS = [
    "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
  ];

  percentage = 100;

  /**
   * Creates a new StatusBarEndboss instance.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUSBAR_END_BOSS);
    this.x = 250;
    this.y = 0;
    this.height = 50;
    this.width = 200;
    this.setPercentage(100);
  }

  /**
   * Sets the endboss's health and updates the image.
   * @param {number} percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let imagePath = this.IMAGES_STATUSBAR_END_BOSS[this.resolveImage()];
    this.img = this.images[imagePath];
  }

  /**
   * Determines the correct image for the current endboss health.
   * @returns {number}
   */
  resolveImage() {
    if (this.percentage == 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}
