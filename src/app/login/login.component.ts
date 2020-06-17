import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  logoGoogle = faGoogle;
  constructor(public firebase: FirebaseService) { }

  onSignIn() {
    this.firebase.signIn();
  }

  onSignOut() {
    this.firebase.signOut();
  }

}
