class Coins extends DrawableObject {
  IMAGES_COINS = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor() {
    super().loadImages(this.IMAGES_COINS);
    this.x = 200 + Math.random() * 1000;
    this.y = 150 + Math.random() * 100;
    this.height = 70;
    this.width = 70;
    this.setAmountOfCoins(this.amountOfCoins);
  }

  setAmountOfCoins(amountOfCoins) {
    this.amountOfCoins = amountOfCoins;
    let imagePath =
      this.IMAGES_COINS[Math.floor(Math.random() * this.IMAGES_COINS.length)];
    this.img = this.images[imagePath];
  }
}
