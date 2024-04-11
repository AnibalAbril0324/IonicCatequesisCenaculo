import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-student',
  templateUrl: './add-update-student.component.html',
  styleUrls: ['./add-update-student.component.scss'],
})
export class AddUpdateStudentComponent  implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
    edad: new FormControl('',[Validators.required,Validators.minLength(4)]),
    nivel: new FormControl('',[Validators.required,Validators.minLength(4)]),
  });

  constructor() { }

  firebaseService =inject(FirebaseService);
  utilsSvc=inject(UtilsService)
  ngOnInit() {
  }

  //=============tomar/seleccionar una imagen========= 
  async takeImage(){
    const dataUrl= (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  //la palabra async representa la eventual finalizacion (exito o fracaso) de una operacion asincrona
  async submit(){
    if(this.form.valid){
      
      const loading=await this.utilsSvc.loading();
      await loading.present();
      
      //imprime en consola las credenciales ingresadas
      //enviamos el formulario al servicio para crear usuarios nuevos
      this.firebaseService.singUp(this.form.value as User).then( async res => {
        
        await this.firebaseService.updateUser(this.form.value.name);

        //obtenemos el uid y lo agregamos al formulario
        let uid= res.user.uid;
        //this.form.controls.uid.setValue(uid); 

        //imprime la respuesta a las credenciales ingresadas desde firebase
        console.log(res);

      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'ERROR  EL CORREO O CONTRASEÑA SON INCORRECTOS',
          duration: 2500,
          color:'primary',
          position:'middle',
          icon: 'alert-circle'
        });

      }).finally( () => {
        loading.dismiss();
      })
    }
    console.log(this.form.value);

  }

}
