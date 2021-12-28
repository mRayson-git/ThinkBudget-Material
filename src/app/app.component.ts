import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { Auth, browserSessionPersistence, inMemoryPersistence } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ThinkBudget-Material';
  isDarkTheme: boolean = false;
  darkmodePref: string | null;

  constructor(public auth: Auth, private overlayContainer: OverlayContainer) {
    this.auth.setPersistence(browserSessionPersistence);
    this.darkmodePref = localStorage.getItem('darkmodePref');
    if (this.darkmodePref == 'true') {
      this.toggleTheme()
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('darkmodePref', this.isDarkTheme.toString());
    this.applyThemeToOverlayContainers();
  }

  applyThemeToOverlayContainers() {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    // remove dark theme
    overlayContainerClasses.remove('dark-theme');
    if (this.isDarkTheme) this.overlayContainer.getContainerElement().classList.add('dark-theme');
  }

}
