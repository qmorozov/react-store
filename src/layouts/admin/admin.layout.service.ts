import { Injectable } from '@nestjs/common';
import { aLayoutService, iLayoutService } from '../iLayout';
import AdminLayout from './admin.layout';
import { AssetType } from '../../app/models/document';

@Injectable()
export class AdminLayoutService extends aLayoutService implements iLayoutService {
  static assets = {
    [AssetType.Style]: ['layouts/admin/admin.scss'],
    [AssetType.Script]: [],
  };

  view = AdminLayout;
}
