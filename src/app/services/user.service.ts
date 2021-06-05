import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 

  constructor(private angularFireDataabase: AngularFireDatabase) { 
    
  }

  getUsers() {
    return this.angularFireDataabase.list('/users');
  }

  getUserById(uid) {
    return this.angularFireDataabase.object('/users/'+uid);
  }

  createUser(user) {
    return this.angularFireDataabase.object('/users/'+user.uid).set(user);
  }

  editUser(user) {
    return this.angularFireDataabase.object('/users/'+user.uid).set(user);
  }

  setAvatar(avatar, uid) {
    return this.angularFireDataabase.object('/users/'+uid+'/avatar').set(avatar);
  }

  addFriend(userId,friendId) {
    this.angularFireDataabase.object(`users/${userId}/friends/${friendId}`).set(friendId);
    return this.angularFireDataabase.object(`users/${friendId}/friends/${userId}`).set(userId);
  }


}
