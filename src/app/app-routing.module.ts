import { NgModule } from '@angular/core';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './core/components/homepage/homepage.component';
import { MissingComponent } from './core/components/missing/missing.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['account/login']);

const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'account', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule)},
  { path: 'transaction', loadChildren: () => import('./modules/transaction/transaction.module').then(m => m.TransactionModule), canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'budget', loadChildren: () => import('./modules/budget/budget.module').then(m => m.BudgetModule), canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: '**', component: MissingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
