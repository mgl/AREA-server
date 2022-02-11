import { Injectable, NestMiddleware } from '@nestjs/common';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { Request, Response } from 'express';
const admin = require('firebase-admin');

const firebaseConfig = {
  apiKey: 'AIzaSyA_6vGnEbnslDskt6Y3DyQFFi6LFxI89Ic',
  authDomain: 'area-37a17.firebaseapp.com',
  projectId: 'area-37a17',
  storageBucket: 'area-37a17.appspot.com',
  messagingSenderId: '613243542195',
  appId: '1:613243542195:web:a78229f54e8184520c2ec6',
};

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  constructor() {
    initializeApp({
      credential: applicationDefault(),
    });
  }

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
          req['uid'] = decodedToken.uid;
          req['email'] = decodedToken.email;
          next();
        })
        .catch((error) => {
          console.log(error);
          this.accessDenied(req.url, res);
        });
    } else {
      this.accessDenied(req.url, res);
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}
function getAuth() {
  throw new Error('Function not implemented.');
}
