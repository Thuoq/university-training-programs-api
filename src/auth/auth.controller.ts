import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Get,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import RequestWithEmployee from './interfaces/requestWithUser.interface';
import { Response } from 'express';
import JwtAuthenticationGuard from './guard/jwt-authentication.guard';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithEmployee) {
    const employee = request.employee;
    return employee;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post('signIn')
  signIn(@Req() req: RequestWithEmployee, @Res() response: Response) {
    const employee = req.employee;
    const cookie = this.authService.getCookieWithJwtToken(employee.id);
    response.setHeader('Set-Cookie', cookie);
    return response.send(employee);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithEmployee, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(HttpStatus.OK);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('reset-password')
  async resetPassword(
    @Req() request: RequestWithEmployee,
    @Body() body: ResetPasswordDto,
  ) {
    const employee = request.employee;
    return await this.authService.resetPassword(employee, body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return await this.authService.forgotPassword(payload.email);
  }

  @Post('confirmation-token')
  confirmationToken(@Query('token') token: string) {
    return this.authService.confirmationToken(token);
  }

  @Patch('update-password')
  async updatePasswordEmployee(@Body() payload: UpdatePasswordDto) {
    return await this.authService.updatePasswordAuth(payload);
  }
}
