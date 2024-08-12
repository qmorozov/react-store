import { ApiService } from '../../app/services/api.service.client';
import { CreateDTO } from '../dto/admin-create-page.dto';
import { EditDTO } from '../dto/admin-edit-page.dto';
import { StatusDTO } from '../dto/admin-status-change.dto';

export abstract class AdminApi extends ApiService {
  static async getPages() {
    return (await this.admin('/page').get())?.data;
  }

  static async getPageById(id: string) {
    return (await this.admin(`/page/${id}`).get())?.data;
  }

  static async createPage(data) {
    return (await this.admin(`/page`).post(data))?.data;
  }

  static async updatePage(id: string, data: any) {
    return (await this.admin(`/page/${id}`).put(data))?.data;
  }

  static async updatePageStatus(id: string, data: StatusDTO) {
    return await this.admin(`/page/${id}/status`).put(data);
  }

  static async deletePage(id: string) {
    return await this.admin(`/page/${id}`).delete();
  }
}
