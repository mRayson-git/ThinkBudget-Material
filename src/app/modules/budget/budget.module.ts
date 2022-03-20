import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget.component';
import { CreatorComponent } from './components/creator/creator.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoricalComponent } from './components/historical/historical.component';
import { OverviewComponent } from './components/overview/overview.component';


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
