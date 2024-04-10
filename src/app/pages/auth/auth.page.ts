import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/modules/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required])
  });
  
  firebase= inject(FirebaseService);
  utilsSvc= inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }

  async submit(){
  
    if(this.form.valid ) {

      const loading=await this.utilsSvc.loading();
      await loading.present();

        this.firebase.singIn(this.form.value as User).then(res =>{

        this.getUserInfo(res.user.uid);

      }).catch(error =>{ 

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color:'primary',
          position:'middle',
          icon: 'alert-circle'
          
        });
        console.log(error);
      }).finally(() => {
        loading.dismiss();
      })
    }
  }

  async getUserInfo(uid:string){

    if(this.form.valid ) {
      const loading=await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebase.getDocument(path).then( (user: User) =>{
        
      this.utilsSvc.saveInLocalStorage('user',user);

      //enrutamos a la pagina home
      this.utilsSvc.routerLink('/main/home')
      //limpiamos los campos del formulario
      this.form.reset();

      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${user.name}`,
        duration: 1500,
        color:'primary',
        position:'middle',
        icon: 'person-circle-outline'
        
      });

      }).catch(error =>{ 

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color:'primary',
          position:'middle',
          icon: 'alert-circle'
          
        });
        console.log(error);
      }).finally(() => {
        loading.dismiss();
      })
    }
  }
}
