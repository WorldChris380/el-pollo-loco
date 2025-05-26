/**
 * Monitors the screen orientation and displays an overlay
 * when the device is in portrait mode.
 * Binds event listeners for load, resize, and orientationchange.
 */

/**
 * Checks the current screen orientation and shows the overlay if necessary.
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  if (window.innerHeight > window.innerWidth) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
