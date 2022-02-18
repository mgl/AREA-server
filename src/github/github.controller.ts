import { Controller, Post } from '@nestjs/common';

@Controller()
export class GithubController {
    @Post('/webhook/github')
    async receiveWebhook() {
        console.log('Github webhook');
      }
}
