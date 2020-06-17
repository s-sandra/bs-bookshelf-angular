import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  user: firebase.User;
  provider: auth.GoogleAuthProvider;

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private popup: PopupService) {

      // ask for permission to access Google Bookshelf
      this.provider = new auth.GoogleAuthProvider();
      this.provider.addScope('https://www.googleapis.com/auth/books');

      this.user = null;
      this.fireAuth.authState
        .subscribe(user => {
          if (user) {
            if (this.isExpired()) {
              this.signOut();  // logout user if access expired.
            }
            else {
              this.user = user;
            }
          }
        });
  }

  /**
   * Returns whether user access token is expired.
   */
  isExpired(): boolean {
    const created = localStorage.getItem('timestamp');
    const HOUR = 3600000;  // one hour in milliseconds.
    if (!created) {
      return true;
    }
    if (Number(created) + HOUR <= Date.now()) {
      return true;
    }
    return false;
  }

  /**
   * Stores OAuth access token.
   * @param credential Google user's OAuth credential
   */
  private setCredentials(credential: auth.OAuthCredential): void {
    const token = credential.accessToken;
    localStorage.setItem('token', token);
    const timestamp = Date.now().toString();
    localStorage.setItem('timestamp', timestamp);
  }

  /**
   * Google sign-in with popup.
   */
  async signIn() {
    try {
        const result = await this.fireAuth.signInWithPopup(this.provider);
        if (result.credential) {
          this.setCredentials(result.credential as auth.OAuthCredential);
        }
        this.router.navigate(['search']);
    }
    catch (error) {
        console.error('Unable to sign in:', error.message);
        this.popup.show('An error occurred! Unable to sign in.');
    }
  }

  async signOut() {
    try {
      console.log('signing out...');
      await this.fireAuth.signOut();
      localStorage.clear();
      location.reload();
    }
    catch (error) {
      console.error('Unable to sign out:', error.message);
      this.popup.show('An error occurred! Unable to sign out.');
    }
  }
}

export interface User {
  name: string;
  photo: string;
}
