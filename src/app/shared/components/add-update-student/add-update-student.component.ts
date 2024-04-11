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
    id: new FormControl(''),
    image: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.minLength(4)]),
    edad: new FormControl('',[Validators.required,Validators.min(2)]),
    nivel: new FormControl('',[Validators.required,Validators.minLength(4)]),
  });

  constructor() { }

  firebaseService =inject(FirebaseService);
  utilsSvc=inject(UtilsService)
  user={} as User;


  ngOnInit() {
    this.user= this.utilsSvc.getFromLocalStorage('user');
    //if(this.product) this.form.setValue(this.product);
  }

  //=============tomar/seleccionar una imagen========= 
  async takeImage(){
    const dataUrl= (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  //la palabra async representa la eventual finalizacion (exito o fracaso) de una operacion asincrona
  async submit(){
    if(this.form.valid){
      
      let path= `users/${this.user.uid}/students`

      const loading=await this.utilsSvc.loading();
      await loading.present();
      
       //subir la imagen y obtener la url
      let dataUrl = this.form.value.image;
      let imagePath= `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseService.uploadImage(imagePath,dataUrl); 
      this.form.controls.image.setValue(imageUrl);

        //eliminamos el id porque estamos agregando un producto
      delete this.form.value.id;

      //imprime en consola las credenciales ingresadas
      //enviamos el formulario al servicio para crear usuarios nuevos
      this.firebaseService.addDocument(path, this.form.value).then( async res => {
        
        this.utilsSvc.dismisModal({success: true}); //cerramos el modal cuando se crea exitosamente

        this.utilsSvc.presentToast({
          message: 'Alumno Registrado Exitosamente',
          duration: 1500,
          color:'success',
          position:'middle',
          icon: 'checkmark-circle-outline'
        });

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
