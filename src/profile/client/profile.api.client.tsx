import { ApiService } from '../../app/services/api.service.client';

export abstract class ProfileApi extends ApiService {
  static async editProfile(data: any) {
    return (await this.url('/user').put(data))?.data;
  }

  static addProfileLogo(file: File) {
    if (!file) return Promise.resolve({});

    const formData = new FormData();
    formData.append('file', file);
    return this.url('/user/logo')
      .post(formData)
      .catch((e) => {
        console.warn(e);
      });
  }

  static async removeProfileLogo() {
    return (await this.url('/user/logo').delete())?.data;
  }

  static async getUser() {
    return (await this.url('/user').get())?.data;
  }
}
