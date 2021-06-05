import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  createRequest(request) {
    console.log(request);
    const cleanEmail = request.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('requests/'+cleanEmail+'/'+request.sender).set(request);
  }

  setRequestStatus(request,status) {
    const cleanEmail = request.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('requests/'+cleanEmail+'/'+request.sender+'/status').set(status);
  }

  getRequestForEmail(email) {
    const cleanEmail = email.replace('.', ',');
    return this.angularFireDatabase.list('requests/'+cleanEmail);
  }
  
}
