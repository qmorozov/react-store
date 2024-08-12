import { Response } from 'express';
import { Page } from '../../pages';
import { ComponentBuilder } from '../models/component';
import { Layout } from '../../layouts/layout.enum';
import { IAppDocumentParameters } from '../models/document';

export interface IRenderService {
  render(
    response: Response,
    page: Page,
    view: ComponentBuilder,
    layout: Layout,
    documentParameters?: Partial<IAppDocumentParameters>,
  ): Promise<any>;
}
