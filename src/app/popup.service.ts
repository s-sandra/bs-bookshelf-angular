import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private popup: MatSnackBar) {}

  /**
   * Show snackbar with user message and optional action button.
   * @param message the string message to display.
   * @param action optionally, the name of the action the user can
   * take to respond to the message.
   * @returns a reference to the snackbar display.
   */
  show(message: string, action?: string): MatSnackBarRef<SimpleSnackBar> {
    return this.popup.open(message, action, {
      duration: 4000,
    });
  }

  /**
   * Displays dismisable snackbar with error message.
   * @param message the string error message.
   * @returns a reference to the snackbar display.
   */
  error(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.popup.open(message, 'Dismiss', {});
  }
}
