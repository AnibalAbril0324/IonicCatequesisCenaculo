import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl=inject(LoadingController);
  toastCtrl = inject(ToastController); //sirve para capturar el error al ingresar las credenciales
  constructor() { }

  //======loading===========
  loading(){
    return this.loadingCtrl.create({spinner:'crescent'})
  }

  //=============toast==============
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
}
