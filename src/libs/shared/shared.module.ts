import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSanitizePipe } from './pipes';
import { ThemingService } from './services/theming.service';



@NgModule({
  declarations: [NoSanitizePipe],
  imports: [
    CommonModule,
  ],
  providers: [
    ThemingService
  ]
})
export class SharedModule { }
