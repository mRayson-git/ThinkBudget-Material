import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget.component';
import { CreatorComponent } from './creator/creator.component';
import { OverviewComponent } from './overview/overview.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { HistoricalComponent } from './historical/historical.component';


@NgModule({
  declarations: [
    BudgetComponent,
    CreatorComponent,
    OverviewComponent,
    HistoricalComponent
  ],
  imports: [
    CommonModule,
    BudgetRoutingModule,
    SharedModule,
    MaterialModule,
  ]
})
export class BudgetModule { }
