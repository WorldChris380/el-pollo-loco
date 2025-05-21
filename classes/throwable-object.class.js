class ThrowableObject extends MoveableObject {
  IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y, otherDirection) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png"
    );
    this.x = x;
    this.y = y;
    this.height = 70;
    this.width = 80;
    this.throw();
    this.otherDirection = otherDirection;
  }

  throw() {
    this.collectedBottles--;
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      if (this.otherDirection) {
        this.x -= 10;
      } else {
        console.log(this.otherDirection);
        
        this.x += 10;
      }
    }, 25);
  }
}
