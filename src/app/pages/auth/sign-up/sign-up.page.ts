import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required]),  
    name: new FormControl('',[Validators.required,Validators.minLength(4)])
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

      this.firebase.singUp(this.form.value as User).then( async res =>{

        await this.firebase.updateUser(this.form.value.name);

        //obtenemos el uid y lo agregamos al formulario
        let uid= res.user.uid;
        this.form.controls.uid.setValue(uid);

        //llamamos a la funciona para guardar en la base de datos
        this.setUserInfo(uid);

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


  async setUserInfo(uid:string){

    if(this.form.valid ) {
      const loading=await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;

      this.firebase.setDocument(path,this.form.value).then( async res =>{
        
      this.utilsSvc.saveInLocalStorage('user',this.form.value);

      //enrutamos a la pagina home
      this.utilsSvc.routerLink('/main/home')
      //limpiamos los campos del formulario
      this.form.reset();

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
