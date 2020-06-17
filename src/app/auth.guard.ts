import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthGuard implements CanLoad {

  constructor(
    private firebase: FirebaseService,
    private router: Router) {}

  canLoad(): boolean {
    if (this.firebase.user) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
