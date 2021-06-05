import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;

  constructor(
    private userService: UserService, 
    private authenticationService: AuthenticationService,
    private firebaseStorage: AngularFireStorage  
  ) { 
    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
        this.user = data;
        console.log(this.user);
      }, err => console.log(err))
    }, err => console.log(err))
  }

  ngOnInit() {
  }

  saveSettings() {
    if(this.croppedImage) {
      console.log('yes');
      const currentPictureId = Date.now();
      const pictures = this.firebaseStorage.ref('pictures/'+currentPictureId+'.jpg').putString(this.croppedImage, 'data_url');
      pictures.then((result) => {
        this.picture = this.firebaseStorage.ref('pictures/'+currentPictureId + '.jpg').getDownloadURL();
        
        this.picture.subscribe((p) => {
          this.userService.setAvatar(p, this.user.uid).then(() => {
            alert('Imagen subida');
          }).catch(err => console.log(err)) 
        }, err => console.log(err))
      }).catch(err => console.log(err))
    } else {
      this.userService.editUser(this.user).then(() => {
        alert('Cambios guardados')
      }, err => {
        alert('Hubo un error');
        console.log(err);
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
