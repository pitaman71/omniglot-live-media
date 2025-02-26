// media.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mediaConfig } from './media.config';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Definitions } from '@pitaman71/omniglot-live-data';

interface MediaModuleOptions {
  directory: Definitions.Directory;
}

@Module({})
export class MediaModule {
  static register(options: MediaModuleOptions): DynamicModule {
    return {
      imports: [ ConfigModule.forFeature(mediaConfig) ],
      module: MediaModule,
      controllers: [MediaController],
      providers: [
        MediaService
      ],
      exports: [MediaService]  // Export MediaService so other modules can use it
    };
  }
}