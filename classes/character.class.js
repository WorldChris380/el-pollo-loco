/**
 * The Character class represents the playable character.
 * It contains animations, sounds, movement logic, and collision detection.
 * @class
 * @extends MoveableObject
 */
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

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_SLEEPING = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_DEAD = ["img/2_character_pepe/5_dead/D-51.png"];
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
  speed = 10;
  world;
  walkAudio = new Audio("audio/walk.wav");
  jumpAudio = new Audio("audio/huch.wav");
  hurtAudio = new Audio("audio/hurt.wav");
  isWalking = false;
  isJumping = false;
  lastHurtTime = 0;
  wasHurt = false;
  lastActionTime = 0;
  isSleeping = false;
  jumpAnimFrame = 0;
  jumpAnimActive = false;
  jumpInitiated = false;
  lastJumpAnimTime = 0;

  /**
   * Initializes the character, loads images and sounds.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.width = 165;
    this.height = 270;
    this.y = 0;
    this.applyGravity();
    this.walkAudio.loop = true;
    this.lastActionTime = Date.now();
  }

  /**
   * Checks if the character is falling on an enemy.
   * @param {MoveableObject} enemy
   * @returns {boolean}
   */
  isFallingOn(enemy) {
    return (
      this.speedY < 0 && this.y + this.height - enemy.y < 30 && this.y < enemy.y
    );
  }

  /**
   * Starts the animation and movement intervals.
   */
  animate() {
    setInterval(() => {
      this.handleMovement();
      this.handleJump();
      this.world.camera_x = -this.x + 100;
      this.handleHurt();
    }, 5000 / 144);

    setInterval(() => {
      this.handleAnimation();
    }, 50);
  }

  /**
   * Handles movement logic.
   * @private
   */
  handleMovement() {
    if (
      (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) ||
      (this.world.keyboard.LEFT && this.x > 0)
    ) {
      if (!this.isWalking) this.playWalkSound();
      if (this.world.keyboard.RIGHT) {
        this.moveRight();
        this.otherDirection = false;
      }
      if (this.world.keyboard.LEFT) {
        this.moveLeft();
        this.otherDirection = true;
      }
      this.lastActionTime = Date.now();
      this.isSleeping = false;
    } else {
      this.stopWalkSound();
    }
  }

  /**
   * Handles jump logic.
   * @private
   */
  handleJump() {
    if (this.world.keyboard.UP && !this.isAboveGround() && !this.isJumping) {
      this.jump();
      this.lastActionTime = Date.now();
      this.isSleeping = false;
      this.playJumpSound();
      this.jumpInitiated = true;
      this.jumpAnimFrame = 0;
      this.jumpAnimActive = true;
    }
  }

  /**
   * Handles hurt status and sound.
   * @private
   */
  handleHurt() {
    if (this.isHurt()) {
      if (!this.wasHurt) {
        this.playHurtSound();
        this.wasHurt = true;
      }
    } else {
      this.wasHurt = false;
    }
  }

  /**
   * Handles animation frames.
   * @private
   */
  handleAnimation() {
    const now = Date.now();

    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.stopWalkSound();
      this.isSleeping = false;
      this.jumpInitiated = false;
      return;
    }

    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.isSleeping = false;
      this.lastActionTime = now;
      this.jumpInitiated = false;
      return;
    }

    if (this.isAboveGround()) {
        if (!this.jumpAnimActive && this.jumpAnimFrame === 0) {
            this.jumpAnimActive = true;
            this.lastJumpAnimTime = now;
        }

        const jumpAnimSpeed = 50;
        if (this.jumpAnimActive && this.jumpAnimFrame < this.IMAGES_JUMPING.length) {
            if (!this.lastJumpAnimTime || now - this.lastJumpAnimTime > jumpAnimSpeed) {
                this.img = this.images[this.IMAGES_JUMPING[this.jumpAnimFrame]];
                this.jumpAnimFrame++;
                this.lastJumpAnimTime = now;
            }
        } else {
            this.img = this.images[this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1]];
            this.jumpAnimActive = false;
        }
        this.isSleeping = false;
        return;
    } else {
        this.isJumping = false;
        this.jumpInitiated = false;
        this.jumpAnimActive = false;
        this.jumpAnimFrame = 0;
        this.lastJumpAnimTime = 0;

        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
          this.isSleeping = false;
        } else {
          const timeSinceLastAction = now - this.lastActionTime;
          if (timeSinceLastAction > 3000) {
            this.playAnimation(this.IMAGES_SLEEPING);
            this.isSleeping = true;
            this.stopWalkSound();
          } else {
            this.playAnimation(this.IMAGES_IDLE);
            this.isSleeping = false;
          }
        }
      }
  }

  /**
   * Plays the jump sound.
   */
  playJumpSound() {
    if (soundOn && !this.isJumping) {
      this.isJumping = true;
      this.jumpAudio.currentTime = 0;
      this.jumpAudio.play();
    }
  }

  /**
   * Stops the walk sound.
   */
  stopWalkSound() {
    if (!this.walkAudio.paused) {
      this.walkAudio.pause();
      this.walkAudio.currentTime = 0;
      this.isWalking = false;
    }
  }

  /**
   * Plays the hurt sound.
   */
  playHurtSound() {
    if (soundOn) {
      this.hurtAudio.currentTime = 0;
      this.hurtAudio.play();
    }
  }

  /**
   * Plays the walk sound.
   */
  playWalkSound() {
    if (soundOn && this.walkAudio.paused) {
      this.walkAudio.currentTime = 0;
      this.walkAudio.play();
      this.isWalking = true;
    }
  }

  /**
   * Returns the character's collision box.
   * The collision box is 20px thinner on both the left and right sides than the visible sprite.
   * @returns {{x:number, y:number, width:number, height:number}}
   */
  getCollisionBox() {
    const fakeHeight = this.height - 150;
    return {
      x: this.x + 60,
      y: this.y + (this.height - fakeHeight),
      width: this.width - 120,
      height: fakeHeight,
    };
  }

  /**
   * Checks if the character collides with another object.
   * @param {Object} other
   * @returns {boolean}
   */
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
