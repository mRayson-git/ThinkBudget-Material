import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomepageComponent } from './homepage/homepage.component';
import { MissingComponent } from './missing/missing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from '../shared/material.module';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';



@NgModule({
  declarations: [
    HomepageComponent,
    MissingComponent,
    NavbarComponent,
    LoginDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
  ],
  exports: [
    NavbarComponent
  ]
})
export class CoreModule { }
