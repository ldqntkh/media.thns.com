import { Injectable } from '@nestjs/common';
const fs = require('fs');
import { MediaBodyDto } from './dto/media.body.dto';


@Injectable()
export class MediaService {
    getHello(): string {
        return 'Hello World!';
    }

    handleUploadVideo(video: Express.Multer.File, body: MediaBodyDto): object {
        let public_path = './public/' + body.post_id;

        if (!fs.existsSync(public_path)) {
            fs.mkdirSync(public_path);
        }
        var oldpath = video.path;

        var newpath = public_path + '/' + video.filename;
        fs.renameSync( oldpath, newpath );
        let file_url = `/media/${body.post_id}/${video.filename}`;
        return {
            file_url
        }
    }
}
