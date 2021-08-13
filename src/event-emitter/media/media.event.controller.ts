import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
const fs = require('fs');
import { MediaCreatedEvent } from './media.event.dto';

import { MediaConverter } from '../../media/lib/Html5MediaComverter';

@Injectable()
export class MediaEventListener {
  @OnEvent('media.video.uploaded')
  async handleOrderCreatedEvent(event: MediaCreatedEvent) {
    var mc = new MediaConverter({ videoFormats: ['mp4']});
    if (!fs.existsSync(event.newPath)) {
      fs.mkdirSync(event.newPath);
    }
    let rs = await mc.convert(event.oldPath , "80%x80%", event.newPath );

    fs.unlinkSync(event.oldPath);
    console.log(rs);
  }
}