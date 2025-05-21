class BottlesGround extends DrawableObject {
  IMAGES_BOTTLES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLES_ON_GROUND);
    this.x = 250 + Math.random() * 1000;
    this.y = 355;
    this.height = 70;
    this.width = 80;
    this.setAmountOfBottles(this.amountOfBottlesOnGround);
    // if (checkCollisions()) {
    //   this.removeBottle;
    // }
  }

  removeBottle() {}

  setAmountOfBottles(amountOfBottlesOnGround) {
    this.amountOfBottlesOnGround = amountOfBottlesOnGround;
    let imagePath =
      this.IMAGES_BOTTLES_ON_GROUND[
        Math.floor(Math.random() * this.IMAGES_BOTTLES_ON_GROUND.length)
      ];
    this.img = this.images[imagePath];
  }
}
