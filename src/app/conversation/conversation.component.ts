import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  friendId: any;
  friend: User;
  user: User;
  conversation_id: string;
  textMessage: string;
  conversation: any[];
  shake: boolean = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private userService: UserService, 
    private conversationService: ConversationService, 
    private authenticationSerivice: AuthenticationService,
    private firebaseStorage: AngularFireStorage  
  ) { 
    this.friendId = this.activatedRoute.snapshot.params['uid'];
    
    

    this.authenticationSerivice.getStatus().subscribe(sesion => {
      this.userService.getUserById(sesion.uid).valueChanges().subscribe((user: User) => {
        this.user = user;
        this.userService.getUserById(this.friendId).valueChanges().subscribe((data: User) => {
          this.friend = data;
          console.log(this.friend);
          
          const ids = [this.user.uid, this.friend.uid].sort();
          this.conversation_id = ids.join('|');
          this.getConversation();
        }, error => console.log(error))
      })
    })
  }

  ngOnInit() {
  }

  sendMessage() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    }
    this.conversationService.createconversation(message).then(() => {
      this.textMessage = '';
    })
  }

  sendZumbido() {
    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: null,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    }
    this.conversationService.createconversation(message).then(() => {
      
    });
    this.doZumbido();
  }

  doZumbido() {
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    setTimeout(() => {
      this.shake = false;
    }, 1000)
  }


  getConversation() {
    this.conversationService.getConversation(this.conversation_id).valueChanges().subscribe((res) => {
      console.log(res);
      this.conversation = res;
      this.conversation.forEach((message) => {
        if(!message.seen) {
          message.seen = true;
          this.conversationService.editConversation(message);
          if(message.type == 'text') {
            const audio = new Audio('assets/sound/new_message.m4a');
            audio.play();
          } else if(message.type == 'zumbido'){
            this.doZumbido();
          }

          
          
        }
      })
    }, err => console.log(err))
  }

  getUserNickById(id) {
    if(id === this.friend.uid) {
      return this.friend.nick;
    } else {
      return this.user.nick;
    }
  }

  send() {

    const message = {
      uid: this.conversation_id,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    }
    

    if(this.croppedImage) {
      message.type = 'picture';
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('pictures/'+currentPictureId+'.jpg').putString(this.croppedImage, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('pictures/'+currentPictureId + '.jpg').getDownloadURL();
        this.picture.subscribe((p) => {
          message.text = p;
          this.conversationService.createconversation(message).then(() => {
            this.croppedImage = '';
            this.imageChangedEvent = '';
          }).catch(err => console.log(err)) 
        }, err => console.log(err))
      }).catch(err => console.log(err))
    } else {
      this.conversationService.createconversation(message).then(() => {
        this.textMessage = '';
      })
    }

    
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
      this.croppedImage = image;
  }
  imageLoaded() {
      // show cropper
  }
  loadImageFailed() {
      // show message
  }
}
