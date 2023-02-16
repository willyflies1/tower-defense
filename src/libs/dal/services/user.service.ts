import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, noop, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthorizationService } from 'src/libs/dal/services/authorization.service';
import { environment } from 'src/environments/environment';
import { SessionUtilityService } from './session-utility.service';
import { Credentials, User, UserRole} from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private user: User | null = null;
  private userDetails: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthorizationService,
    private sessionUtility: SessionUtilityService
  ) {}

  /**
   * Gets the status of the users login state.
   * @returns whether or not the user is logged in.
   */
  public userLoginStatus(): Observable<boolean> {
    return this.isLoggedIn.asObservable();
  }

  public register(user: User) {
    // ** Add headers

    // ** Add Path
    const targetUrl: string = environment.endpoints.api + '/users/create';

    // ** Post payload
    this.http.post<User>(targetUrl, user).subscribe((response) => {
      // Navigates to login after User has successfully been registered
      this.router.navigateByUrl('/login');
    });
  }

  /**
   * NEVER USED
   * @param credentials
   */
  public login(credentials: Credentials) {
    this.authService.authenticate(credentials, (user) => {
      this.user = user;
      this.userDetails.next(user);
      this.isLoggedIn.next(true);
      this.user?.roles?.some( role => role.name === UserRole.ROLE_ADMIN)
        ? this.router.navigateByUrl('/admin-dashboard')
        : this.router.navigateByUrl('/user-profile');
    });
  }

  public logout() {
    const targetUrl = environment.endpoints.api + '/user/logout';
    this.sessionUtility.signOut(); // Clear session
    this.authService.signOut();
    this.user = null;
    this.userDetails.next(null);
    this.router.navigateByUrl('/login');
    // this.http.post(targetUrl, '');  // Currently not implemented on API
  }

  public deleteUser(): Observable<User> {
    return this.http.delete<User>(environment.endpoints.api + '/users/delete');
  }

  public getUserDetails(): Observable<User | null> {
    return this.userDetails.asObservable();
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(environment.endpoints.api + '/users');
  }
}
