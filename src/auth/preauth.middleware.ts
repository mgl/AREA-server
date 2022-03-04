import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import Firebase from 'src/firebase/firebase';

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/ban-types
  use(req: Request, res: Response, next: Function) {
    let token = req.headers.authorization;
    if (token != null && token != '') {
      token = token.replace('Bearer ', '');
      Firebase.getInstance()
        .getAuth()
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
