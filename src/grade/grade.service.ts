import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateGradeDto } from './dtos/createGrade.dto';


@Injectable()
export class GradeService {
    constructor (private readonly prismaService: PrismaService){}
}
