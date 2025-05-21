class DrawableObject {
  img;
  images = [];
  x = 120;
  y = 275;
  height = 150;
  width = 100;
  currentImage = 0;
  amountOfBottlesOnGround = 10;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  isCollidingWithDrawable(drawableObject) {
    return (
      this.x + this.width > drawableObject.x &&
      this.y + this.height > drawableObject.y &&
      this.x < drawableObject.x &&
      this.y < drawableObject.y + drawableObject.height
    );
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.images[path] = img;
    });
  }
}
