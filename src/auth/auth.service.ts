import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto } from './dtos/signIn.dto';
import { EmployeeService } from '../employee/employee.service';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Employee } from '@prisma/client';
import { EmailConfirmationService } from '../email/emailConfirmation.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly employeeService: EmployeeService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailConfirmService: EmailConfirmationService,
  ) {}

  async getAuthenticatedUser(payload: SignInDto) {
    const employee = await this.employeeService.getEmployeeByUnique(payload.employeeCode);
    await this.verifyPassword(payload.password, employee.password);
    return employee;
  }

  async verifyPassword(passwordPlanText: string, passwordHashed: string) {
    const isMatchingPassword = await bcrypt.compare(passwordPlanText, passwordHashed);
    if (!isMatchingPassword) {
      throw new HttpException('Mật khẩu hoặc Email bị lỗi', HttpStatus.BAD_REQUEST);
    }
  }

  getCookieWithJwtToken(employeeId: number) {
    const payload: TokenPayload = { employeeId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  resetPassword(employee: Employee, payload: ResetPasswordDto) {
    return this.prismaService.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        password: payload.newPassword,
      },
    });
  }

  async forgotPassword(email: string) {
    await this.employeeService.getEmployeeByUnique(email);
    const content = this.getContentForgotPassword();
    await this.emailConfirmService.sendVerificationLink(email, content, 'RESET PASSWORD');
    return 'Check Mail box';
  }

  getContentForgotPassword() {
    return `Please click hear make reset your password`;
  }

  async confirmationToken(token: string) {
    await this.emailConfirmService.decodeConfirmationToken(token);
    return 'Ok';
  }

  async updatePasswordAuth(payload: UpdatePasswordDto) {
    const email = await this.emailConfirmService.decodeConfirmationToken(payload.token);
    const employee = await this.employeeService.getEmployeeByUnique(email);
    await this.verifyPassword(payload.oldPassword, employee.password);
    return this.employeeService.updatePassword(employee.id, payload.newPassword);
  }
}
