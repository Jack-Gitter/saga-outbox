import { Injectable } from '@nestjs/common';
import { Channel } from 'amqplib-as-promised/lib';

@Injectable()
export class RMQService {
  constructor(private channel: Channel) {}
}
