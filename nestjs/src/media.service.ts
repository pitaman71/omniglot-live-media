// media.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { Tasks } from 'typescript-code-instruments';

import { MEDIA_CONFIG_KEY, MediaConfig } from './media.config';

let logEnable: boolean = false;

@Injectable()
export class MediaService implements OnModuleInit {
    s3Client: S3Client;
    constructor(
        private configService: ConfigService
    ) {}

    async onModuleInit() {
        const config = this.configService.get<MediaConfig>(MEDIA_CONFIG_KEY);

        // Configure AWS SDK
        const region = config.AWS_REGION;
        const accessKeyId = config.AWS_ACCESS_KEY_ID;
        const secretAccessKey = config.AWS_SECRET_ACCESS_KEY;
        // Configure AWS SDK
        const awsConfig = {
            region,
            credentials: !accessKeyId || !secretAccessKey ? undefined : {
            accessKeyId, 
            secretAccessKey
            }
        };
        this.s3Client = new S3Client(awsConfig);
    }
    download(path: string, mime: string) {
        const command = new GetObjectCommand({
            Bucket: 'talent-marketplace-media', 
            Key: path,
            ResponseContentType: mime
        });
        return getSignedUrl(this.s3Client, command, {expiresIn: 3600});
    }  
}