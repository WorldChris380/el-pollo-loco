class BottlesGround extends DrawableObject {
  IMAGES_BOTTLES_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor() {
    super();
    this.amountOfBottlesOnGround = 10;
    this.loadImages(this.IMAGES_BOTTLES_ON_GROUND);
    this.x = 100 + Math.random() * 1000;
    this.y = 355;
    this.height = 70;
    this.width = 80;
    this.setAmountOfBottles(this.amountOfBottlesOnGround);
  }

  setAmountOfBottles(amountOfBottlesOnGround) {
    this.amountOfBottlesOnGround = amountOfBottlesOnGround;
    let imagePath = this.IMAGES_BOTTLES_ON_GROUND[0];
    this.img = this.images[imagePath];
  }

  
}
