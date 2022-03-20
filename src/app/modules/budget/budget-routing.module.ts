import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { CreatorComponent } from './components/creator/creator.component';
import { HistoricalComponent } from './components/historical/historical.component';
import { OverviewComponent } from './components/overview/overview.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'create', component: CreatorComponent },
  { path: 'historical', component: HistoricalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
