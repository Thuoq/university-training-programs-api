import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto } from './dtos/signIn.dto';
import { EmployeeService } from '../employee/employee.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly employeeService: EmployeeService,
  ) {}
  async signIn(payload: SignInDto) {
    const employee = await this.employeeService.getEmployeeByUnique(payload.email);
    const isCorrectPassword = await this.isCorrectPassword(
      payload.password,
      employee.password,
    );
    if (!isCorrectPassword) {
      throw new HttpException('Mật khẩu hoặc Email bị lỗi', HttpStatus.BAD_REQUEST);
    }
    return employee;
  }
  isCorrectPassword(passwordPlanText: string, passwordHashed: string) {
    return bcrypt.compare(passwordPlanText, passwordHashed);
  }
}
