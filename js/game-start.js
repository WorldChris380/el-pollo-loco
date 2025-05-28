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
 * Closes the tutorial overlay if the close button was clicked.
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
 * Handles clicks on the start button.
 * Starts the game if the start button was clicked.
 * @param {number} x - X coordinate of the click.
 * @param {number} y - Y coordinate of the click.
 * @returns {boolean} True if the game was started, otherwise false.
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
 * Handles clicks on the start screen sub buttons (e.g. tutorial, legal, sound, fullscreen).
 * Executes the corresponding action if a sub button was clicked.
 * @param {number} x - X coordinate of the click.
 * @param {number} y - Y coordinate of the click.
 * @returns {boolean} True if a sub button was clicked, otherwise false.
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
