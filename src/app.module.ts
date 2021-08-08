import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    })
  ],
  controllers: [AppController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
