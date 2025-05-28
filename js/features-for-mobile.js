/**
 * Handles touch events for mobile controls and restart button.
 * @param {TouchEvent} e
 */
function handleTouch(e) {
  if (e.cancelable) e.preventDefault();
  if (!world) return;
  for (let touch of e.touches) {
    const rect = canvas.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;

    // 1. Mobile Steuerung zuerst prüfen!
    if (handleMobileButtonTouch(x, y)) return;

    // 2. Dann Home/Restart/Tutorial prüfen
    if (checkHomeButton(x, y)) return;
    if (checkRestartButton(x, y)) return;
    if (checkTutorialClose(x, y)) return;

    // 3. SubButtons (Sound, Fullscreen, etc.)
    if (handleSubButtonsTouch(x, y)) return;
    if (
      typeof isFullscreenButton === "function" &&
      isFullscreenButton(x, y, canvas)
    ) {
      toggleFullscreen(canvas);
      return;
    }
  }
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
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        if (btn.key === "tutorial") world.showTutorial = true;
        if (btn.key === "legal") window.location.href = "datenschutz.html";
        if (btn.key === "sound") {
          soundOn = !soundOn;
          handleSoundToggle();
        }
        if (btn.key === "fullscreen") toggleFullscreen(canvas);
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks mobile control buttons on touch.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean}
 * @private
 */
function handleMobileButtons(x, y) {
  let hit = false;
  world.mobileButtons.forEach((btn) => {
    if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
      world.pressedButtons[btn.key] = true;
      keyboard[btn.key] = true;
      hit = true;
    }
  });
  return hit;
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
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        if (btn.key === "tutorial") {
          world.showTutorial = true;
          world.pause();
        }
        if (btn.key === "legal") window.location.href = "datenschutz.html";
        if (btn.key === "sound") {
          soundOn = !soundOn;
          handleSoundToggle();
        }
        if (btn.key === "fullscreen") toggleFullscreen(canvas);
        return true;
      }
    }
  }
  return false;
}
