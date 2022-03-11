import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';

export default class Firebase {
  private static instance: Firebase;
  private db: FirebaseFirestore.Firestore;
  private auth: Auth;

  constructor() {
    if (Firebase.instance) {
      return Firebase.instance;
    }
    Firebase.instance = this;

    initializeApp();
    this.db = getFirestore();
    this.auth = getAuth();
  }

  getDb(): FirebaseFirestore.Firestore {
    return this.db;
  }

  getAuth(): any {
    return this.auth;
  }
}
