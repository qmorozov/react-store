import { AppInfo } from './app-info';

export type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;

export type ComponentBuilder = (...args: any[]) => JSX.Element | null;

export type PageBuilder = (appInfo: AppInfo, ...args: any[]) => JSX.Element | null;
