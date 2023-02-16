import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { XsrfInterceptor } from './interceptors/xsrf-interceptor';
import { SessionUtilityService } from './services/session-utility.service';
import { JwtInterceptor } from './interceptors/jwt-interceptor';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: XsrfInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    HttpClientXsrfModule,
    SessionUtilityService,
  ]
})
export class DalModule {}
