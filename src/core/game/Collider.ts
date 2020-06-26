// The class is responsible for processing all the possible collisions
export default class {
  // this router separates collisions of a character with a collision entity
  private routeNarrowPhaseCharacterVsCollision(
    character: Character,
    collision: Entity,
  ): void {
    character.isStuck = false;
    switch (collision.type) {
      case 'top':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
        }
        break;
      case 'right':
        if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
        }
        break;
      case 'bottom':
        if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        break;
      case 'left':
        if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
        }
        break;
      case 'top-left':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
          return;
        } else if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
        }
        break;
      case 'top-right':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
          return;
        } else if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
        }
        break;
      case 'bottom-right':
        if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
          return;
        } else if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        break;
      case 'bottom-left':
        if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
          return;
        } else if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        break;
      case 'full':
        if (this.isCollidingFromTop(character, collision)) {
          this.collideCharacterVsCollisionFromTop(character, collision);
          return;
        } else if (this.isCollidingFromLeft(character, collision)) {
          this.collideCharacterVsCollisionFromLeft(character, collision);
          return;
        } else if (this.isCollidingFromRight(character, collision)) {
          this.collideCharacterVsCollisionFromRight(character, collision);
          return;
        } else if (this.isCollidingFromBottom(character, collision)) {
          this.collideCharacterVsCollisionFromBottom(character, collision);
        }
        character.isStuck = true;
        break;
    }
  }

  // this router separates collisions of a player with an enemy
  routeNarrowPhasePlayerVsEnemy(
    player: Player,
    enemy: Character,
  ): void {
    if (enemy.isDead) {
      return;
    }
    if (
      this.isCollidingFromTop(player, enemy)
      || this.isCollidingFromBottom(enemy, player)
    ) {
      enemy.isDeathTriggered = true;
      player.throwUp();
      return;
    } else if (
      this.isCollidingFromRight(player, enemy)
      || this.isCollidingFromBottom(player, enemy)
      || this.isCollidingFromTop(enemy, player)
      || this.isCollidingFromLeft(enemy, player)
    ) {
      player.throwUp('right');
      player.isHurt = true;
      player.currentHealth -= 1;
      setTimeout(() => {
        player.isHurt = false;
      }, 1000);
    } else if (
      this.isCollidingFromLeft(player, enemy)
      || this.isCollidingFromRight(enemy, player)
    ) {
      player.throwUp('left');
      player.isHurt = true;
      player.currentHealth -= 1;
      setTimeout(() => {
        player.isHurt = false;
      }, 1000);
    }
  }

  routeNarrowPhaseCharacterVsDoor(player: Player, door: Entity): void {
    const { target } = door.properties;
    const offset = parseInt(door.properties.offset);
    const destinationX = door.properties.destinationX
      ? parseInt(door.properties.destinationX) : null;
    const destinationY = door.properties.destinationY
      ? parseInt(door.properties.destinationY) : null;

    if (door.type === 'vertical') {
      if (this.isCollidingFromLeft(player, door)) {
        player.destination.x = destinationX;
      } else {
        player.destination.x = destinationX - player.width;
      }
      player.destination.y = player.top + offset;
    } else {
      if (this.isCollidingFromTop(player, door)) {
        player.destination.y = destinationY;
      } else {
        player.destination.y = destinationY - player.height;
        // add small velocity boost when jumping out of the pit
        player.velocityY -= 7;
      }
      player.destination.x = player.left + offset;
    }
    player.destination.name = target;
  }

  // these methods determine the presence of a one-way collision of e1 with e2
  private isCollidingFromTop(e1: Entity, e2: Entity): boolean {
    return e1.bottom > e2.top && e1.oldBottom <= e2.top;
  }

  private isCollidingFromRight(e1: Entity, e2: Entity): boolean {
    return e1.left < e2.right && e1.oldLeft >= e2.right;
  }

  private isCollidingFromBottom(e1: Entity, e2: Entity): boolean {
    return e1.top < e2.bottom && e1.oldTop >= e2.bottom;
  }

  private isCollidingFromLeft(e1: Entity, e2: Entity): boolean {
    return e1.right > e2.left && e1.oldRight <= e2.left;
  }

  // This method exists for the future possible separation of various methods of cycling objects:
  // quad tree, spatial hash etc. For now it is just brute forcing all of them.
  public processBroadPhase(entities: Entity[]): any[] {
    return this.bruteForce(entities);
  }

  private bruteForce(entities: Entity[]): any[] {
    // based on https://github.com/reu/broadphase.js/blob/master/src/brute-force.js
    const length = entities.length;
    const collisions = [];

    if (length > 1) {
      for (let i = 0; i < length; i += 1) {
        let e1 = entities[i];

        for (let k = i + 1; k < length; k += 1) {
          let e2 = entities[k];

          if (this.broadPhaseComparator(e1, e2)) {
            this.broadPhaseResolver(e1, e2);
            collisions.push([e1, e2]);

            e1.isColliding = true;
            e2.isColliding = true;
          } else {
            e1.isColliding = false;
            e2.isColliding = false;
          }
        }
      }
    }

    return collisions;
  }

  // Checks if objects are overlapping
  private broadPhaseComparator(e1: Entity, e2: Entity): boolean {
    // Skips all checks not related to the character in order to save resources
    if (e1.group !== 'characters' && e2.group !== 'characters') {
      return false;
    }

    // TODO: develop to complete Separating Axis Theorem
    if (
      e1.left < e2.right &&
      e2.left < e1.right &&
      e1.top < e2.bottom &&
      e2.top < e1.bottom
    ) {
      return true;
    }

    return false;
  }

  // Resolves which router use for the collision
  private broadPhaseResolver(
    e1: any,
    e2: any,
  ): void {
    if (e1.group === 'characters' && e2.group === 'collisions') {
      this.routeNarrowPhaseCharacterVsCollision(e1, e2);
    } else if (e2.group  === 'characters' && e1.group === 'collisions') {
      this.routeNarrowPhaseCharacterVsCollision(e2, e1);
    } else if (e1.group === 'characters' && e2.group === 'characters') {
      this.routeNarrowPhasePlayerVsEnemy(
        e1.type === 'player' ? e1 : e2,
        e2.type === 'player' ? e1 : e2,
      );
    } else if (
      (e1.group === 'characters' && e2.group === 'doors')
      || (e2.group === 'characters' && e1.group === 'doors')
    ) {
      this.routeNarrowPhaseCharacterVsDoor(
        e1.group === 'characters' ? e1 : e2,
        e2.group === 'characters' ? e1 : e2,
      );
    }
  }

  // These are specific methods for handling various cases of collisions.
  private collideCharacterVsCollisionFromTop(
    character: Character,
    collision: Entity,
  ): void {
    character.bottom = collision.top - 0.01;
    character.isJumping = false;
    character.isFalling = false;
    // specifying collision direction
    character.collisionYDirection = 'bottom';
    collision.collisionYDirection = 'top';
  }

  private collideCharacterVsCollisionFromRight(
    character: Character,
    collision: Entity,
  ): void {
    character.left = collision.right;
    character.velocityX = 0;
    // specifying collision direction
    character.collisionXDirection = 'left';
    collision.collisionXDirection = 'right';
  }

  private collideCharacterVsCollisionFromBottom(
    character: Character,
    collision: Entity,
  ): void {
    character.top = collision.bottom;
    character.velocityY = 0;
    character.isJumping = false;
    character.isFalling = true;
    // specifying collision direction
    character.collisionYDirection = 'top';
    collision.collisionYDirection = 'bottom';
  }

  private collideCharacterVsCollisionFromLeft(
    character: Character,
    collision: Entity,
  ): void {
    character.right = collision.left - 0.01;
    character.velocityX = 0;
    // specifying collision direction
    character.collisionXDirection = 'right';
    collision.collisionXDirection = 'left';
  }
}
