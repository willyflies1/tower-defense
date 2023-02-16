import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  private themeState$!: BehaviorSubject<boolean>;

  constructor() {}

  public setThemeState(dark: boolean) {
    this.themeState$
      ? this.themeState$.next(dark)
      : (this.themeState$ = new BehaviorSubject(dark));
  }

  public isThemeDark(): Observable<boolean> {
    return this.themeState$.asObservable();
  }
}
