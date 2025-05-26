class Character extends MoveableObject {
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = ["img/2_character_pepe/5_dead/D-51.png"];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  speed = 10;
  world;

  // Sound-Objekte
  walkAudio = new Audio("audio/walk.wav");
  jumpAudio = new Audio("audio/huch.wav");
  hurtAudio = new Audio("audio/hurt.wav");

  isWalking = false;
  isJumping = false;
  lastHurtTime = 0;
  wasHurt = false;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.width = 165;
    this.height = 270;
    this.y = 0;
    this.applyGravity();
    this.walkAudio.loop = true;
  }

  isFallingOn(enemy) {
    return (
      this.speedY < 0 && this.y + this.height - enemy.y < 30 && this.y < enemy.y
    );
  }

  animate() {
    setInterval(() => {
      if (
        (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) ||
        (this.world.keyboard.LEFT && this.x > 0)
      ) {
        if (!this.isWalking) {
          this.playWalkSound();
        }
        if (this.world.keyboard.RIGHT) {
          this.moveRight();
          this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT) {
          this.moveLeft();
          this.otherDirection = true;
        }
      } else {
        this.stopWalkSound();
      }

      // JUMPING
      if (this.world.keyboard.UP && !this.isAboveGround()) {
        if (!this.isJumping) {
          this.playJumpSound();
        }
        this.jump();
      } else {
        this.isJumping = false;
      }

      this.world.camera_x = -this.x + 100;

      // Hurt-Status prüfen und Sound nur einmal abspielen
      if (this.isHurt()) {
        if (!this.wasHurt) {
          this.playHurtSound();
          this.wasHurt = true;
        }
      } else {
        this.wasHurt = false;
      }
    }, 5000 / 144);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        this.stopWalkSound();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 50);
  }

  playJumpSound() {
    if (soundOn && !this.isJumping) {
      this.isJumping = true;
      this.jumpAudio.currentTime = 0;
      this.jumpAudio.play();
    }
  }

  stopWalkSound() {
    if (!this.walkAudio.paused) {
      this.walkAudio.pause();
      this.walkAudio.currentTime = 0;
      this.isWalking = false;
    }
  }

  playHurtSound() {
    if (soundOn) {
      this.hurtAudio.currentTime = 0;
      this.hurtAudio.play();
    }
  }

  playWalkSound() {
    if (soundOn && this.walkAudio.paused) {
      this.walkAudio.currentTime = 0;
      this.walkAudio.play();
      this.isWalking = true;
    }
  }

  getCollisionBox() {
    const fakeHeight = this.height - 150;
    return {
      x: this.x,
      y: this.y + (this.height - fakeHeight),
      width: this.width,
      height: fakeHeight,
    };
  }

  isColliding(other) {
    const a = this.getCollisionBox ? this.getCollisionBox() : this;
    const b = other.getCollisionBox ? other.getCollisionBox() : other;
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }
}
