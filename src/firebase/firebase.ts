import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

export default class Firebase {
  private static instance: Firebase;
  private db: Firestore;
  private auth: Auth;

  constructor() {
    if (Firebase.instance) {
      return Firebase.instance;
    }
    Firebase.instance = this;

    admin.initializeApp();
    this.db = getFirestore();
    this.auth = getAuth();
  }

  getDb(): Firestore {
    return this.db;
  }

  getAuth(): any {
    return this.auth;
  }
}
