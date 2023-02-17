import { Coordinates } from "./coordinate";

export class Enemy {
  public position: { x: number; y: number };
  private width: number;
  private height: number;

  constructor({ enemyBase = { x: 0, y: 0 }}) {
    this.position = {...enemyBase};
    this.height = 32;
    this.width = 32;
  }

  private draw(context) {
    context.fillStyle = 'red';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(context) {
    this.draw(context);
    this.position.x += 1;
  }

  // public get position() {
  //   return this.coordinates;
  // }

  // public set position(position: { x: number; y: number }) {
  //   this.coordinates.x = position.x;
  //   this.coordinates.y = position.y;
  // }
}
