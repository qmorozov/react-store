import { ApiService } from '../../app/services/api.service.client';
import { ShopDTO } from '../dto/addShop.dto';
import { AccountServiceClient } from '../../user/client/account.service.client';

export abstract class ShopApi extends ApiService {
  static async addShop(data: ShopDTO) {
    return (await this.url('/shop').post(data))?.data;
  }

  static async editShop(uuid: string, data: any) {
    return (await this.url(`/shop/${uuid}`).put(data))?.data;
  }

  static async getShop() {
    return (await this.url('/shop').get())?.data;
  }

  static async getShopList() {
    return (await this.url('/shop/list').get())?.data;
  }

  static addShopLogo(uuid: string, file: File) {
    if (!file) return Promise.resolve({});

    const formData = new FormData();
    formData.append('file', file);
    return this.url(`/shop/${uuid}/logo`)
      .post(formData)
      .then((r) => {
        console.log(r);
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  static async deleteLogo(uuid: string | number) {
    return (await this.url(`/shop/${uuid}/logo`).delete())?.data;
  }

  // static updateShop(uuid, data, file) {
  //   return Promise.all([this.editShop(uuid, data), this.addShopLogo(uuid, file)]).then((response) => {
  //     return Object.assign({}, ...response);
  //   });
  // }

  static async getProductList() {
    return (
      await this.url('/product/list', {
        shop: AccountServiceClient.getShopUuid(),
      }).get()
    )?.data;
  }
}
