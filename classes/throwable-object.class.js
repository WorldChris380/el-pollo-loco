class ThrowableObject extends MoveableObject {
  IMAGES = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGE_BOTTLE_BROKEN = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  isBroken = false;
  brokenAnimationIndex = 0;

  constructor(x, y, otherDirection, world) {
    super().loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.loadImages(this.IMAGE_BOTTLE_BROKEN);
    this.x = x;
    this.y = y;
    this.height = 70;
    this.width = 80;
    this.throw();
    this.otherDirection = otherDirection;
    this.world = world;
  }

  break() {
    if (this.isBroken) return;
    this.isBroken = true;
    this.speed = 0;
    this.speedY = 0;
    this.brokenAnimationIndex = 0;
    this.playBrokenAnimation();
  }

  playBrokenAnimation() {
    let interval = setInterval(() => {
      if (this.brokenAnimationIndex < this.IMAGE_BOTTLE_BROKEN.length) {
        this.img = this.images[this.IMAGE_BOTTLE_BROKEN[this.brokenAnimationIndex]];
        this.brokenAnimationIndex++;
      } else {
        clearInterval(interval);
        // Nach Animation aus dem Array entfernen
        if (this.world && this.world.throwableObjects) {
          let idx = this.world.throwableObjects.indexOf(this);
          if (idx > -1) this.world.throwableObjects.splice(idx, 1);
        }
      }
    }, 50);
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (!this.isBroken) {
        if (this.otherDirection) {
          this.x -= 10;
        } else {
          this.x += 10;
        }
        // Prüfe auf Boden-Kontakt (z.B. y >= 355)
        if (this.y >= 355) {
          this.break();
        }
      }
    }, 25);
  }
}
