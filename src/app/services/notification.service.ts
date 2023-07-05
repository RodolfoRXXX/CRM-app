import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private _snackBar: MatSnackBar
  ) {}

  showError(msg: string) {
    this.open(msg ,5000, 'error');
  }
 
  showSuccess(msg: string) {
    this.open(msg ,2000, 'success');
  }
 
  showInfo(msg: string) {
    this.open(msg ,5000, 'info');
  }
 
  showWarn(msg: string) {
    this.open(msg ,5000, 'warning');
  }

  private open(message: string,
              duration: number = 5000,
              type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {

    const config: MatSnackBarConfig = {
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [`snackbar-type-soft-${type}`]
    };
    this._snackBar.open(message , 'X', config);

  }

}
