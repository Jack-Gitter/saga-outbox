import { Entity, Column } from 'typeorm';

@Entity('InboxMessages')
export class InboxMessage {
  constructor() {}

  @Column({ type: 'int', nullable: false })
  id: number;
}
