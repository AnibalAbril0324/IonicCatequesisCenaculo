import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl=inject(LoadingController);
  toastCtrl = inject(ToastController); //sirve para capturar el error al ingresar las credenciales
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alertCtrl = inject(AlertController);
  
  constructor() { }

async takePicture(promptLabelHeader: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelHeader,
    promptLabelPhoto: 'Selecciona una imagen',
    promptLabelPicture : 'Toma una foto'

  });
};
  //=== alerta al eliminar===========
async presentAlert(opts?:AlertOptions) {
  const alert = await this.alertCtrl.create(opts);

  await alert.present();
}

  //======loading===========
  loading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

  //=============toast==============
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  routerLink(url:string){
    return this.router.navigateByUrl(url);
  }

  //guardar un elemento en local storage
  saveInLocalStorage(key:string, value:any){
    //JSON.stringify(value) convertimos a string
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //obtiene unn elemento del local storage
  getFromLocalStorage(key:string){
    //convetimos el string en objeto
    return JSON.parse(localStorage.getItem(key));
  }

  //============modal===================
  //==========abrir modal==============
  async abrirModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present(); // Muestra el modal en la pantalla
    const {data} =await modal.onWillDismiss(); //obtener la data cuando se cierra
    if (data) return data;
  }

  //==========cerrar modal==============
  dismisModal(data?:any){
    return this.modalCtrl.dismiss(data);//sirve para cerrar un modal 
                                        //abierto y opcionalmente pasar 
                                        //datos de vuelta a la página que lo abrió. 
                                        //Es una función útil cuando necesitas cerrar el modal 
                                        //desde dentro del propio modal, como en un botón de "Cancelar" o "Aceptar".
  }


}
  