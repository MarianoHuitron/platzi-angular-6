import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
// import { FacebookAuthProvider } from 'firebase/auth';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  loginWithEmail(email: string, password: string) {
    // this.angularFireAuth
    
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  loginWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      console.log(result);
    }).catch(err => console.log(err))
  }

  registerWithEmail(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  getStatus() {
    return this.angularFireAuth.authState;
  }

  logOut() {
    return this.angularFireAuth.auth.signOut();
  }
}
