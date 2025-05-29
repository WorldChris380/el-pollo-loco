/**
 * Handles touch events for mobile controls and buttons.
 * @param {TouchEvent} e
 */
function handleTouch(e) {
  if (e.cancelable) e.preventDefault();
  if (!world) return;
  for (let touch of e.touches) {
    const { x, y } = getTouchPosition(touch);
    if (processTouch(x, y)) return;
  }
}

/**
 * Processes a single touch position for all button types.
 * @param {number} x
 * @param {number} y
 * @returns {boolean} True if a button was handled.
 * @private
 */
function processTouch(x, y) {
  if (handleMobileButtonTouch(x, y)) return true;
  if (checkHomeButton(x, y)) return true;
  if (checkRestartButton(x, y)) return true;
  if (checkTutorialClose(x, y)) return true;
  if (handleSubButtonsTouch(x, y)) return true;
  if (isFullscreenTouch(x, y)) return true;
  return false;
}

/**
 * Calculates the touch position relative to the canvas.
 * @param {Touch} touch
 * @returns {{x: number, y: number}}
 */
function getTouchPosition(touch) {
  const rect = canvas.getBoundingClientRect();
  const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
  const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
  return { x, y };
}

/**
 * Handles touch logic for mobile control buttons.
 * @param {number} x
 * @param {number} y
 * @returns {boolean} True if a mobile button was pressed.
 */
function handleMobileButtonTouch(x, y) {
  if (!world || !world.mobileButtons) return false;
  let hitMobileButton = false;
  world.mobileButtons.forEach((btn) => {
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      world.pressedButtons[btn.key] = true;
      keyboard[btn.key] = true;
      hitMobileButton = true;
    }
  });
  return hitMobileButton;
}

/**
 * Handles touch logic for the Game Over restart button.
 * @param {number} x
 * @param {number} y
 */
function handleRestartButtonTouch(x, y) {
  if (world && world.restartButtonArea && world.character.energy === 0) {
    const btn = world.restartButtonArea;
    if (
      x >= btn.x &&
      x <= btn.x + btn.width &&
      y >= btn.y &&
      y <= btn.y + btn.height
    ) {
      restartGame();
    }
  }
}

/**
 * Checks sub buttons on touch during the game.
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function handleSubButtonsTouchInGame(x, y) {
  if (world && world.subButtonAreas) {
    for (const btn of world.subButtonAreas) {
      if (isTouchOnButton(x, y, btn)) {
        return handleSubButtonAction(btn);
      }
    }
  }
  return false;
}

/**
 * Checks sub buttons on touch.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean}
 * @private
 */
function handleSubButtonsTouch(x, y) {
  if (world.subButtonAreas) {
    for (const btn of world.subButtonAreas) {
      if (isTouchOnButton(x, y, btn)) {
        return handleSingleSubButton(btn);
      }
    }
  }
  return false;
}

/**
 * Checks if the touch is within the button area.
 * @param {number} x
 * @param {number} y
 * @param {Object} btn
 * @returns {boolean}
 * @private
 */
function isTouchOnButton(x, y, btn) {
  return (
    x >= btn.x &&
    x <= btn.x + btn.width &&
    y >= btn.y &&
    y <= btn.y + btn.height
  );
}

/**
 * Handles the action for a touched sub button.
 * @param {Object} btn
 * @returns {boolean}
 * @private
 */
function handleSingleSubButton(btn) {
  if (btn.key === "tutorial") {
    world.showTutorial = true;
    if (typeof world.pause === "function") world.pause();
  }
  if (btn.key === "legal") window.location.href = "datenschutz.html";
  if (btn.key === "sound") {
    soundOn = !soundOn;
    handleSoundToggle();
  }
  if (btn.key === "fullscreen") toggleFullscreen(canvas);
  return true;
}

/**
 * Checks if the fullscreen button was touched and toggles fullscreen.
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 * @private
 */
function isFullscreenTouch(x, y) {
  if (
    typeof isFullscreenButton === "function" &&
    isFullscreenButton(x, y, canvas)
  ) {
    toggleFullscreen(canvas);
    return true;
  }
  return false;
}
