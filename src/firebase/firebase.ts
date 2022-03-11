import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';

export default class Firebase {
  private static instance: Firebase;
  private db: FirebaseFirestore.Firestore;
  private auth: Auth;

  private constructor() {
    initializeApp();
    this.db = getFirestore();
    this.auth = getAuth();
  }

  static getInstance(): Firebase {
    if (!Firebase.instance) {
      Firebase.instance = new Firebase();
    }

    return Firebase.instance;
  }

  getDb(): FirebaseFirestore.Firestore {
    return this.db;
  }

  getAuth(): any {
    return this.auth;
  }
}
