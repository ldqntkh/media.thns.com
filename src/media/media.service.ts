import { Injectable } from '@nestjs/common';
const fs = require('fs');
import { MediaBodyDto } from './dto/media.body.dto';
// const MediaConverter = require("html5-media-converter");
import {MediaConverter} from './lib/Html5MediaComverter';

@Injectable()
export class MediaService {
    getHello(): string {
        return 'Hello World!';
    }

    async handleUploadVideo(video: Express.Multer.File, body: MediaBodyDto): Promise<object> {
        let public_path = './public/' + body.post_id;
        
        if (!fs.existsSync(public_path)) {
            fs.mkdirSync(public_path);
        }
        var oldpath = video.path;

        var newpath = `/media/${body.post_id}/${video.filename.replace(/\..*?$/, '.mp4')}`;
        // fs.renameSync( oldpath, newpath );
        // let file_url = `/media/${body.post_id}/${video.filename}`;
        
        var mc = new MediaConverter({ videoFormats: ['mp4']});
        
        let rs = await mc.convert(oldpath , "80%x80%", "public/" + body.post_id );
        
        fs.unlinkSync(oldpath);
        return {
            file_url: newpath
        }
    }

    async handleUploadImage( image: Express.Multer.File , body: MediaBodyDto) {
        let public_path = './public/' + body.post_id;
        
        if (!fs.existsSync(public_path)) {
            fs.mkdirSync(public_path);
        }

        let oldPath = image.path;
        var newpath = `${public_path}/${image.originalname}`;
        fs.renameSync( oldPath, newpath );
        return `/media/${body.post_id}/${image.originalname}`;
    }
}
