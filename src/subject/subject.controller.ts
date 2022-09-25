import { Controller, Get } from '@nestjs/common';

@Controller('subject')
export class SubjectController {
  @Get()
  async getAllSubject() {
    return 'hello world';
  }
}
