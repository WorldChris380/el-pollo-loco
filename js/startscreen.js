/**
 * Draws the start screen image and the start button on the canvas.
 */
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  img.src = "img/9_intro_outro_screens/start/startscreen_1.png";
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawStartSubButtons();
  };
  if (img.complete) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawStartButton();
    drawStartSubButtons();
  }
}

/**
 * Draws the start button on the canvas.
 */
function drawStartButton() {
  const btnWidth = 260;
  const btnHeight = 60;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = 40;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Start game", canvas.width / 2, btnY + btnHeight / 2);
  ctx.restore();
  startButtonArea = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
}

/**
 * Draws the start sub buttons on the canvas.
 */
function drawStartSubButtons() {
  const buttonWidth = 150;
  const buttonHeight = 40;
  const gap = 20;
  const totalWidth = buttonWidth * 4 + gap * 3;
  const startX = (canvas.width - totalWidth) / 2;
  const y = canvas.height - 50;
  const buttons = [
    { label: "Legal Notice", key: "legal" },
    { label: "Tutorial", key: "tutorial" },
    { label: soundOn ? "Sound Off" : "Sound On", key: "sound" },
    { label: "Fullscreen", key: "fullscreen" },
  ];
  startSubButtonAreas = [];
  buttons.forEach((btn, i) => {
    const x = startX + i * (buttonWidth + gap);
    ctx.save();
    ctx.fillStyle = "rgba(160,34,10,0.9)";
    ctx.fillRect(x, y, buttonWidth, buttonHeight);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(btn.label, x + buttonWidth / 2, y + buttonHeight / 2);
    ctx.restore();
    startSubButtonAreas.push({
      x,
      y,
      width: buttonWidth,
      height: buttonHeight,
      key: btn.key,
    });
  });
}

/**
 * Handles the start sub buttons actions: tutorial, legal, sound, fullscreen.
 * @param {Object} btn - The button object containing key and other properties.
 */
function handleStartSubButton(btn) {
  if (btn.key === "tutorial") {
    showStartButton = false;
    showTutorialOverlay();
  }
  if (btn.key === "legal") {
    showStartButton = false;
    showLegalOverlay();
  }
  if (btn.key === "sound") {
    soundOn = !soundOn;
    handleSoundToggle();
    drawStartScreen();
  }
  if (btn.key === "fullscreen") {
    toggleFullscreen(canvas);
  }
}

