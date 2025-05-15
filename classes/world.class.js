class World {
    character = new Character();
  background = level1.background;
  clouds = level1.clouds;
  enemies = level1.enemies;
  ctx;
  canvas;
  camera_x = 0;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToCanvas(this.background);
    this.addObjectsToCanvas(this.clouds);
    this.addToCanvas(this.character);
    this.addObjectsToCanvas(this.enemies);

    this.ctx.translate(-this.camera_x, 0);

    // Draw wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToCanvas(objects) {
    objects.forEach((Object) => {
      this.addToCanvas(Object);
    });
  }

  addToCanvas(moveableObject) {
    if (moveableObject.otherDirection) {
      this.ctx.save();
      this.ctx.translate(moveableObject.width, 0);
      this.ctx.scale(-1, 1);
      moveableObject.x = moveableObject.x * -1;
    }

    this.ctx.drawImage(
      moveableObject.img,
      moveableObject.x,
      moveableObject.y,
      moveableObject.width,
      moveableObject.height
    );
    if (moveableObject.otherDirection) {
      moveableObject.x = moveableObject.x * -1;
      this.ctx.restore();
    }
  }
}
