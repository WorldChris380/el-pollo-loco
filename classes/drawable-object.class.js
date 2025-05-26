/**
 * Base class for all drawable objects in the game.
 * Handles image loading, drawing, collision detection, and image management.
 * @class
 */
class DrawableObject {
  img;
  images = [];
  x = 120;
  y = 275;
  height = 150;
  width = 100;
  currentImage = 0;
  amountOfBottlesOnGround = 10;

  /**
   * Loads a single image.
   * @param {string} path - Path to the image.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  // /**
  //  * Draws a frame around the object (only for Character/Chicken).
  //  * @param {CanvasRenderingContext2D} ctx
  //  */
  // drawFrame(ctx) {
  //   if (this instanceof Character || this instanceof Chicken) {
  //     ctx.beginPath();
  //     ctx.lineWidth = "5";
  //     ctx.strokeStyle = "blue";
  //     ctx.rect(this.x, this.y, this.width, this.height);
  //     ctx.stroke();
  //   }
  // }

  /**
   * Checks if this object collides with another drawable object.
   * @param {DrawableObject} drawableObject
   * @returns {boolean}
   */
  isCollidingWithDrawable(drawableObject) {
    const a = this.getCollisionBox ? this.getCollisionBox() : this;
    const b = drawableObject.getCollisionBox ? drawableObject.getCollisionBox() : drawableObject;
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  /**
   * Loads multiple images into the object.
   * @param {string[]} arr - Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.images[path] = img;
    });
  }
}
