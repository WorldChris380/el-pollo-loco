class YellowChicken extends MoveableObject {
  speed = 0.25 + Math.random() * 0.5;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = 300 + Math.random() * 2000;
    this.y = 355;
    this.height = 70;
    this.width = 70;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.isDead = false;
  }

  /**
   * Kills the chicken (changes image and speed).
   */
  die() {
    this.isDead = true;
    this.img = this.images[this.IMAGES_DEAD[0]];
    this.speed = 0;
  }

  /**
   * Animates the chicken (walking, animation, and random jumps).
   */
  animate() {
    setInterval(() => {
      if (!this.isDead && this.world && !this.world.paused) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isDead && this.world && !this.world.paused) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);

    // Zufälliges Springen mit rekursivem Timeout
    const randomJump = () => {
      if (!this.isDead && this.world && !this.world.paused && this.y >= 355) {
        if (Math.random() < 0.5) { // 50% Chance pro Versuch
          this.jumpShort();
        }
      }
      // Nächstes Springen nach 0,7–1,5 Sekunden
      setTimeout(randomJump, 700 + Math.random() * 800);
    };
    randomJump();
  }

  /**
   * Lässt das Huhn kurz hochspringen.
   */
  jumpShort() {
    let startY = this.y;
    let jumpHeight = 20;
    let jumpUp = true;
    let jumpStep = 2;
    let interval = setInterval(() => {
      if (jumpUp) {
        this.y -= jumpStep;
        if (this.y <= startY - jumpHeight) {
          jumpUp = false;
        }
      } else {
        this.y += jumpStep;
        if (this.y >= startY) {
          this.y = startY;
          clearInterval(interval);
        }
      }
    }, 16); // ca. 60 FPS
  }
}
