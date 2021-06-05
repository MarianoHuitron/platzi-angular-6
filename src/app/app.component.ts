import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interfaces/user';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { RequestService } from './services/request.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { RequestComponent } from './modals/request/request.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'platzinger';
  user: User;
  requests: any[] = [];
  mailsShow: any[] = [];

  constructor(
    public router: Router, 
    private authenticationService: AuthenticationService, 
    private userService: UserService, 
    private requestService: RequestService,
    public dialogService: DialogService  
  ) {
    this.authenticationService.getStatus().subscribe(status => {
      this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
        this.user = data;
        this.requestService.getRequestForEmail(this.user.email).valueChanges().subscribe((requests) => {
          this.requests = requests;
          this.requests = this.requests.filter((r) => {
            return r.status !== 'accepted' && r.status !== 'rejected';
          });
          this.requests.forEach((r) => {
            if(this.mailsShow.indexOf(r.sender) === -1) {
              this.mailsShow.push(r.sender);
              this.dialogService.addDialog(RequestComponent, {scope: this, currentRequest: r})
            }
          })
        }, err => console.log(err))
      })
    })  
  }




}
