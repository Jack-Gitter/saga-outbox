import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 1000,
      username: 'postgres',
      password: 'postgres',
      database: 'orders',
      entities: [],
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
