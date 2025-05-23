let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let soundOn = true;
let gameAudio = new Audio("audio/game-sound.wav");
gameAudio.loop = true;

window.onload = function () {
  document.getElementById("startscreen").style.display = "flex";
  document.getElementById("canvas").style.display = "none";

  document
    .getElementById("startgame-btn")
    .addEventListener("click", function () {
      document.getElementById("startscreen").style.display = "none";
      document.getElementById("canvas").style.display = "block";
      init();
    });
};

function init() {
  gameAudio.currentTime = 0;
  if (soundOn) {
    gameAudio.play();
  }
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  let canvasElement = document.getElementById("canvas");
  addFullscreenClick(canvasElement);
  mouseOverForFullscreen(canvasElement);
  addSubButtonClicks(canvasElement);
}

function addFullscreenClick(canvasElement) {
  canvasElement.addEventListener("click", function (event) {
    const { x, y } = getCanvasCoordinates(event, canvasElement);
    if (isFullscreenButton(x, y, canvasElement)) {
      toggleFullscreen(canvasElement);
    }
  });
}

function getCanvasCoordinates(event, canvasElement) {
  const rect = canvasElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
  const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;
  return { x, y };
}

function isFullscreenButton(x, y, canvasElement) {
  return (
    x >= canvasElement.width - 190 &&
    x <= canvasElement.width - 10 &&
    y >= canvasElement.height - 60 &&
    y <= canvasElement.height - 20
  );
}

function toggleFullscreen(canvasElement) {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  ) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    if (canvasElement.requestFullscreen) {
      canvasElement.requestFullscreen();
    } else if (canvasElement.webkitRequestFullscreen) {
      canvasElement.webkitRequestFullscreen();
    } else if (canvasElement.msRequestFullscreen) {
      canvasElement.msRequestFullscreen();
    }
  }
}

function mouseOverForFullscreen(canvasElement) {
  canvasElement.addEventListener("mousemove", function (event) {
    const rect = canvasElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;

    if (
      x >= canvasElement.width - 190 &&
      x <= canvasElement.width - 10 &&
      y >= canvasElement.height - 60 &&
      y <= canvasElement.height - 20
    ) {
      canvasElement.style.cursor = "pointer";
    } else {
      canvasElement.style.cursor = "default";
    }
  });
}

function addSubButtonClicks(canvasElement) {
  canvasElement.addEventListener("click", function (event) {
    const rect = canvasElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvasElement.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvasElement.height;

    // Tutorial schließen
    if (world && world.showTutorial && world.tutorialCloseButton) {
      const btn = world.tutorialCloseButton;
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        world.showTutorial = false;
        return;
      }
    }
    if (world && world.restartButtonArea && world.character.energy === 0) {
      const btn = world.restartButtonArea;
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        restartGame();
        return;
      }
    }
    if (!world || !world.subButtonAreas) return;
    for (const btn of world.subButtonAreas) {
      if (
        x >= btn.x &&
        x <= btn.x + btn.width &&
        y >= btn.y &&
        y <= btn.y + btn.height
      ) {
        if (btn.key === "tutorial") {
          world.showTutorial = true;
        }
        if (btn.key === "legal") {
          window.open("datenschutz.html", "_blank");
        }
        if (btn.key === "tutorial") {
          world.showTutorial = true;
        }
        if (btn.key === "sound") {
          soundOn = !soundOn;
          handleSoundToggle();
        }
        if (btn.key === "fullscreen") {
          toggleFullscreen(canvasElement);
        }
      }
    }
  });
}

function handleSoundToggle() {
  if (!soundOn) {
    gameAudio.pause();
    if (window.walkAudio) walkAudio.pause();
    if (window.jumpAudio) jumpAudio.pause();
    if (window.hurtAudio) hurtAudio.pause();
    if (window.endbossWalkAudio) endbossWalkAudio.pause();
    if (window.coinAudio) coinAudio.pause();
    if (window.bottleBreakAudio) bottleBreakAudio.pause();
    if (window.gameOverAudio) gameOverAudio.pause();
  } else {
    gameAudio.currentTime = 0;
    gameAudio.play();
  }
}



function restartGame() {
  gameAudio.currentTime = 0;
  if (soundOn) {
    gameAudio.play();
  }
  world = null;
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32) {
    keyboard.UP = true;
  }
  if (event.keyCode == 40 || event.keyCode == 83) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 13 || event.keyCode == 69) {
    keyboard.ENTER = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.keyCode == 39 || event.keyCode == 68) {
    keyboard.RIGHT = false;
  }
  if (event.keyCode == 37 || event.keyCode == 65) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 32) {
    keyboard.UP = false;
  }
  if (event.keyCode == 40 || event.keyCode == 83) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 13 || event.keyCode == 69) {
    keyboard.ENTER = false;
  }
});
