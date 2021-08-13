import { Module } from '@nestjs/common';
import { MediaEventListener } from './media.event.controller';

@Module({
  providers: [MediaEventListener],
})
export class MediaEventModule {}