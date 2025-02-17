// media.config.ts
import _ from 'lodash';
import {z} from 'zod';
import { registerAs, ConfigService, ConfigType } from '@nestjs/config';

export const MEDIA_CONFIG_KEY = 'media';

export const mediaConfigSchema = z.object({
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string()
});

// Extract the TypeScript type from the schema
export type MediaConfig = z.infer<typeof mediaConfigSchema>;
  
export const mediaConfig = registerAs(MEDIA_CONFIG_KEY, (): MediaConfig => {
  console.log('Media config starting to load...');
  const merged = _.merge(
    process.env.APP_CONFIG ? JSON.parse(process.env.APP_CONFIG) : {}, 
    process.env
  );
  
  // Zod's parse will throw if validation fails
  return mediaConfigSchema.parse(merged);
});

export type MediaConfigType = ConfigType<typeof mediaConfig>;
