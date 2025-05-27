/**
 * Checks the current screen orientation and shows the overlay if necessary.
 */
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
  if (isMobile && window.innerHeight > window.innerWidth) {
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
