import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() toggleTheme = new EventEmitter<void>();

  constructor(public dialog: MatDialog,
    public auth: Auth,
    public router: Router) { }

  ngOnInit(): void { }

  login() {
    const loginDialogRef = this.dialog.open(LoginDialogComponent, {
      minWidth: '400px',
    });

    loginDialogRef.afterClosed().subscribe(result => {
      console.log('Login has completed');
    });
    
  }

  logout() {
    this.auth.signOut().then(result => {
      console.log('Signed out!');
      this.router.navigate(['/home']);
    });
  }

}
