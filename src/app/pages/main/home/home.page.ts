import { Component, OnInit, inject } from '@angular/core';
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
  
  constructor() { }

  ngOnInit() {
  }

  //========cerrar sesion==========
  singOut(){
    this.firebaseSvc.singOut();
  }

  //==========agregar un producto==========
  // al colocar "?" este parametro nos es requerido
  addUpdateStudent(){
    //[para poder recargar la pagina automaticamnte]
      this.utilsSvc.abrirModal({
      component: AddUpdateStudentComponent,
      cssClass : 'add-update-modal',
    })

  }

}
