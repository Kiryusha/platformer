import Controller from './controller/Controller';
import Display from './display/Display';
import Game from './game/Game';
import Engine from './engine/Engine';

window.addEventListener('DOMContentLoaded', () => {
  const margin = 32;

  const handleKeyEvent = (event: { type: string; keyCode: number; }) => {
    controller.handleKeyEvent(event.type, event.keyCode);
  };

  const resize = () => {
    display.resize(
      document.documentElement.clientWidth - margin,
      document.documentElement.clientHeight - margin,
      game.world.height / game.world.width,
    );
    display.render();
  };

  const render = () => {
    display.fill(game.world.backgroundColor);
    display.drawRectangle(
      game.world.player.x,
      game.world.player.y,
      game.world.player.width,
      game.world.player.height,
      game.world.player.color,
    );
    display.render();
  };

  const update = () => {
    if (controller.left.isActive) {
      game.world.player.moveLeft();
    }

    if (controller.right.isActive) {
      game.world.player.moveRight();
    }

    if (controller.up.isActive) {
      game.world.player.jump();
      controller.up.isActive = false;
    }

    game.update();
  };

  const controller = new Controller();
  const display = new Display(document.getElementById('game') as HTMLCanvasElement);
  const game = new Game();
  const engine = new Engine(1000 / 30, render, update);

  // Synchronize display buffer size with the world size
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;

  window.addEventListener('keydown', handleKeyEvent);
  window.addEventListener('keyup', handleKeyEvent);
  window.addEventListener('resize', resize);

  resize();

  engine.start();
});
