import { createStore, compose } from 'redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}

const initialState = {
  game: {
    world: {
      player: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: '',
        weight: 20,
        speed: 0.5,
        isJumping: true,
        velocityX: 0,
        velocityY: 0,
      },
    },
  },
  controller: {
    left: {
      isActive: false,
      isDown: false,
    },
    right: {
      isActive: false,
      isDown: false,
    },
    up: {
      isActive: false,
      isDown: false,
    }
  },
};

function reducer(state = initialState, action: { type: string; payload: any}) {
  switch (action.type) {
    case 'updateState':
      const { payload: { game, controller } } = action;
      state.game.world.player.x = game.world.player.x;
      state.game.world.player.y = game.world.player.y;
      state.game.world.player.width = game.world.player.width;
      state.game.world.player.height = game.world.player.height;
      state.game.world.player.color = game.world.player.color;
      state.game.world.player.weight = game.world.player.weight;
      state.game.world.player.speed = game.world.player.speed;
      state.game.world.player.isJumping = game.world.player.isJumping;
      state.game.world.player.velocityX = game.world.player.velocityX;
      state.game.world.player.velocityY = game.world.player.velocityY;

      state.controller.left.isActive = controller.left.isActive;
      state.controller.left.isDown = controller.left.isDown;
      state.controller.right.isActive = controller.right.isActive;
      state.controller.right.isDown = controller.right.isDown;
      state.controller.up.isActive = controller.up.isActive;
      state.controller.up.isDown = controller.up.isDown;
      return state;
    default:
      return state;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(),
);

export default store;
