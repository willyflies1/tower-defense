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
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {
  private headerName: string = 'X-XSRF-TOKEN';

  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private http: HttpClient
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request);
    // ** Currently not implmented
    // let modReq: HttpRequest<any> = request.clone({});
    // // add xhr
    // modReq.headers.append('X-Requested-With', 'XMLHttpRequest');

    // // Return if a non-mutating request.
    // if (request.method === 'GET' || request.method === 'OPTION') {
    //   return next.handle(modReq);
    // }

    // modReq = this.handleToken(modReq, request);

    // return next.handle(modReq).pipe(
    //   tap((event) => {
    //     if (event instanceof HttpResponse) {
    //       console.log('Response', event);
    //     }
    //   }),
    //   catchError((err) => {
    //     if (err instanceof HttpErrorResponse) {
    //       console.log('Response Error', err);
    //     }
    //     return of(err);
    //   })
    // );
  }

  private handleToken(
    modReq: HttpRequest<any>,
    request: HttpRequest<any>
  ): HttpRequest<any> {
    // Grab token
    let xsrfToken = this.tokenExtractor.getToken() as string;
    // Only set if a token was grabbed and no pre-existing header
    // of the same name.
    if (xsrfToken && !request.headers.has(this.headerName)) {
      modReq.headers.set(this.headerName, xsrfToken);
    }
    return modReq;
  }
}
