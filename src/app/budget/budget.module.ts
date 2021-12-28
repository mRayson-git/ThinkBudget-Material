import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget.component';
import { CreatorComponent } from './creator/creator.component';
import { OverviewComponent } from './overview/overview.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';


@NgModule({
  declarations: [
    BudgetComponent,
    CreatorComponent,
    OverviewComponent
  ],
  imports: [
    CommonModule,
    BudgetRoutingModule,
    SharedModule,
    MaterialModule,
  ]
})
export class BudgetModule { }
