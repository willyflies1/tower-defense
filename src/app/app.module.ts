import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, } from '@angular/platform-browser';
import { BrowserAnimationsModule, } from '@angular/platform-browser/animations';
import { RouterModule, ROUTES } from '@angular/router';
import { BoardComponent } from 'src/libs/core/board/board.component';
import { AuthorizationService } from 'src/libs/dal';
import { DalModule } from 'src/libs/dal/dal.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SiteBaseViewComponent } from './components/site-base-view/site-base-view.component';
import { ToolbarModule } from './components/toolbar/toolbar.module';


@NgModule({
  declarations: [AppComponent, SiteBaseViewComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    // Material
    MatButtonModule,
    MatCommonModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatSnackBarModule,
    // Components
    ToolbarModule,
    DalModule,
    RouterModule.forRoot([
      { path: 'board', component: BoardComponent},
      { path: '', component: BoardComponent}
      // {'home', component: HomeComponent}
    ])
  ],
  providers: [AuthorizationService],
  bootstrap: [AppComponent],
  exports: [
    SiteBaseViewComponent
  ]
})
export class AppModule {}
