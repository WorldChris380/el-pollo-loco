window.CharacterAnimations = {
  /**
   * Handles the jump animation logic.
   * @param {number} now - Current timestamp.
   */
  handleJumpAnimation(now) {
    if (!this.jumpAnimActive && this.jumpAnimFrame === 0) {
      this.jumpPhase = "up";
      this.jumpAnimActive = true;
      this.lastJumpAnimTime = now;
      this.jumpAnimFrame = 0;
    }
    if (
      this.jumpPhase === "up" &&
      (this.speedY <= 0 || this.jumpAnimFrame >= this.IMAGES_JUMPING_UP.length)
    ) {
      this.jumpPhase = "down";
      this.jumpAnimFrame = 0;
      this.lastJumpAnimTime = now;
    }
    if (this.shouldAdvanceJumpFrame(now)) {
      if (this.jumpPhase === "up") this.setJumpUpFrame();
      else if (this.jumpPhase === "down") this.setJumpFallingFrame();
      this.lastJumpAnimTime = now;
    }
    if (!this.isAboveGround()) this.finishJumpAnimation();
    this.isSleeping = false;
  },

  /**
   * Starts the animation and movement intervals.
   */
  animate() {
    setInterval(() => {
      this.handleMovement();
      this.handleJump();
      if (!this.isDead()) {
        this.world.camera_x = -this.x + 100;
      }
      this.handleHurt();
    }, 5000 / 144);

    setInterval(() => {
      this.handleAnimation();
    }, 50);
  },

  /**
   * Handles movement logic.
   * @private
   */
  handleMovement() {
    const endboss = this.world.endboss;
    let maxRight = endboss ? endboss.x - this.width : this.world.level.level_end_x;

    if (
      (this.world.keyboard.RIGHT && this.x < maxRight) ||
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
  },

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
  },

  /**
   * Sets the current frame for the jump up animation.
   * @private
   */
  setJumpUpFrame() {
    const path =
      this.IMAGES_JUMPING_UP[
        Math.min(this.jumpAnimFrame, this.IMAGES_JUMPING_UP.length - 1)
      ];
    this.img = this.images[path];
    this.jumpAnimFrame++;
  },

  /**
   * Sets the current frame for the falling animation.
   * @private
   */
  setJumpFallingFrame() {
    const path =
      this.IMAGES_JUMPING_FALLING[
        Math.min(this.jumpAnimFrame, this.IMAGES_JUMPING_FALLING.length - 1)
      ];
    this.img = this.images[path];
    this.jumpAnimFrame++;
  },

  finishJumpAnimation() {
    this.jumpAnimActive = false;
    this.jumpAnimFrame = 0;
    this.jumpPhase = null;
  },

  /**
   * Checks if the jump animation frame should advance.
   * @param {number} now - Current timestamp.
   * @returns {boolean}
   * @private
   */
  shouldAdvanceJumpFrame(now) {
    return now - this.lastJumpAnimTime > 300 && this.jumpAnimActive;
  },

  /**
   * Handles animation frames.
   * Splits logic into smaller helper functions.
   * @private
   */
  handleAnimation() {
    const now = Date.now();

    if (this.isDead()) {
      this.handleDeadAnimation();
      return;
    }

    if (this.isHurt()) {
      this.handleHurtAnimation(now);
      return;
    }

    if (this.isAboveGround()) {
      this.handleJumpAnimation(now);
      return;
    }

    this.handleGroundAnimation(now);
  },

  /**
   * Handles animation when character is dead.
   * @private
   */
  handleDeadAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
    this.stopWalkSound();
    this.isSleeping = false;
    this.jumpInitiated = false;
  },

  /**
   * Handles animation when character is hurt.
   * @param {number} now - Current timestamp.
   * @private
   */
  handleHurtAnimation(now) {
    this.playAnimation(this.IMAGES_HURT);
    this.isSleeping = false;
    this.lastActionTime = now;
    this.jumpInitiated = false;
  },

  /**
   * Handles animation when character is on the ground.
   * @param {number} now - Current timestamp.
   * @private
   */
  handleGroundAnimation(now) {
    this.isJumping = false;
    this.jumpInitiated = false;
    this.jumpAnimActive = false;
    this.jumpAnimFrame = 0;
    this.lastJumpAnimTime = 0;

    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      this.isSleeping = false;
    } else {
      this.handleIdleOrSleep(now);
    }
  },

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
  },
};
