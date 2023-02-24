import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Placement } from 'src/libs/shared/models/placement';
import { Level } from '../../shared/enums/level';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private assetsPath: string = '../../../assets/data';
  private baseDataPath: string = this.assetsPath + '/waypoints/';
  private basePlacementPath: string = this.assetsPath + '/placement/';

  // vars
  private tileSize: number = 32;
  private mapSize: { width: number; height: number } = {
    width: 416,
    height: 864,
  };

  constructor(private http: HttpClient) {}

  public getLvlWaypoints(lvl: Level) {
    return this.http.get(this.baseDataPath + lvl + '-waypoints.json');
  }

  public getLvlPlacement(lvl: Level): Observable<Placement> {
    return this.http.get<Placement>(this.basePlacementPath + lvl + '-placement.json').pipe(map(res => return res.data));
  }

  private getTileFromPlacementData(data) {
    const numRows: number = this.mapSize.width/this.tileSize;
    // return data.;
  }
}
