class Level {
  enemies;
  clouds;
  background;
  level_end_x = 1500;
  

  constructor(enemies, clouds, background) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.background = background;
  }
}
