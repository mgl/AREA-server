import { Controller, Post, Delete, Param, Body } from '@nestjs/common';
import { getAuth } from 'firebase/auth';
import { FirebaseAdmin } from 'src/firebase-admin/firebase-admin';

@Controller('/services/codebase')
export class CodebaseController {
  @Post('subscribe')
  subscribe(@Param('token') token: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    const ref = FirebaseAdmin.getInstance()
      .getAdmin()
      .database()
      .ref()
      .child(user.uid);
    ref.set({
      codebase_token: token,
    });
    return { message: 'Subscribed to Codebase service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    const auth = getAuth();
    const user = auth.currentUser;

    const ref = FirebaseAdmin.getInstance()
      .getAdmin()
      .database()
      .ref()
      .child(user.uid);
    ref.set({
      codebase_token: null,
    });
    return { message: 'Unsubscribed to Codebase service' };
  }

  @Post('/action')
  async createCodebaseAction(@Body() token: string) {
    const data = {
      token: '',
    };
    data.token = token;
    const res = await FirebaseAdmin.getInstance()
      .getAdmin()
      .firestore()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    return res;
  }

  @Post('/reaction')
  async createCodebaseReaction(
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    const data = {
      id: '',
      token: '',
    };
    data.id = id;
    data.token = token;
    const res = await FirebaseAdmin.getInstance()
      .getAdmin()
      .firestore()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set(data);
    return res;
  }
}
