import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/modules/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  
  form = new FormGroup({
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
        console.log(res);
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
