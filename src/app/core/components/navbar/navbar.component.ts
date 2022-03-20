import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NavButton } from '../../models/navButton';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() toggleTheme = new EventEmitter<void>();
  isMobile: boolean = false;

  //auth navBtns
  loginBtn: NavButton = {
    label: 'Login',
    icon: 'login',
    route: 'account/login'
  }
  logoutBtn: NavButton = {
    label: 'Logout',
    icon: 'logout',
    route: 'home'
  }
  //account navBtns
  accountInfoBtn: NavButton = {
    label: 'Information',
    icon: 'info',
    route: 'account/info'
  }
  //budget navBtns
  budgetOverviewBtn: NavButton = {
    label: 'Overview',
    icon: 'bar_chart',
    route: 'budget/overview'
  }
  budgetCreateBtn: NavButton = {
    label: 'Create/Edit',
    icon: 'edit',
    route: 'budget/create'
  }
  //transactions navBtns
  transactionOverviewBtn: NavButton = {
    label: 'Transactions',
    icon: 'receipt_long',
    route: 'transaction/overview'
  }


  constructor(public dialog: MatDialog,
    public auth: Auth,
    public router: Router) { }

  ngOnInit(): void {
    this.isMobile = this.isSmallScreen();
  }

  onResize(event: any): void {
    this.isMobile = this.isSmallScreen();
  }

  isSmallScreen(): boolean {
    if (window.innerWidth < 768) return true;
    return false;
  }

  logout() {
    this.auth.signOut().then(result => {
      console.log('Signed out!');
    });
  }

}
