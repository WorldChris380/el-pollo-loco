class StatusBarBottles extends DrawableObject {
  IMAGES_BOTTLES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  amountOfBottlesOnGround = DrawableObject.prototype.amountOfBottlesOnGround;

  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLES);
    this.img  = this.images[this.IMAGES_BOTTLES[0]];
    this.x = 30;
    this.y = 100;
    this.height = 50;
    this.width = 200;
  }

  resolveImage() {
    if (this.amountOfBottlesOnGround == 100) {
      return 5;
    } else if (this.amountOfBottlesOnGround > 80) {
      return 4;
    } else if (this.amountOfBottlesOnGround > 60) {
      return 3;
    } else if (this.amountOfBottlesOnGround > 40) {
      return 2;
    } else if (this.amountOfBottlesOnGround > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
