class World {
  background = [new Background("img/5_background/layers/3_third_layer/1.png", 0)];
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];

  ctx;
  canvas;
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addObjectsToCanvas(this.background);
    this.addObjectsToCanvas(this.clouds);
    this.addObjectsToCanvas(this.enemies);
    this.addToCanvas(this.character);

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
    this.ctx.drawImage(
      moveableObject.img,
      moveableObject.x,
      moveableObject.y,
      moveableObject.width,
      moveableObject.height
    );
  }
}
