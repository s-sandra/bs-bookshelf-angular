import { Injectable } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  scanner: ZXingScannerComponent;
  scanned: boolean;  // whether code detected and scanner closed.
  scanning: boolean;  // whether barcode not detected.
  success: boolean;  // whether barcode successfully detected.
  status: string;  // the status of barcode scanning.
  permission: boolean;  // whether user gave permission to use camera.

  // Modern ISBN codes in EAN-13 format.
  codeFormats = [
    BarcodeFormat.EAN_13
  ];

  constructor(private popup: PopupService) {
    this.scanned = false;
    this.scanning = false;
    this.success = false;
    this.status = 'inactive';
    this.permission = null;
    this.scanner = new ZXingScannerComponent();
    this.init();
  }

  /**
   * Asks for camera access permission.
   */
  private async init() {
    try {
      this.permission = await this.scanner.askForPermission();
    }
    catch (error) {
      this.popup.error('Unable to get permission to use your camera.');
      console.error('Unable to obtain camera permission: ', error);
    }
  }

  /**
   * Change state variables to make scanner
   * overlay close.
   */
  close(): void {
    this.scanning = false;
    this.status = 'inactive';
  }

  /**
   * Change state variables to make scanner
   * overlay open.
   */
  open(): void {
    this.scanning = true;
    this.scanned = false;
    this.success = false;
  }
}
