import { Injectable } from '@nestjs/common';
import { createSemesterDto } from 'src/semester/dtos/createSemester.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SemesterService {
    constructor(private readonly prismaService: PrismaService){}
}
