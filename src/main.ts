import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(join(process.cwd(), '../public/')));
  await app.listen(8081);
}
bootstrap();
