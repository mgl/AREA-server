import admin from 'firebase-admin';

export class FirebaseAdmin {
  private static instance: FirebaseAdmin;

  private constructor() {
    admin.initializeApp();
  }

  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }

    return FirebaseAdmin.instance;
  }

  public getAdmin(): any {
    return admin;
  }

  public static;
}
