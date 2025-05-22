class Endboss extends MoveableObject {
  height = 450;
  width = 300;
  y = 0;
  hadFirstContact = false;
  speed = 6;
  energy = 100;
  isDead = false;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);

    this.x = 1500;
    this.world = world;
    this.endboss = world.endboss;
    this.animate();
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
      this.isDead = true;
    }
  }

  moveEndbossLeft() {
    this.x -= this.speed;
  }

  animate() {
    let i = 0;
    setInterval(() => {
      if (this.world.character.x > 1000) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
      i++;
      if (this.world.endboss.x > 1000 && !this.hadFirstContact) {
        i = 0;
        this.hadFirstContact = true;
      }
    }, 200);
  }
  
  drawFrame(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "blue";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.restore();
  }
}
