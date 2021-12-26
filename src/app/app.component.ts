import { Component } from '@angular/core';
import { Auth, inMemoryPersistence } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ThinkBudget-Material';
  isDarkTheme: boolean = false;

  constructor(public auth: Auth) {
    this.auth.setPersistence(inMemoryPersistence);
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}
