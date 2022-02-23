import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';

@Controller('/services/github')
export class GithubController {

    @Post('subscribe')
    subscribe () {
        return { message: 'Subscribed to Github service' };
    }

    @Delete('/unsubscribe')
    unsubscribe() {
        return { message: 'Unsubscribed to Github service' };
    }
    
    @Post('/')
    async createGithubAction(@Request() req) {
        var token = "ahah";
        const data = {
            token: token
        };
        const res = await req.firestore().collection("actions").doc(uuidv4()).set(data);
        return res;
    }
    
    @Post('/')
    async createGithubReaction(@Request() req,  @Param('id') id: string) {
        var token = "ahah";    
        const data = {
            token: token
        };
        const res = await req.firestore().collection("actions").doc(id).collection("reactions").doc(uuidv4()).set(data);
        return res;
    }
}