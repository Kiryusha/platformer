import Controller from './controller/Controller';
import Display from './display/Display';
import Game from './game/Game';
import Engine from './engine/Engine';
import store from './store';

window.addEventListener('DOMContentLoaded', () => {
  const margin = 32;
  const fps = 1000 / 30;

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
    display.drawMap(game.world.background, game.world.columns);
    display.drawMap(game.world.map, game.world.columns);
    display.drawPlayer(
      game.world.player,
      game.world.player.color1,
      game.world.player.color2,
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
  const engine = new Engine(fps, render, update);

  // Synchronize display buffer size with the world size
  display.buffer.canvas.height = game.world.height;
  display.buffer.canvas.width = game.world.width;

  display.tileSheet.image.addEventListener('load', () => {
    resize();
    engine.start();
  }, { once: true });

  window.addEventListener('keydown', handleKeyEvent);
  window.addEventListener('keyup', handleKeyEvent);
  window.addEventListener('resize', resize);

  display.tileSheet.image.src = 'data:image/png;base64,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';

  if (process.env.NODE_ENV !== 'production') {
    setInterval(() => {
      store.dispatch({
        type: 'updateState',
        payload: {
          game,
          controller,
        },
      });
    }, 500);
  }
});
