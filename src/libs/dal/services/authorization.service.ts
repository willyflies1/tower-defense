import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { BehaviorSubject, noop, Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SessionUtilityService } from 'src/libs/dal';
import { AuthorizationRequest } from 'src/libs/dal/models/users';
import { Credentials } from '../models/users/credentials';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private snackbarConfig: MatSnackBarConfig<any> | undefined = {
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    duration: 2000,
  };

  constructor(
    private http: HttpClient,
    private sessionUtility: SessionUtilityService,
    private snackbar: MatSnackBar
  ) {}

  public authenticate(credentials: Credentials, callback: any) {
    let header = {};
    if (credentials) {
      header = {
        user: 'Basic' + btoa(credentials.username + ':' + credentials.password),
      };
    }

    this.http
      .get<AuthorizationRequest>(environment.endpoints.api + '/authenticate', {
        headers: header,
        withCredentials: true,
        observe: 'response',
      })
      .subscribe(
        (authResponse) => {
          // console.log('Response', authResponse);
          if (authResponse.body?.accessJwt && authResponse.body?.refreshJwt) {
            this.authSubject.next(true);
            this.sessionUtility.setAccessToken(authResponse.body.accessJwt);
            this.sessionUtility.setRefreshToken(authResponse.body.refreshJwt);

            this.snackbar.open(
              'Successfully authenticated user',
              'Dismiss',
              this.snackbarConfig
            );
          } else {
            // this.authenticated = false
            this.authSubject.next(false);
          }
          return callback && callback(authResponse.body?._user);
        },
        (error) => {
          this.snackbar.open(
            'Failed to authenticate user',
            'Dismiss',
            this.snackbarConfig
          );
        }
      );
  }

  public refreshAuthenticationToken(): Observable<
    HttpResponse<AuthorizationRequest>
  > {
    let header: {[key: string]: string} = {};
    this.sessionUtility.getRefreshToken()
      ? (header[
          'Authorization'
        ] = `Bearer ${this.sessionUtility.getRefreshToken()}`)
      : noop();

    return this.http.get<AuthorizationRequest>(
      environment.endpoints.api + '/refreshToken',
      {
        headers: header,
        withCredentials: true,
        observe: 'response',
      }
    );
  }

  public getIsAuthenticated(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  public signOut(): void {
    this.authSubject.next(false);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      console.error('Error - 409', error);
    } else {
      console.error('Error', error);
    }

    return throwError('An error has occured');
  }
}
