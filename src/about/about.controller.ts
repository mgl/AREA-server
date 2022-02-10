import { Controller, Get } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { AboutService } from './about.service';

@Controller('about.json')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  about(@Request() req): object {
    return this.aboutService.getAbout(req);
  }
}
