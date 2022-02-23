import { Controller, Request, Get,  Post, Delete , Param} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';

@Controller('/services/one-drive')
export class OneDriveController {
    @Post('/subscribe')
    subscribe () {
        return { message: 'Subscribed to Onedrive service' };
    }

    @Delete('/unsubscribe')
    unsubscribe() {
        return { message: 'Unsubscribed to Onedrive service' };
    }

    @Post('/')
    async createOneDriveAction(@Request() req) {
        var token = "ahah";
        const data = {
            token: token
        };
        const res = await req.firestore().collection("actions").doc(uuidv4()).set(data);
        return res;
    }
    
    @Post('/')
    async createOneDriveReaction(@Request() req,  @Param('id') id: string) {
        var token = "ahah";    
        const data = {
            token: token
        };
        const res = await req.firestore().collection("actions").doc(id).collection("reactions").doc(uuidv4()).set(data);
        return res;
    }
}
