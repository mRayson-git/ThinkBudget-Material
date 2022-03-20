import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AuthComponent } from './components/auth/auth.component';
import { InfoComponent } from './components/info/info.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['account/login']);

const routes: Routes = [
  { path: '', component: AccountComponent, children: [
    { path: 'login', component: AuthComponent, data: {isLogin: true} },
    { path: 'register', component: AuthComponent, data: {isLogin: false} },
    { path: 'info', component: InfoComponent, canActivate: [AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
