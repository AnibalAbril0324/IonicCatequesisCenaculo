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
    const loading=await this.utilsSvc.loading();
    await loading.present();

    if(this.form.valid ) {
        this.firebase.singIn(this.form.value as User).then(res =>{
        console.log(res);
      }).catch(error =>{ 
        console.log(error);
      }).finally(() => {
        loading.dismiss();
      })
    }
  }
}
