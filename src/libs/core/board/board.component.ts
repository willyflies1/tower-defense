import { animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Coordinates, Enemy } from 'src/libs/shared/models';
// import  from '../../../assets/gallery/board/tower-defense-mobile.png';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('towerDefenseBoard', { static: true }) towerDefenseBoard;
  private board;
  private boardImage;
  private waypoints;
  private boardContext;
  private enemyBase!: Coordinates; // = { x: 64, y: 288 };
  private enemies: Enemy[] = [];
  private enemyOffset: number = 16;
  private numEnemies: number = 5;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.board = document.querySelector('canvas');

    // Get and set board
    this.getBoardAndWaypoints();
    this.setBoard();
  }

  private getBoardAndWaypoints() {
    this.http
      .get('../../../assets/data/waypoints/waypoints.json')
      .subscribe((points) => {
        this.waypoints = points;
        this.enemyBase = {x: this.waypoints[1].x-16, y: this.waypoints[1].y-16};
      });
  }

  private setBoard() {
    // Board context
    // const c = this.board.getContext('2d');
    this.boardContext = this.board.getContext('2d');
    // Style can be added to scss to change canvas size... but
    // the painted image doesn't get sized correctly.
    // This is a needed addition to set the painted image size.
    this.board.width = 416;
    this.board.height = 864;

    this.boardContext.fillRect(
      0,
      0,
      this.towerDefenseBoard.width,
      this.towerDefenseBoard.height
    );

    this.boardImage = new Image();

    this.boardImage.onload = () => {
      this.setEnemies();

      this.animate();

      console.log('enemies', this.enemies);
    };
    this.boardImage.src =
      '../../../assets/gallery/board/tower-defense-mobile.png';
  }

  /**
   * Sets enemies on map per numEnemies set at interval 1s
   */
  private setEnemies() {
    let i: number = 0;
    const getEnemy = () => {
      if (i < this.numEnemies) {
        this.enemies.push(
          new Enemy({ enemyBase: this.enemyBase, waypoints: this.waypoints })
        );
        i++;
      } else {
        clearInterval(enemyInterval);
      }
    };
    const enemyInterval = setInterval(getEnemy, 1000);
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.boardContext.drawImage(this.boardImage, 0, 0);

    this.enemies.forEach((enemy, index) => {
      // Remove enemy if they have meet user base
      if (
        Math.round(enemy.center.x) ===
          this.waypoints[this.waypoints.length-1].x &&
        Math.round(enemy.center.y) === this.waypoints[this.waypoints.length-1].y
      ){
        this.enemies.splice(index, 1);
      }
        enemy.update(this.boardContext);
    });
  }
}
