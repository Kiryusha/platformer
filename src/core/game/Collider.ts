// The class is responsible for processing all the possible collisions
import Player from './Player';

export default class {
  processCollision(
    platformType: number,
    object: Player,
    tileX: number,
    tileY: number,
    tileSize: number,
  ): void {
    switch (platformType) {
      case 215: // top
        this.collidePlatformTop(object, tileY);
        break;
      case 216: // right
        this.collidePlatformRight(object, tileX + tileSize);
        break;
      case 217: // bottom
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
      case 218: // left
        this.collidePlatformLeft(object, tileX);
        break;
      case 221: // top-left
        if (this.collidePlatformTop(object, tileY)) return;
        this.collidePlatformLeft(object, tileX);
        break;
      case 222: // top-right
        if (this.collidePlatformTop(object, tileY)) return;
        this.collidePlatformRight(object, tileX + tileSize);
        break;
      case 223: // bottom-right
        if (this.collidePlatformRight(object, tileX + tileSize)) return;
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
      case 224: // bottom-left
        if (this.collidePlatformLeft(object, tileX)) return;
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
      case 233: // all-sides wall
        if (this.collidePlatformTop(object, tileY)) return;
        if (this.collidePlatformLeft(object, tileX)) return;
        if (this.collidePlatformRight(object, tileX + tileSize)) return;
        this.collidePlatformBottom(object, tileY + tileSize);
        break;
    }
  }

  collidePlatformTop(
    object: Player,
    tileTop: number,
  ): boolean {
    // console.log(object.getBottom(), object.getOldBottom(), tileTop, object.getBottom() > tileTop && object.getOldBottom() <= tileTop)
    if (object.getBottom() > tileTop && object.getOldBottom() <= tileTop) {
      object.setBottom(tileTop - 0.01);
      object.velocityY = 0;
      object.isJumping = false;
      object.isFalling = false;
      object.isOnTop = true;
      return true;
    }
    object.isOnTop = false;
    return false;
  }

  collidePlatformRight(
    object: Player,
    tileRight: number,
  ): boolean {
    if (object.getLeft() < tileRight && object.getOldLeft() >= tileRight) {
      object.setLeft(tileRight);
      object.velocityX = 0;
      return true;
    }
    return false;
  }

  collidePlatformBottom(
    object: Player,
    tileBottom: number,
  ): boolean {
    if (object.getTop() < tileBottom && object.getOldTop() >= tileBottom) {
      object.setTop(tileBottom);
      object.velocityY = 0;
      object.isJumping = false;
      object.isFalling = true;
      return true;
    }
    return false;
  }

  collidePlatformLeft(
    object: Player,
    tileLeft: number,
  ): boolean {
    if (object.getRight() > tileLeft && object.getOldRight() <= tileLeft) {
      object.setRight(tileLeft - 0.01);
      object.velocityX = 0;
      return true;
    }
    return false;
  }
}
