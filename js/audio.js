/**
 * Initializes and exports all audio objects for the game.
 * Contains sound effects for walking, jumping, taking damage, game over, coins, endboss, and bottle breaking.
 */
const walkAudio = new Audio("audio/walk.wav");
walkAudio.loop = true;
const jumpAudio = new Audio("audio/huch.wav");
const hurtAudio = new Audio("audio/hurt.wav");
const gameOverAudio = new Audio("audio/game-over.wav");
const coinAudio = new Audio("audio/coin.mp3");
const endbossWalkAudio = new Audio("audio/chicken.wav");
const bottleBreakAudio = new Audio("audio/broken-glass.wav");
const winAudio = new Audio("audio/win.wav");
