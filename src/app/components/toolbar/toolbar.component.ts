import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/libs/dal/services/authorization.service';
import { UserRole } from 'src/libs/dal/models/users/user-role.enum';
import { UserService } from 'src/libs/dal/services/user.service';
import { Router } from '@angular/router';
import { ThemingService } from 'src/libs/shared/services/theming.service';
import { User } from 'src/libs/dal/models';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Output()
  public navigationClickEvent: EventEmitter<any> = new EventEmitter();
  private galleryPath = '../../../assets/gallery';
  // public logoPath = `${this.galleryPath}/Files-Tech-Logo1.png`;
  public logoPath: string = `${this.galleryPath}/logo/logo-no-background.svg`;
  public githubIconPath = `${this.galleryPath}/GitHub-Mark-Light-32px.png`;
  public githubDarkIconPath = `${this.galleryPath}/GitHub-Mark-32px.png`;
  public linkedInIconPath = `${this.galleryPath}/LI-Logo.png`;
  public githubAccountLink = 'https://github.com/willyflies1';
  public linkedInAccountLink =
    'https://www.linkedin.com/in/hunter-files-236154195/';
  public isAuthenticated: boolean = false;
  public user: User | null = null;
  public darkTheme!: boolean;
  private localSubscriptions: Subscription = new Subscription();
  clickEvent!: () => void;

  constructor(
    private appSecurity: AuthorizationService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private router: Router,
    private themingService: ThemingService
  ) {}

  ngOnInit(): void {
    this.localSubscriptions
      .add(
        this.appSecurity.getIsAuthenticated().subscribe((isAuthenticated) => {
          this.isAuthenticated = isAuthenticated;
          this.cdRef.detectChanges();
        })
      )
      .add(
        this.userService
          .getUserDetails()
          .subscribe((user) => (this.user = user))
      )
      .add(
        this.themingService.isThemeDark().subscribe((dark) => {
          this.darkTheme = dark;
        })
      );
  }

  public navigateTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
    this.navigationClickEvent.emit(path);
  }

  public checkForAdminRole(user: User | null): boolean {
    return user && user.roles
      ? user?.roles?.some((role) => role.name === UserRole.ROLE_ADMIN)
      : false;
  }
}
