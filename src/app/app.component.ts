import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { BehaviorSubject, noop } from 'rxjs';
import { environment } from 'src/environments/environment';
import {  SessionUtilityService } from 'src/libs/dal';
import { ThemingService } from 'src/libs/shared/services/theming.service';
import { AuthorizationService } from '../libs/dal/services/authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tower-defense';

  @ViewChild('background') background!: ElementRef;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  // public darkTheme: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
  //   true
  // );
  public drawerMode: MatDrawerMode = 'side';
  public hasBackdrop: boolean = false;
  isAuthenticated: boolean = false;
  private galleryPath = '../../../assets/gallery';
  // public logoPath = `${this.galleryPath}/Files-Tech-Logo1.png`;
  public logoPath: string = `${this.galleryPath}/logo/logo-no-background.svg`;
  public altLogoText = 'Whfiles';
  // Theme button variables
  public themeToggleColor: ThemePalette = 'primary';
  public themeToggleChecked$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  public themeToggleDisabled: boolean = false;
  private viewCheckFlag: boolean = false;
  public routeReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public displayRoute: boolean = false;

  mobileQuery!: MediaQueryList;
  desktopQuery!: MediaQueryList;
  private _mobileQueryListener!: () => void;

  constructor(
    private sessionUtility: SessionUtilityService,
    private http: HttpClient,
    private router: Router,
    private media: MediaMatcher,
    private cdRef: ChangeDetectorRef,
    private themingService: ThemingService
  ) {
    // this.handleCredentials();
    this.desktopQuery = media.matchMedia('(max-width: 1000px)');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => cdRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.desktopQuery.addListener(this._mobileQueryListener);
    this.themingService.setThemeState(this.themeToggleChecked$.value);
    this.sessionUtility.signOut();
  }

  ngOnInit(): void {
    this.triggerLoader();
    this.themeToggleChecked$.asObservable().subscribe((theme) => {
      console.log('Theme ', theme);
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.desktopQuery.removeListener(this._mobileQueryListener);
  }

  private handleCredentials(): void {
    const mockCredentials = {
      username: 'chet',
      password: 'manly',
    };

    // this.authService.authenticate(undefined, undefined);
    // this.authService.getIsAuthenticated().subscribe( authenticated => {
    //   this.isAuthenticated = authenticated;
    //   !authenticated
    //     ? this.router.navigateByUrl('/login')
    //     : noop();
    // })
  }

  logout() {
    this.http
      .post('logout', {})
      .toPromise()
      .finally(() => {
        // this.authService.signOut()
        this.sessionUtility.signOut();
        this.router.navigateByUrl('/');
      });
  }

  public toggleDrawer(): void {
    this.sidenav.toggle();
    this.cdRef.detectChanges();
  }

  /**
   * A click event triggered by the selection of a sidenav option
   * that will close drawer and create a loader that will display
   * between navigation.
   * @param $event Trigger from route navigation on sidenav
   */
  public closeDrawer($event): void {
    console.log(`Drawer ${$event}`);
    this.triggerLoader();
    this.sidenav.close();
  }

  private triggerLoader(): void {
    this.routeReady$.next(false);
    this.displayRoute = false;
    setTimeout(() => {
      this.displayRoute = true;
      this.routeReady$.next(true);
    }, 1800); // 100ms bufffer
  }

  public themeToggleChange($event) {
    console.log($event);
    this.triggerLoader();
    this.themingService.setThemeState($event.checked);
    this.themeToggleChecked$.next($event.checked);
    this.cdRef.detectChanges();
  }
}
