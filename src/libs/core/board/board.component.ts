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
  private enemyBase: Coordinates = { x: 64, y: 288 };
  private enemyCoordinates: { [key: string]: number } = {
    x: 64,
    y: 0,
  };
  private enemies: Enemy[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.board = document.querySelector('canvas');

    // Get and set board
    this.getBoardAndWaypoints();
    this.setBoard();
  }

  private getBoardAndWaypoints() {
    this.waypoints = this.http.get(
      '../../../assets/data/waypoints/waypoints.json'
    );
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
      // Set first enemy
      this.enemies.push(new Enemy({ enemyBase: this.enemyBase }));
      setTimeout(() => {
        this.enemies.push(
          new Enemy({ enemyBase: { x: this.enemyBase.x-32, y: this.enemyBase.y } })
        );
      }, 1000);
      this.animate();

      console.log('enemies', this.enemies);
    };
    this.boardImage.src =
      '../../../assets/gallery/board/tower-defense-mobile.png';
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.boardContext.drawImage(this.boardImage, 0, 0);

    // Enemy logic
    for (let index of this.enemies.keys()) {
      console.log(`Enemy#${index}`);
      if (
        this.enemies[index].position.x > this.board.width ||
        this.enemies[index].position.y > this.board.height
      ) {
        // Remove enemy due to out-of-bounds
        this.enemies.splice(index, 1);
      } else {
        this.enemies[index].update(this.boardContext);
      }
    }
    // this.enemies.forEach((enemy, index) => {
    //   if (
    //     enemy.position.x > this.board.width ||
    //     enemy.position.y > this.board.height
    //   ) {
    //     // Remove enemy due to out-of-bounds
    //     this.enemies.splice(index, 1);
    //   } else {
    //     enemy.update(this.boardContext);
    //   }
    // });
  }
}
