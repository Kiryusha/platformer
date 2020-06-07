// The class is responsible for processing AI for npc
export default class {
  characters: any[];

  constructor() {
    this.characters = [];
  }

  // this method adds the character to the pool of controlled characters.
  // Their behavior will be adjusted during the update method.
  public bindCharacter(character: Character): void {
    this.characters.push({
      character,
      startingPoint: {
        x: character.x,
        y: character.y,
      },
      reachedLeftBorder: false,
      reachedRightBorder: false,
    });
  }

  // the method to be called during the update of each frame.
  public update(): void {
    this.checkBroadPhase();
  }

  // Broadphase of the Brain class: determines which roaming pattern to choose.
  private checkBroadPhase(): void {
    for (let i = 0; i < this.characters.length; i += 1) {
      if (this.characters[i].character.movingPattern) {
        switch (this.characters[i].character.movingPattern.type) {
          case 'roaming':
            this.processRoaming(i);
            break;
        }
      }
    }
  }

  private processRoaming(index: number): void {
    // There is a starting point around which the character moves. If it goes to the left
    // to an allowable maximum, then it turns around and reaches an allowable maximum of
    // the right side and then turns around. And so it is repeated.
    // If during movement, it stumbles upon a wall, which does not allow to reach the maximum of
    // one of the sides, then it believes that it has already reached the maximum of this side.
    let {
      character,
      startingPoint,
      reachedLeftBorder,
      reachedRightBorder,
    } = this.characters[index];

    // cases when a character doesn't leave its habitat
    const withinHabitatFromTheLeftSide =
      character.x > startingPoint.x - character.movingPattern.length;
    const withinHabitatFromTheRightSide =
      character.x < character.movingPattern.length + startingPoint.x;

    // cases when a character stumbles upon a wall on its way
    const notStumbleUponAWallInTheLeftSide =
      character.collisionXDirection !== 'left';
    const notStumbleUponAWallInTheRightSide =
      character.collisionXDirection !== 'right';

    // cases when character leaves its habitat for some reason
    const outOfHabitatFromTheLeftSide =
      character.x < startingPoint.x - character.movingPattern.length;
    const outOfHabitatFromTheRightSide =
      character.x > character.movingPattern.length + startingPoint.x;

    // character has just appeared or has already reached the border on the right
    if (
      (!reachedLeftBorder && !reachedRightBorder)
      || (!reachedLeftBorder && reachedRightBorder)
    ) {
      // character is inside its habitat and doesn't stumble upon a wall on its way
      if (withinHabitatFromTheLeftSide && notStumbleUponAWallInTheLeftSide) {
        character.stopMovingRight();
        character.startMovingLeft();
        character.collisionXDirection = '';
      // character leaves its habitat for some reason
      } else if (outOfHabitatFromTheRightSide) {
        character.stopMovingLeft();
        character.startMovingRight();
      // character has reached the end of its way on this side. Time to turn the other way
      } else {
        this.characters[index].reachedLeftBorder = true;
        this.characters[index].reachedRightBorder = false;
      }
    // character reached border on the left.
    } else if (reachedLeftBorder && !reachedRightBorder) {
      // character is inside its habitat and doesn't stumble upon a wall on its way
      if (withinHabitatFromTheRightSide && notStumbleUponAWallInTheRightSide) {
        character.stopMovingLeft();
        character.startMovingRight();
        character.collisionXDirection = '';
      // character leaves its habitat for some reason
      } else if (outOfHabitatFromTheLeftSide) {
        character.stopMovingRight();
        character.startMovingLeft();
      // character has reached the end of its way on this side. Time to turn the other way
      } else {
        this.characters[index].reachedRightBorder = true;
        this.characters[index].reachedLeftBorder = false;
      }
    }
  }
}
