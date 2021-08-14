import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5502', '*'],
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
});
  // app.enableCors();
  app.use(express.static(join(process.cwd(), '../public/')));
  await app.listen(8088, ()=> console.log('server started'));
}
bootstrap();
