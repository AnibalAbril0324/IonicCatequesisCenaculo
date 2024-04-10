import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../modules/user.model';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  
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

}

