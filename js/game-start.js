/**
 * Handles click events on the canvas during the start screen.
 * Checks if the tutorial overlay, start button, or sub buttons were clicked.
 * @param {MouseEvent} event - The mouse event.
 */
function handleCanvasClick(event) {
  const { x, y } = getCanvasCoordinates(event, canvas);
  if (handleTutorialOverlayClick(x, y)) return;
  if (handleStartButtonClick(x, y)) return;
  if (handleStartSubButtonsClick(x, y)) return;
}

/**
 * Handles clicks on the tutorial overlay close button.
 * @param {number} x - X coordinate of the click.
 * @param {number} y - Y coordinate of the click.
 * @returns {boolean} True if the overlay was closed, otherwise false.
 */
function handleTutorialOverlayClick(x, y) {
  if (showTutorialOverlayActive && tutorialCloseButtonArea) {
    if (
      x >= tutorialCloseButtonArea.x &&
      x <= tutorialCloseButtonArea.x + tutorialCloseButtonArea.width &&
      y >= tutorialCloseButtonArea.y &&
      y <= tutorialCloseButtonArea.y + tutorialCloseButtonArea.height
    ) {
      showTutorialOverlayActive = false;
      showStartButton = true;
      drawStartScreen();
      return true;
    }
  }
  return false;
}

/**
 * Checks if the mouse is over the start button.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean} True if start button was clicked.
 */
function handleStartButtonClick(x, y) {
  if (
    showStartButton &&
    startButtonArea &&
    x >= startButtonArea.x &&
    x <= startButtonArea.x + startButtonArea.width &&
    y >= startButtonArea.y &&
    y <= startButtonArea.y + startButtonArea.height
  ) {
    showStartButton = false;
    init();
    return true;
  }
  return false;
}

/**
 * Handles clicks on start screen sub buttons.
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @returns {boolean} True if a sub button was clicked.
 */
function handleStartSubButtonsClick(x, y) {
  if (showStartButton && startSubButtonAreas) {
    for (const btn of startSubButtonAreas) {
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        handleStartSubButton(btn);
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if mouse is over the home button (game over or win screen).
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {boolean}
 */
function isHoveringHomeButton(mouseX, mouseY) {
  return (
    world &&
    world.homeButtonArea &&
    (world.character.energy === 0 || (world.endboss && world.endboss.isDead)) &&
    mouseX >= world.homeButtonArea.x &&
    mouseX <= world.homeButtonArea.x + world.homeButtonArea.width &&
    mouseY >= world.homeButtonArea.y &&
    mouseY <= world.homeButtonArea.y + world.homeButtonArea.height
  );
}

/**
 * Checks if mouse is over the restart button (game over or win screen).
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {boolean}
 */
function isHoveringRestartButton(mouseX, mouseY) {
  return (
    world &&
    world.restartButtonArea &&
    (world.character.energy === 0 || (world.endboss && world.endboss.isDead)) &&
    mouseX >= world.restartButtonArea.x &&
    mouseX <= world.restartButtonArea.x + world.restartButtonArea.width &&
    mouseY >= world.restartButtonArea.y &&
    mouseY <= world.restartButtonArea.y + world.restartButtonArea.height
  );
}

/**
 * Checks if mouse is over any start screen sub button.
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {boolean}
 */
function isHoveringStartSubButton(mouseX, mouseY) {
  if (
    typeof showStartButton !== "undefined" &&
    showStartButton &&
    typeof startSubButtonAreas !== "undefined" &&
    startSubButtonAreas
  ) {
    for (const btn of startSubButtonAreas) {
      if (
        mouseX >= btn.x &&
        mouseX <= btn.x + (btn.width || btn.w) &&
        mouseY >= btn.y &&
        mouseY <= btn.y + (btn.height || btn.h)
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Checks if mouse is over any sub button in the game (sound, fullscreen).
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {boolean}
 */
function isHoveringGameSubButton(mouseX, mouseY) {
  if (world && world.subButtonAreas && Array.isArray(world.subButtonAreas)) {
    for (const btn of world.subButtonAreas) {
      if (
        (btn.key === "sound" || btn.key === "fullscreen") &&
        mouseX >= btn.x &&
        mouseX <= btn.x + btn.width &&
        mouseY >= btn.y &&
        mouseY <= btn.y + btn.height
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Returns true if the mouse is over any interactive button (startscreen or ingame).
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {boolean}
 */
function isHoveringAnyButton(mouseX, mouseY) {
  return (
    isHoveringStartButton(mouseX, mouseY) ||
    isHoveringStartSubButton(mouseX, mouseY) ||
    isHoveringGameSubButton(mouseX, mouseY) ||
    isHoveringHomeButton(mouseX, mouseY) ||
    isHoveringRestartButton(mouseX, mouseY)
  );
}

/**
 * Checks if mouse is over the start button.
 * @param {number} mouseX
 * @param {number} mouseY
 * @returns {boolean}
 */
function isHoveringStartButton(mouseX, mouseY) {
  return (
    typeof showStartButton !== "undefined" &&
    showStartButton &&
    typeof startButtonArea !== "undefined" &&
    startButtonArea &&
    mouseX >= startButtonArea.x &&
    mouseX <= startButtonArea.x + startButtonArea.width &&
    mouseY >= startButtonArea.y &&
    mouseY <= startButtonArea.y + startButtonArea.height
  );
}

/**
 * Initializes the game when the window has fully loaded.
 * Sets up the canvas, context, draws the start screen, and adds mousemove event for button hover effects.
 */
window.addEventListener("load", function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  drawStartScreen();
  canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const hovering = isHoveringAnyButton(mouseX, mouseY);
    canvas.style.cursor = hovering ? "pointer" : "default";
  });
});
