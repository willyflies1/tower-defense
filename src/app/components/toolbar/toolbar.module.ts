import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    RouterModule,
    MatSidenavModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
