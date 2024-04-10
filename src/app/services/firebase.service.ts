import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../modules/user.model';

//==============Firestore=====================
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection,collectionData,query, updateDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  
  constructor() { }

  // ================autenticacion=================================

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

      // ===========Base de datos==========================
      
   //============== Setear un documento =================
    //guardamos los datos del usuario
    setDocument(path:string,data:any){  
      return setDoc (doc(getFirestore(), path), data);
    }
}

