// The class is responsible for keeping and processing the player object
import Character from './Character';

export default class Player extends Character implements Player {
  // Property used when character moves between zones. It is filled during a collision with a door
  // and read during the general update cycle. It stores the name and coordinates for the
  // character (only for the player for now)
  public destination: {
    name: string;
    x: number;
    y: number;
  } = {
    name: '',
    x: 0,
    y: 0,
  };
  // Property for storaging current player's health
  public currentHealth: number;
  // Property indicates maximum obtainable hp point by player
  public maxHealth: number;

  constructor(
    playerConfig: CharacterConfig,
    playerSpriteMap: SpriteMap,
  ) {
    super(playerConfig, playerSpriteMap);
  }

}
