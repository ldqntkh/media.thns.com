import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

// DTO
import { MediaBodyDto } from './dto/media.body.dto';
import { MediaFileDto } from './dto/media.file.dto';

import { diskStorage } from 'multer';
import { editFileName, videoFileFilter } from './utils/file-upload.utils';

@Controller('media')
export class MediaController {

    constructor( private readonly mediaService: MediaService ) {

    }

    @Get('upload-video')
    getForm() : string {
        return `<form method="POST" enctype="multipart/form-data" name="upload_form">
                <input type="file" name="video"/>
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
    uploadVideo(@Body() body: MediaBodyDto, @UploadedFile() video: Express.Multer.File) : object {
        return this.mediaService.handleUploadVideo(video, body);
    }
}
