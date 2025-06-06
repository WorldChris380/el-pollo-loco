/**
 * Status bar for the number of collected coins.
 * @class
 * @extends DrawableObject
 */
class StatusBarCoins extends DrawableObject {
  IMAGES_STATUSBAR_COINS = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  amountOfCoins = 0;

  /**
   * Creates a new StatusBarCoins instance.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUSBAR_COINS);
    this.x = 30;
    this.y = 50;
    this.height = 50;
    this.width = 200;
    this.setAmountOfCoins(0);
  }

  /**
   * Sets the number of coins and updates the image.
   * @param {number} amountOfCoins
   */
  setAmountOfCoins(amountOfCoins) {
    this.amountOfCoins = amountOfCoins;
    let imagePath = this.IMAGES_STATUSBAR_COINS[this.resolveImage()];
    this.img = this.images[imagePath];
  }

  /**
   * Determines the correct image for the current coin count.
   * @returns {number}
   */
  resolveImage() {
    if (this.amountOfCoins == 5) return 5;
    else if (this.amountOfCoins == 4) return 4;
    else if (this.amountOfCoins == 3) return 3;
    else if (this.amountOfCoins == 2) return 2;
    else if (this.amountOfCoins == 1) return 1;
    else return 0;
  }
}
