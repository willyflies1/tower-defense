import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @ViewChild('towerDefenseBoard', { static: true }) towerDefenseBoard;
  private board;
  constructor() {}

  ngOnInit(): void {
    console.log('ViewChild: ', this.towerDefenseBoard);
    this.board = document.querySelector('canvas');
    console.log('document', this.board);
    const c = this.board.getContext('2d');
    c.fillRect(0,0, this.towerDefenseBoard.width, this.towerDefenseBoard.height);
  }
}
