/**
 * Represents the endboss in the game.
 * @class
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
  height = 450;
  width = 300;
  y = 0;
  hadFirstContact = false;
  speed = 6;
  energy = 100;
  isDead = false;
  lastHitSound = 0;

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

  /**
   * Creates a new Endboss.
   * @param {World} world - The current game world.
   */
  constructor(world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);

    this.x = 1500;
    this.world = world;
    this.endboss = world.endboss;
    this.animate();
  }

  /**
   * Reduces the endboss's energy when hit.
   */
  hit() {
    if (this.isDead) return;
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
      this.isDead = true;
    }
    const now = Date.now();
    if (
      soundOn &&
      this.world &&
      this.world.character &&
      this.world.character.energy > 0 &&
      (endbossWalkAudio.paused || endbossWalkAudio.ended) &&
      now - this.lastHitSound > 1000
    ) {
      endbossWalkAudio.currentTime = 0;
      endbossWalkAudio.play();
      this.lastHitSound = now;
    }
  }

  /**
   * Moves the endboss to the left (no sound here anymore).
   */
  moveEndbossLeft() {
    this.x -= this.speed;
  }

  /**
   * Stops the endboss walk sound.
   */
  stopEndbossWalk() {
    if (!endbossWalkAudio.paused) {
      endbossWalkAudio.pause();
      endbossWalkAudio.currentTime = 0;
    }
  }

  /**
   * Animates the endboss (walking, attacking, dying).
   */
  animate() {
    let i = 0;
    setInterval(() => {
      if (this.isDead) {
        this.stopEndbossWalk();
        return;
      }
      if (this.world.character.x > 1000 || this.hadFirstContact) {
        this.hadFirstContact = true;
        this.moveEndbossLeft();
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.stopEndbossWalk();
        this.playAnimation(this.IMAGES_WALKING);
      }
      i++;
          }, 200);
  }

  /**
   * Draws a frame around the endboss.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawFrame(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.strokeStyle = "blue";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Returns the endboss's collision box.
   * The collision box is thinner on both the left and right sides than the visible sprite.
   * @returns {{x:number, y:number, width:number, height:number}}
   */
  getCollisionBox() {
    return {
      x: this.x + 50,
      y: this.y,
      width: this.width - 100,
      height: this.height,
    };
  }
}
