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



}
