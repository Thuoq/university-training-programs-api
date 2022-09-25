import { Request } from 'express';
import { Employee } from '@prisma/client';
interface RequestWithEmployee extends Request {
  employee: Employee;
}

export default RequestWithEmployee;
