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
// import { match } from 'assert';

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

  async resetPassword(employee: Employee, payload: ResetPasswordDto) {
    await this.verifyPassword(payload.oldPassword, employee.password);
    return this.prismaService.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        password: payload.newPassword,
      },
    });
  }

  createDefaulPassword() {
    let result = '';
    for (let i = 0; i < 6; i++) {
      const temp = Math.floor(Math.random() * 101);
      result += temp;
    }
    return result;
  }

  async forgotPassword(email: string) {
    const employee = await this.employeeService.getEmployeeByUnique(email);
    const newPassword = this.createDefaulPassword();
    const content = `Training Program Management
    \nYour new password: ${newPassword}
    \n Please return to the page to sign in`;

    await this.employeeService.updatePassword(employee.id, newPassword);
    await this.emailConfirmService.sendMail(email, content, 'RESET PASSWORD');

    return 'Nhà trường đã cấp lại mật khẩu cho bạn trong Email.Hãy kiểm tra Email và đăng nhập lại!';
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
