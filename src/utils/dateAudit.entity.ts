import { CreateDateColumn, UpdateDateColumn, BaseEntity, DeleteDateColumn } from 'typeorm';

abstract class DateAuditEntity extends BaseEntity {
  @CreateDateColumn()
  created: Date;
  @UpdateDateColumn()
  updated: Date;
  @DeleteDateColumn()
  deleteAt: Date;
}

export default DateAuditEntity;
