import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'employeeCode',
    });
  }
  async validate(employeeCode: string, password: string) {
    // TODO: NEED VALIDATE EMPLOYEE CODE
    return this.authenticationService.getAuthenticatedUser({
      employeeCode,
      password,
    });
  }
}
