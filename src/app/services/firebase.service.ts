import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';

//==============Firestore=====================
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection,collectionData,query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import {getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc =inject(UtilsService);
  storage = inject(AngularFirestore);
  
  constructor() { }

  // ================autenticacion=================================

  getAuth(){
    return getAuth();
  }

  // ===========Acceder==========================
  singIn(user :User){
    return signInWithEmailAndPassword(getAuth(),user.email, user.password);
  }

   // ===========crear usuario==========================
  singUp(user :User){
    return createUserWithEmailAndPassword(getAuth(),user.email, user.password);
  }

  // ===========Update==========================
  updateUser(displayName:string){
    return updateProfile(getAuth().currentUser,{displayName})
  }

  // ===========enviar datos para restablecer la contraseña==========================

  sendRecoveryEmail(email:string){
    return sendPasswordResetEmail(getAuth(),email);
  }

   // ===========Cerrar Sesion==============
  singOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }


    // ====================================================
      // ===========Base de datos==========================
      // ====================================================
      
   //============== Setear un documento =================
    //guardamos los datos del usuario
    setDocument(path:string,data:any){  
      return setDoc (doc(getFirestore(), path), data);
    }

    //============== obtener un documento =================
  async getDocument(path:string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //============== agregar un documento =================
  addDocument(path:string,data:any){
    return addDoc (collection(getFirestore(), path), data);
  }

  //============almacenamiento============
  async uploadImage(path:string, data_url:string){
    return uploadString(ref(getStorage(),path),data_url,'data_url').then(() => {
      return getDownloadURL(ref(getStorage(),path))
    })
  }
}

