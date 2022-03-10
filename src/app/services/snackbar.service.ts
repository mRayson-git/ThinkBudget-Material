import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(public snackbar: MatSnackBar) { }

  createMessage(type: string, content: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    if (type == 'success') {
      config.panelClass = ['success'];
      this.snackbar.open(content, undefined, config);
    } else {
      config.panelClass = ['danger'];
      this.snackbar.open(content, undefined, config);
    }
  }
}
