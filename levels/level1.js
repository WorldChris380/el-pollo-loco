/**
 * Creates the first level with enemies, clouds, and background layers.
 * @function
 * @returns {Level} A new Level object with predefined enemies, clouds, and backgrounds.
 */
function createLevel1() {
  const level = {
    enemies: [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new YellowChicken(),
      new YellowChicken(),
      new YellowChicken(),
      new YellowChicken(),
    ],
    clouds: [new Cloud()],
    background: [
      new Background("img/5_background/layers/air.png", -719),
      new Background("img/5_background/layers/3_third_layer/2.png", -719),
      new Background("img/5_background/layers/2_second_layer/2.png", -719),
      new Background("img/5_background/layers/1_first_layer/2.png", -719),
      new Background("img/5_background/layers/air.png", 0),
      new Background("img/5_background/layers/3_third_layer/1.png", 0),
      new Background("img/5_background/layers/2_second_layer/1.png", 0),
      new Background("img/5_background/layers/1_first_layer/1.png", 0),
      new Background("img/5_background/layers/air.png", 719),
      new Background("img/5_background/layers/3_third_layer/2.png", 719),
      new Background("img/5_background/layers/2_second_layer/2.png", 719),
      new Background("img/5_background/layers/1_first_layer/2.png", 719),
      new Background("img/5_background/layers/air.png", 719 * 2),
      new Background("img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new Background("img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new Background("img/5_background/layers/1_first_layer/1.png", 719 * 2),
      new Background("img/5_background/layers/air.png", 719 * 3),
      new Background("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new Background("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new Background("img/5_background/layers/1_first_layer/2.png", 719 * 3),
    ],
    level_end_x: 719 * 3,
  };
  return level;
}
