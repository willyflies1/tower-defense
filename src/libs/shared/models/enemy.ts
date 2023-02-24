import { Coordinates } from './coordinate';

export class Enemy {
  public position: { x: number; y: number };
  public width: number;
  public height: number;
  private waypoints: [{ x: number; y: number }];
  private waypointIndex: number = 0;
  private waypointOffset: number = 16;
  public center: { x: number; y: number };
  private speed: number;

  constructor({ enemyBase = { x: 0, y: 0 }, waypoints }) {
    this.position = { ...enemyBase };
    this.waypoints = waypoints;
    console.log('waypoints', waypoints);
    this.waypointIndex = 2;
    this.height = 32;
    this.width = 32;
    this.speed = 1;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
  }

  private draw(context) {
    context.fillStyle = 'red';
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(context) {
    this.draw(context);

    const waypoint: { x: number; y: number } =
      this.waypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.position.x += this.speed * Math.cos(angle);
    this.position.y += this.speed * Math.sin(angle);
    // this.center = this.position;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    if (
      Math.round(this.center.x) === Math.round(waypoint.x) &&
      Math.round(this.center.y) === Math.round(waypoint.y) &&
      this.waypointIndex < this.waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}
