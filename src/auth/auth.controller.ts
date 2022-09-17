import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dtos/signIn.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signIn')
  async signIn(@Body() payload: SignInDto) {
    return await this.authService.signIn(payload);
  }
}
