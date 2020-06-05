// The class is responsible for processing AI for npc
export default class {
  characters: any[];

  constructor() {
    this.characters = [];
  }

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

  update(): void {
    for (let i = 0; i < this.characters.length; i += 1) {
      let {
        character,
        startingPoint,
        reachedLeftBorder,
        reachedRightBorder,
      } = this.characters[i];

      if (character.movingPattern) {
        switch (character.movingPattern.type) {
          case 'roaming':
            if (
              (!reachedLeftBorder && !reachedRightBorder)
              || (!reachedLeftBorder && reachedRightBorder)
            ) {
              if (character.x > startingPoint.x - character.movingPattern.length) {
                character.stopMovingRight();
                character.startMovingLeft();
              } else {
                this.characters[i].reachedLeftBorder = true;
                this.characters[i].reachedRightBorder = false;
              }
            } else if (reachedLeftBorder && !reachedRightBorder) {
              if (character.x < character.movingPattern.length + startingPoint.x) {
                character.stopMovingLeft();
                character.startMovingRight();
              } else {
                this.characters[i].reachedRightBorder = true;
                this.characters[i].reachedLeftBorder = false;
              }
            }
            break;
        }
      }
    }
  }
}
