class Character extends MoveableObject {
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.width = 165;
    this.height = 270;
    this.y = 160;
  }
  jump() {}
}
