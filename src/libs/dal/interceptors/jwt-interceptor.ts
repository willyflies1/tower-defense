import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpXsrfTokenExtractor,
  HttpClient,
  HttpResponseBase,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { SessionUtilityService, UserService } from '../';
import { AuthorizationService } from 'src/libs/dal/services/authorization.service';
import { AuthorizationRequest } from '../models/users';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private headerName: string = 'X-XSRF-TOKEN';
  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private sessionUtility: SessionUtilityService,
    private authService: AuthorizationService,
    private userService: UserService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Return if a non-mutating request.
    if (
      (request.method === 'POST' ||
        request.method === 'PUT' ||
        request.method === 'DELETE' ||
        request.method === 'GET') &&
      this.sessionUtility.getAccessToken()
    ) {
      let modReq: HttpRequest<any> = request.clone({});

      // Add 'session' header with jwt token
      modReq = this.handleToken(modReq);

      return next.handle(modReq).pipe(
        catchError((error) => {
          if (
            error.status === 401 &&
            !request.url.includes('authenticate')
          ) {
            return this.handleUnauthorizedError(request, next);
          }
          return throwError(error);
        })
      );
    } else {
      return next.handle(request);
    }
  }

  private handleToken(modReq: HttpRequest<any>): HttpRequest<any> {
    // Get jwt from session if in session
    let jwt: string | null;
    if(modReq.url === '/csm/api/v1/refreshToken'){
      jwt = this.sessionUtility.getRefreshToken();
    } else {
      jwt = this.sessionUtility.getAccessToken();
    }
    if (jwt) {
      jwt = 'Bearer ' + jwt;
      modReq.headers.set('Authorization', jwt);
      // modReq.headers.append('Authorization', jwt);
      return modReq.clone({ setHeaders: { Authorization: jwt } });
    }

    return modReq;
  }

  private handleUnauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.sessionUtility.getRefreshToken();
      if (token) {
        return this.authService.refreshAuthenticationToken().pipe(
          switchMap((resp: HttpResponse<AuthorizationRequest>) => {
            this.isRefreshing = false;
            if (resp.body) {
              this.sessionUtility.setAccessToken(resp.body.accessJwt);
              this.refreshTokenSubject.next(resp.body.accessJwt);
            }
            return next.handle(this.handleToken(request));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.userService.logout();
            return throwError(error);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(request))
    );
  }
}
