import { Injectable, NestMiddleware } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import { Request, Response } from 'express';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

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
  private firebase: any;

  constructor() {
    this.firebase = initializeApp(firebaseConfig);
  }

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      const auth = getAuth();
      signInWithCustomToken(auth, token)
        .then((userCredential) => {
          const user = userCredential.user;
          req['user'] = user;
        })
        .catch((error) => {
          console.error(error);
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
