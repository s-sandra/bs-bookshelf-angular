import { Component, Inject } from '@angular/core';
import { ScannerService } from '../scanner.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-scanner-dialog',
  templateUrl: './scanner-dialog.component.html',
  styleUrls: ['./scanner-dialog.component.scss']
})
export class ScannerDialogComponent {

  constructor(
    public scanner: ScannerService,
    private dialogRef: MatDialogRef<ScannerDialogComponent>,
    private popup: PopupService,
    @Inject(MAT_DIALOG_DATA) public code: string) { }

  /**
   * Changes scanner status and emits ISBN code on
   * scanner success.
   * @param code the isbn code obtained from scanner.
   */
  onScanSuccess(code: string): void {
    // accept only if code has not already been detected
    if (!this.scanner.success) {
      this.scanner.success = true;
      this.scanner.status = `Code: EAN ${code}`;

      // wait 2 seconds before closing overlay
      setTimeout(() => {
        this.scanner.scanned = true;
        this.dialogRef.close({code});
      }, 1500);
    }
  }

  onScanError(error: any) {
    console.error(error);
    this.popup.error('An error occurred during scanning.');
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.scanner.close();
  }
}
