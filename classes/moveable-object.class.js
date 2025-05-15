class MoveableObject {
  x = 120;
  y = 275;
  img;
  height = 150;
  width = 100;
  images = [];
  currentImage = 0;
  otherDirection = false;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.images[path] = img;
    });
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
  
  playAnimation(images) {
    let i = this.currentImage % this.IMAGES_WALKING.length;
    let path = this.IMAGES_WALKING[i];
    this.img = this.images[path];
    this.currentImage++;
  }
}
