/**
 * Represents a level with enemies, clouds, and background.
 * @class
 */
class Level {
  enemies;
  clouds;
  background;
  level_end_x = 1500;

  /**
   * Creates a new Level.
   * @param {Array} enemies - Array of enemies.
   * @param {Array} clouds - Array of clouds.
   * @param {Array} background - Array of background layers.
   */
  constructor(enemies, clouds, background) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.background = background;
  }
}
