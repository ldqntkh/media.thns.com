import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { EventEmitterModule } from '@nestjs/event-emitter';

import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';

import { MediaEventModule } from './event-emitter/media/media.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

let envpath = '.env';
if( process.env.NODE_ENV == 'dev' ) {
  envpath = 'dev.env';
}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envpath
    }),
    EventEmitterModule.forRoot(),
    MediaEventModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    })
  ],
  controllers: [AppController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
