import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { HistoryComponent } from './components/history/history.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImportMenuComponent } from './components/import-menu/import-menu.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TransDialogComponent } from './components/trans-dialog/trans-dialog.component';


@NgModule({
  declarations: [
    TransactionComponent,
    OverviewComponent,
    TransDialogComponent,
    ImportMenuComponent,
    HistoryComponent
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class TransactionModule { }
