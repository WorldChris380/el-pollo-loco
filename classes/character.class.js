/**
 * The Character class represents the playable character.
 * It contains animations, sounds, movement logic, and collision detection.
 * Most animation and movement logic is delegated to the CharacterAnimations object.
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

  IMAGES_JUMPING_UP = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
  ];

  IMAGES_JUMPING_FALLING = [
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
  jumpPhase = null;

  /**
   * Initializes the character, loads images and sounds.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING_UP);
    this.loadImages(this.IMAGES_JUMPING_FALLING);
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
   * Handles idle or sleep animation depending on inactivity.
   * @param {number} now - Current timestamp.
   * @private
   */
  handleIdleOrSleep(now) {
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

  /**
   * Plays the jump sound.
   */
  playJumpSound() {
    if (soundOn && this.jumpAudio.paused) {
      this.jumpAudio.currentTime = 0;
      this.jumpAudio.play().catch(() => {});
      this.isJumping = true;
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
    if (soundOn && this.hurtAudio.paused) {
      this.hurtAudio.currentTime = 0;
      this.hurtAudio.play().catch(() => {});
    }
  }

  /**
   * Plays the walk sound.
   */
  playWalkSound() {
    if (soundOn && this.walkAudio.paused) {
      this.walkAudio.currentTime = 0;
      this.walkAudio.play().catch(() => {});
      this.isWalking = true;
    }
  }

  /**
   * Returns the character's collision box.
   * The collision box is 20px thinner on both the left and right sides than the visible sprite.
   * @returns {{x:number, y:number, width:number, height:number}}
   */
  getCollisionBox() {
    const fakeHeight = this.height - 130;
    return {
      x: this.x + 40,
      y: this.y + (this.height - fakeHeight),
      width: this.width - 80,
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

  /**
   * Handles the jump animation logic.
   * Delegates to CharacterAnimations.
   * @param {number} now - Current timestamp.
   */
  handleJumpAnimation(now) {
    window.CharacterAnimations.handleJumpAnimation.call(this, now);
  }

  /**
   * Handles character movement logic.
   * Delegates to CharacterAnimations.
   */
  handleMovement() {
    window.CharacterAnimations.handleMovement.call(this);
  }

  /**
   * Handles the main animation logic.
   * Delegates to CharacterAnimations.
   */
  handleAnimation() {
    window.CharacterAnimations.handleAnimation.call(this);
  }

  /**
   * Handles the jump logic (jump initiation).
   * Delegates to CharacterAnimations.
   */
  handleJump() {
    window.CharacterAnimations.handleJump.call(this);
  }

  /**
   * Determines if the jump frame should advance.
   * Delegates to CharacterAnimations.
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   */
  shouldAdvanceJumpFrame(now) {
    return window.CharacterAnimations.shouldAdvanceJumpFrame.call(this, now);
  }

  /**
   * Sets the current frame for the jump up animation.
   * Delegates to CharacterAnimations.
   */
  setJumpUpFrame() {
    window.CharacterAnimations.setJumpUpFrame.call(this);
  }

  /**
   * Sets the current frame for the falling animation.
   * Delegates to CharacterAnimations.
   */
  setJumpFallingFrame() {
    window.CharacterAnimations.setJumpFallingFrame.call(this);
  }

  /**
   * Handles hurt status and sound.
   * Delegates to CharacterAnimations.
   */
  handleHurt() {
    window.CharacterAnimations.handleHurt.call(this);
  }

  /**
   * Starts the animation and movement intervals.
   * Delegates to CharacterAnimations.
   */
  animate() {
    window.CharacterAnimations.animate.call(this);
  }

  /**
   * Handles animation when character is on the ground.
   * Delegates to CharacterAnimations.
   * @param {number} now - Current timestamp.
   */
  handleGroundAnimation(now) {
    window.CharacterAnimations.handleGroundAnimation.call(this, now);
  }

  /**
   * Handles animation when character is hurt.
   * Delegates to CharacterAnimations.
   * @param {number} now - Current timestamp.
   */
  handleHurtAnimation(now) {
    window.CharacterAnimations.handleHurtAnimation.call(this, now);
  }

  /**
   * Handles actions when character is dead.
   * Delegates to CharacterAnimations.
   */
  handleDeadAnimation() {
    window.CharacterAnimations.handleDeadAnimation.call(this);
  }
}
