import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './settings/settings.component';
import { ParsersComponent } from './parsers/parsers.component';
import { LayoutDialogComponent } from './parsers/layout-dialog/layout-dialog.component';
import { BudgetComponent } from './budget/budget.component';


@NgModule({
  declarations: [
    AccountComponent,
    SettingsComponent,
    ParsersComponent,
    LayoutDialogComponent,
    BudgetComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class AccountModule { }
