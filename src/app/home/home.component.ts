import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  friends: User[];
  query: string = '';
  user: User;
  friendEmail: string = '';
  messageFriend: string = '';

  constructor(private userService: UserService, private authenticationService: AuthenticationService, private router: Router, private modalService: NgbModal, private requestService: RequestService) {     
    this.userService.getUsers().valueChanges().subscribe((data: User[]) => {
      this.friends = data;

  
    }, error => {
      console.log(error);
    });

    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
        this.user = data;
        console.log(this.user);
        if(this.user.friends) {
          this.user.friends = Object.values(this.user.friends);
          console.log(this.user);
        }
      }, err => console.log(err))
    }, err => console.log(err))

  }

  logout() {
    this.authenticationService.logOut().then(() => {
      alert('Sesión cerrada');
      this.router.navigate(['login']);
    })
    .catch(err=> console.log(err)) 
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiver_email: this.friendEmail,
      sender:this.user.uid,
      status: 'pending',
      message: this.messageFriend 
    }

    this.requestService.createRequest(request).then(() => {
      alert('Solicitud enviada!')
    }, err => {
      alert('Hubo un error')
      console.log(err);
    })
  }

  

  ngOnInit() {
    
  }

}
