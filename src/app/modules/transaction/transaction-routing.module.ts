import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './components/history/history.component';
import { OverviewComponent } from './components/overview/overview.component';
import { TransactionComponent } from './transaction.component';

const routes: Routes = [
  { path: '', component: TransactionComponent, children: [
    { path: 'history', component: HistoryComponent},
    { path: 'overview', component: OverviewComponent }
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
