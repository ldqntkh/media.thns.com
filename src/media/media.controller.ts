import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Param, Res, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

// DTO
import { MediaBodyDto } from './dto/media.body.dto';
import { MediaFileDto } from './dto/media.file.dto';

import { diskStorage } from 'multer';
import { editFileName, videoFileFilter, imageFileFilter } from './utils/file-upload.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

// event
import { MediaCreatedEvent } from '../event-emitter/media/media.event.dto'; 

const accept_url = ['tinhocngoisao.com', 'https://tinhocngoisao.com', 'localhost:8088', 'localhost:5502'];

@Controller('media')
export class MediaController {

    constructor( private readonly mediaService: MediaService, private eventEmitter: EventEmitter2 ) {

    }

    @Get('upload-video')
    getForm(@Headers() headers) : string {
        if( accept_url.includes( headers.host ) == false ) {
            throw new Error('Cannot accept this host');
        }
        return `<form method="POST" enctype="multipart/form-data" name="upload_form">
                <input type="file" name="video"/>
                <input type="hidden" name="post_id" value="20" />
                <button>Submit</button>
            </form>`
    }

    @Get('upload-image')
    getFormImage(@Headers() headers) : string {
        if( accept_url.includes( headers.host ) == false ) {
            throw new Error('Cannot accept this host');
        }
        return `<form method="POST" enctype="multipart/form-data" name="upload_form">
                <input type="file" name="image"/>
                <input type="hidden" name="post_id" value="20" />
                <button>Submit</button>
            </form>`
    }

    @Get(':post_id/:filename')
    async serveAvatar(@Param() params: MediaFileDto, @Res() res): Promise<any> {
        res.sendFile(`${params.post_id}/${params.filename}`, { root: 'public'});
    }

    @Post('upload-video')
    @UseInterceptors(FileInterceptor('video', {
        storage: diskStorage({
            destination: './public',
            filename: editFileName,
        }),
        fileFilter: videoFileFilter
    }))
    uploadVideo(@Body() body: MediaBodyDto, @UploadedFile() video: Express.Multer.File, @Headers() headers) : object {
        
        if( accept_url.includes( headers.host ) == false ) {
            throw new Error('Cannot accept this host');
        }

        let mediaEvent = new MediaCreatedEvent();
        mediaEvent.oldPath = video.path;
        mediaEvent.newPath = "public/" + body.post_id;
        
        let file_url = `${process.env.DOMAIN_NAME}/media/${body.post_id}/${video.filename.replace(/\..*?$/, '.mp4')}`;
        
        this.eventEmitter.emit('media.video.uploaded', mediaEvent);
        return {
            file_url: file_url
        };
    }


    @Post('upload-image')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './public',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    uploadedFile(@Body() body: MediaBodyDto, @UploadedFile() image, @Headers() headers) : object {
        if( accept_url.includes( headers.host ) == false ) {
            throw new Error('Cannot accept this host');
        }
        let url = this.mediaService.handleUploadImage( image, body );
        return {
            file_url: url
        };
    }

    @Post('delete-media')
    deleteMedia( @Body() body: MediaBodyDto, @Headers() headers ) {
        let post_id = body.post_id;
        let file_url = body.file_url;
        
        let file_names = file_url.split( `/media/${post_id}/` );
        if( !file_names || file_names.length < 2 ) {
            return {
                success: false
            }
        }
        let file_name = file_names[1];
        
        return {
            success: true
        }
    }
}
