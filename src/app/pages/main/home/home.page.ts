import { Component, OnInit, inject } from '@angular/core';
import { Student } from 'src/app/models/Student.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateStudentComponent } from 'src/app/shared/components/add-update-student/add-update-student.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  
   //arreglo de produtos
  students: Student []=[];

  constructor() { }

  ngOnInit() {
  }

  //========cerrar sesion==========
  //singOut(){
    //this.firebaseSvc.singOut();
  //}
  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

   //sireve para entrar en la funcion cada vez que el usuario entra en la pagina
  ionViewWillEnter() {
    this.getStudents();
  }
   //======obtener productos===============
  getStudents(){
    let path= `users/${this.user().uid}/students`
    //this.loading=true;

    //let query = [
     // orderBy('soldUnits','desc'),
      //where ('soldUnits','>',30)
    //]
      
    
    let sub=this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.students = res;
        //this.loading=false;
        sub.unsubscribe();
      }
    })
  }
  //==========agregar un producto==========
  // al colocar "?" este parametro nos es requerido
  async addUpdateStudent(student?:Student){
    //[para poder recargar la pagina automaticamnte]
    let success = await this.utilsSvc.abrirModal({
      component: AddUpdateStudentComponent,
      cssClass : 'add-update-modal',
      componentProps:{student}
    })
    if (success) this.getStudents();
  }

  //====confirmar la eliminacion del prodcuto==========
  async confirmDeleteProduct(student: Student) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar Alumno!',
      message: '¿Quieres eliminar este Alumno?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, Eliminar',
          handler: () => {
            this.deleteStudent(student);
          }
        }
      ]
    });
  }

    //=======eliminar=============
  async deleteStudent(student: Student){

    let path= `users/${this.user().uid}/students/${student.id}`
      
    const loading=await this.utilsSvc.loading();
    await loading.present();
      
    let imagePath= await this.firebaseSvc.getFilePath(student.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then( async res => {
      this.students = this.students.filter(p => p.id !== student.id); 
  
      this.utilsSvc.presentToast({
        message: 'Alumno Eliminado Exitosamente',
        duration: 1500,
        color:'success',
        position:'middle',
        icon: 'checkmark-circle-outline'
      });
  
      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'ERROR NO SE ACTUALIZARON LOS DATOS',
          duration: 2500,
          color:'primary',
          position:'middle',
          icon: 'alert-circle'
        });
  
      }).finally( () => {
        loading.dismiss();
      })
    }

}
