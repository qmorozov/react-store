import { S3 } from '@aws-sdk/client-s3';
import { StorageConfig } from './StorageConfig';

export type Buckets = Readonly<{ main: string } & Record<string, string>>;

export abstract class ExternalStorage {
  public readonly client: S3;

  abstract buckets: Buckets;

  protected constructor(
    protected readonly config: StorageConfig,
    ...args: ConstructorParameters<typeof S3>
  ) {
    this.client = new S3(...args);
  }

  getUrl(Key: string, Bucket: string) {
    return `https://${Bucket}.s3.${this.config.region}.${this.config.endpoint}/${Key}`;
  }

  getCdnUrl(Key: string, Bucket: string) {
    return `https://${Bucket}.s3.${this.config.region}.cdn.${this.config.endpoint}/${Key}`;
  }
}

export class DigitalOceanSpacesStorage<B extends Buckets> extends ExternalStorage {
  constructor(
    config: StorageConfig,
    public readonly buckets: B,
  ) {
    super(config, {
      region: 'us-east-1',
      endpoint: `https://${config.region}.${config.endpoint}`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  getUrl(Key, Bucket): string {
    return `https://${Bucket}.${this.config.region}.${this.config.endpoint}/${Key}`;
  }

  getCdnUrl(Key, Bucket): string {
    return `https://${Bucket}.${this.config.region}.cdn.${this.config.endpoint}/${Key}`;
  }
}
