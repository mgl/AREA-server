import { Injectable, NestMiddleware } from '@nestjs/common';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { Request, Response } from 'express';
import admin from 'firebase-admin';

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  constructor() {
    admin.initializeApp({
      credential: applicationDefault(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
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
