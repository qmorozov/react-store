import { readFileSync } from 'fs';
import { join } from 'path';

export abstract class EnvConfig {
  abstract root: string;

  protected bool(env: string, defaultValue: boolean): boolean {
    return process.env[env] !== undefined ? process.env[env] === 'true' || process.env[env] === '1' : defaultValue;
  }

  protected number(env: string, defaultValue: number): number {
    return process.env[env] !== undefined ? parseInt(process.env[env], 10) : defaultValue;
  }

  protected string(env: string, defaultValue?: string): string {
    return process.env[env] !== undefined ? process.env[env] : defaultValue;
  }

  protected path(env: string, defaultValue?: string): string {
    console.log(this.root);
    return join(this.root, this.string(env));
  }

  protected fileContent(env: string, defaultValue: string): string {
    const path = this.path(env, undefined);
    return (path?.length ? readFileSync(path, 'utf8') : defaultValue) || defaultValue;
  }

  protected enum<E>(env: string, options: object, defaultValue: E): E {
    const value = process.env[env];

    if (value === undefined || !Object.values(options).includes(value)) {
      return defaultValue;
    }

    return value as E;
  }
}
