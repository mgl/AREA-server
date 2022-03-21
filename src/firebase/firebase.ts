import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

export class Firebase {
  private static instance: Firebase;
  private db: Firestore;
  private auth: Auth;

  constructor() {
    if (Firebase.instance) {
      return Firebase.instance;
    }
    Firebase.instance = this;

    if (process.env.NODE_ENV === 'docker') {
      initializeApp({ credential: applicationDefault() });
    } else {
      initializeApp();
    }
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
