import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { OverviewComponent } from './overview/overview.component';
import { TransactionComponent } from './transaction.component';

const routes: Routes = [
  { path: '', component: OverviewComponent },
  { path: 'history', component: HistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
