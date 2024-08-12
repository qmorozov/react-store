import { ApiService } from '../../../app/services/api.service.client';

export abstract class ManageProductApi extends ApiService {
  static async getCategories() {
    return (await this.url('/catalog/category').get())?.data;
  }
  static async addProduct(type: string, data: any, shopId?: string | number | undefined) {
    const params = new URLSearchParams();
    if (shopId) {
      params.append('shop', shopId.toString());
    }
    const url = `/product/add/${type}?${params.toString()}`;
    return (await this.url(url).post(data))?.data;
  }

  static async addSubProduct(productId: string | number, subProduct: any) {
    return (await this.url(`/product/${productId}/subproduct`).post(subProduct))?.data;
  }

  static async updateProduct(productId: string | number, data: any) {
    return (await this.url(`/product/${productId}`).put(data))?.data;
  }

  static async getSubProducts(productId: string | number) {
    return (await this.url(`/product/${productId}/subproducts`).get())?.data;
  }

  static async addProductImages(id: number, file: File) {
    if (!file) return Promise.resolve({});

    const formData = new FormData();
    formData.append('file', file);
    return this.url(`/product/${id}/image`)
      .post(formData)
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  static async deleteProductImage(productId: string | number, imageId: string) {
    return (await this.url(`/product/${productId}/image/${imageId}`).delete())?.data;
  }

  static async setProductCoverImage(productId: string | number, imageId: string) {
    const data = { imageId };
    return (await this.url(`/product/${productId}/cover`).post(data))?.data;
  }

  static async getProduct(productId: string | number) {
    return (await this.url(`/product/${productId}`).get())?.data;
  }

  static async deleteProduct(productId: number) {
    return (await this.url(`/product/${productId}`).delete())?.data;
  }

  static async suggestProducts(type: string, query: string) {
    return (await this.url(`/product/suggest/${type}?query=${query}`).get())?.data;
  }

  static async suggestProductAttributes(type: string, model: string, brandId: number) {
    return (await this.url(`/product/suggest/${type}/attributes?model=${model}&brandId=${brandId}`).get())?.data;
  }

  static async updateProductQuantity(productId: string | number, quantity: number) {
    const data = { quantity };
    return (await this.url(`/product/${productId}/quantity`).post(data))?.data;
  }

  static async updateProductStatus(productId: string | number, status: number) {
    const data = { status };
    return (await this.url(`/product/${productId}/status`).post(data))?.data;
  }
}
