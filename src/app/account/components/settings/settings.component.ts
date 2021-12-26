import { Component, OnInit } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { FormGroup, FormControl } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public userState: Observable<User | null> = EMPTY;
  currUser?: User | null;

  accountForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(public auth: Auth) {
    // get current user information
    this.currUser = auth.currentUser;
    this.accountForm.get('email')?.setValue(this.currUser?.email);
  }

  ngOnInit(): void { }

}
