import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { CreatorComponent } from './creator/creator.component';
import { HistoricalComponent } from './historical/historical.component';

const routes: Routes = [
  { path: '', component: BudgetComponent },
  { path: 'create', component: CreatorComponent },
  { path: 'historical', component: HistoricalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
