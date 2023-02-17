import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
// import  from '../../../assets/gallery/board/tower-defense-mobile.png';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('towerDefenseBoard', { static: true }) towerDefenseBoard;
  private board;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.board = document.querySelector('canvas');
    console.log('ViewChild: ', this.towerDefenseBoard);
    console.log('document', this.board);
    const boardImage = this.http.get(
      '../../../assets/gallery/board/tower-defense-mobile.png'
    );

    // Board context
    const c = this.board.getContext('2d');
    // Style can be added to scss to change canvas size... but
    // the painted image doesn't get sized correctly.
    // This is a needed addition to set the painted image size.
    this.board.width = 416;
    this.board.height = 864;

    // c.fillStyle = 'white';
    const image = new Image();
    image.onload = () => {
      c.drawImage(image, 0, 0);
    };
    image.src = '../../../assets/gallery/board/tower-defense-mobile.png';
    c.fillRect(
      0,
      0,
      this.towerDefenseBoard.width,
      this.towerDefenseBoard.height
    );
  }
}
