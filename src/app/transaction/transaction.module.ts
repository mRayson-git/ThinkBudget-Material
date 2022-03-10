import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { OverviewComponent } from './overview/overview.component';
import { TransDialogComponent } from './trans-dialog/trans-dialog.component';
import { ImportMenuComponent } from './import-menu/import-menu.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { HistoryComponent } from './history/history.component';


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
