import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import DateAuditEntity from '../utils/dateAudit.entity';

@Entity()
export default class Employee extends DateAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  email: string;
  @Column()
  password: string;
}
