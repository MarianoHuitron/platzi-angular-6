import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/services/user.service';
import { RequestService } from 'src/app/services/request.service';
import { User } from 'src/app/interfaces/user';

export interface PromptModel {
  scope: any,
  currentRequest: any 
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel, OnInit {

  scope: any;
  currentRequest: any;
  shouldAdd: string = 'yes';
  sender: User;
  

  constructor(public dialogService: DialogService, private userService: UserService, private requestService: RequestService) {
    super(dialogService)
  }

  ngOnInit() {
    console.log(this.currentRequest);
    this.userService.getUserById(this.currentRequest.sender).valueChanges().subscribe((user: User) => {
      this.sender = user;
    }, err => console.log(err))
  }

  accept() {
    console.log(this.shouldAdd);
    if(this.shouldAdd == 'yes') {
      this.requestService.setRequestStatus(this.currentRequest, 'accepted').then((data) => {
        console.log(data);
        this.userService.addFriend(this.scope.user.uid, this.currentRequest.sender).then(() => {
          alert('Solicitud aceptad!');
        }).catch(err => console.log(err))
      }).catch((err) => {
        console.log(err);
      })
    } else if(this.shouldAdd == 'no') {
    
      this.requestService.setRequestStatus(this.currentRequest, 'rejected').then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
      })
      
    } else if(this.shouldAdd == 'later') {
      this.requestService.setRequestStatus(this.currentRequest, 'later').then((data) => {
        console.log(data);
      }).catch((err) => {
        console.log(err);
      })
    }
  }

 
  

}
