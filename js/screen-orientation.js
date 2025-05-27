/**
 * Checks the current screen orientation and shows the overlay if necessary.
 * Also displays mobile control buttons if on a mobile device.
 * @module screen-orientation
 */

/**
 * Checks the device type and orientation, and updates the UI accordingly.
 * Shows the rotate overlay if on a mobile device in portrait mode.
 * Shows mobile control buttons if on a mobile device.
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  const isMobile =
    /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && "ontouchend" in document);

  if (isMobile && window.innerHeight > window.innerWidth) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
