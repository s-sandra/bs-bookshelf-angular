import { Component,
        Output,
        EventEmitter,
        HostListener } from '@angular/core';
import { ScannerService } from '../scanner.service';
import { PopupService } from '../popup.service';
import { ScannerDialogComponent } from '../scanner-dialog/scanner-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {

  @Output() scanResult: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public scanner: ScannerService,
    private dialog: MatDialog,
    private popup: PopupService) { }

  /**
   * Closes scanner overlay on escape key press.
   */
  @HostListener('document:keydown', ['$event'])
  private handleKeydown(event: KeyboardEvent) {
    if (event.code === 'Escape') {
      this.dialog.closeAll();
      this.scanner.close();
    }
  }

  /**
   * Opens scanner overlay.
   */
  openScanner(): void {
    if (!this.scanner.permission) {
      this.popup.error('Unable to get permission to use your camera');
      return;
    }

    const config = {
      width: '100vw',
      height:  '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdrop: false,
    };

    this.scanner.open();
    this.dialog.open(ScannerDialogComponent, config)
      .afterClosed()
      .subscribe(response => {
        if (response) {
          this.scanResult.emit(response.code);
        }
      });
  }
}
