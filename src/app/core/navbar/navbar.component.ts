import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Output() toggleTheme = new EventEmitter<void>();

  constructor(public dialog: MatDialog,
    public auth: Auth) { }

  ngOnInit(): void {
    console.log(this.auth.currentUser);
  }

  login() {
    console.log(this.auth.currentUser);
    const loginDialogRef = this.dialog.open(LoginDialogComponent, {
      minWidth: '600px',
    });

    loginDialogRef.afterClosed().subscribe(result => {
      console.log('Login has completed');
      console.log(this.auth.currentUser);
    });
  }

  logout() {
    this.auth.signOut().then(result => console.log('Signed out!'));
  }

}
