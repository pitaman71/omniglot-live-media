// media.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { MediaService } from './media.service';
import { Tasks } from 'typescript-code-instruments';
import { JSONMarshal, Reference } from 'typescript-introspection';
import { Mutations } from '@pitaman71/omniglot-live-data';

let logEnable: boolean = true;

@Controller('media')
export class MediaController {
    private readonly logEnable = false;

    constructor(private readonly mediaService: MediaService) {}

    @Post('download')
    async download(@Req() req: Request, @Res() res: Response, @Query() query: { path: string, mime: string }) {
        return new Tasks.Instrument('MediaService.download').logs(console.log, ()=> logEnable).promises(query, () => {
            if(!query.path) {
                throw new HttpException('path is a required query parameter', HttpStatus.BAD_REQUEST);
            }
            if(!query.mime) {
                throw new HttpException('mime is a required query parameter', HttpStatus.BAD_REQUEST);
            }
            return this.mediaService.download(query.path, query.mime);
        }).then(signedUrl => {
            return res.status(200).json({ signedUrl });
        })
    }
}
