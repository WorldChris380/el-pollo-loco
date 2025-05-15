class Cloud extends MoveableObject {
  y = 20;
  height = 350;
  width = 500;
  speed = 0.15;
  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.moveLeft();
  }
  animate() {this.moveLeft();}

}
