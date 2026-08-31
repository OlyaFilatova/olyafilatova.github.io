import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppDataSource } from '@olyafilatova.github.io/db-notes';

async function bootstrap() {
  await AppDataSource.initialize();

  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT ?? 4001);

  console.log(`Server running on http://localhost:${process.env.PORT ?? 4001}`);
}

bootstrap();
