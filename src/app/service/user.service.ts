import { Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userState!: Observable<User | null>;
  public user?: User | null;

  constructor(public auth: Auth) { 
    if (auth) {
      this.userState = authState(auth);
      this.userState.subscribe(user => this.user = user);
    }
  }

  getUser(): User | null | undefined{
    return this.user;
  }
}
