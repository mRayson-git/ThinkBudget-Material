import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ParsersComponent } from './components/parsers/parsers.component';
import { LayoutDialogComponent } from './components/parsers/layout-dialog/layout-dialog.component';
import { BudgetComponent } from './components/budget/budget.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


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
