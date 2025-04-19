import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice({
    options: {
      urls: [`amqp://localhost:5672`],
      queue: 'my_queue',
      queueOptions: { durable: false },
    },
    transport: Transport.
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
