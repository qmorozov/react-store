import { ApiService } from '../../app/services/api.service.client';

export abstract class AdminApi extends ApiService {
  static uploadContentImageUrl = this.makeAdminUrl('/blog/content-image');

  static async getBanners() {
    return (await this.url('/admin/landing/slides').get())?.data;
  }

  static async postBanner(data: any) {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('name', data.name);
    formData.append('link', data.link);
    formData.append('active', data.active.toString());

    return (await this.url('/admin/landing/slides').post(formData))?.data;
  }

  static async getBanner(id: string) {
    return (await this.url(`/admin/landing/slides/${id}`).get())?.data;
  }

  static async editBanner(id: string, data: any) {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('name', data.name);
    formData.append('link', data.link);
    formData.append('active', data.active.toString());

    return (await this.url(`/admin/landing/slides/${id}`).put(formData))?.data;
  }

  static async deleteBanner(id: string) {
    return (await this.url(`/admin/landing/slides/${id}`).delete())?.data;
  }

  static async getBrands() {
    return (await this.url('/admin/brands').get())?.data;
  }

  static async postBrand(data: FormData) {
    return (await this.url('/admin/brands').post(data))?.data;
  }

  static async editBrand(id: string, data: FormData) {
    return (await this.url(`/admin/brands/${id}`).put(data))?.data;
  }

  static async deleteBrand(id: string) {
    return (await this.url(`/admin/brands/${id}`).delete())?.data;
  }

  static async getBrand(id: string) {
    return (await this.url(`/admin/brands/${id}`).get())?.data;
  }

  static async getCategoriesList() {
    return (await this.url('/admin/category').get())?.data;
  }

  static async getCategory(id: string) {
    return (await this.url(`/admin/category/${id}`).get())?.data;
  }

  static async editCategory(id: string, data: FormData) {
    return (await this.url(`/admin/category/${id}`).put(data))?.data;
  }

  static async postImageContent(data: FormData) {
    return (await this.url('/admin/blog/content-image').post(data))?.data;
  }

  // Blog

  static async getBlogList() {
    return (await this.url('/admin/blog').get())?.data;
  }

  static async updateBlogPostStatus(id: string, active: boolean) {
    return (await this.url(`/admin/blog/${id}`).patch({ active }))?.data;
  }

  static async deleteBlogPost(id: string) {
    return (await this.url(`/admin/blog/${id}`).delete())?.data;
  }

  static async getBlogPost(id: string | number) {
    return (await this.url(`/admin/blog/${id}`).get())?.data;
  }

  static async editBlogPost(id: string, data: FormData) {
    return (await this.url(`/admin/blog/${id}`).put(data))?.data;
  }

  static async postBLogPost(data: FormData) {
    return (await this.url('/admin/blog').post(data))?.data;
  }

  static async getBlogCategories() {
    return (await this.url('/admin/blog/categories').get())?.data;
  }

  static async deleteBlogCategory(id: string | number) {
    return (await this.url(`/admin/blog/category/${id}`).delete())?.data;
  }

  static async getBlogCategory(id: string | number) {
    return (await this.url(`/admin/blog/category/${id}`).get())?.data;
  }

  static async postBlogCategory(data: any) {
    return (await this.url('/admin/blog/category').post(data))?.data;
  }

  static async editBlogCategory(id: string | number, data: any) {
    return (await this.url(`/admin/blog/category/${id}`).put(data))?.data;
  }

  static async updateBlogCategoryStatus(id: string, status: boolean) {
    return (await this.url(`/admin/blog/category/${id}`).patch({ status }))?.data;
  }

  // FAQ

  static async getFAQList() {
    return (await this.url('/admin/faq').get())?.data;
  }

  static async getFAQCategories() {
    return (await this.url('/admin/faq/categories').get())?.data;
  }

  static async postFAQ(data: any) {
    return (await this.url('/admin/faq').post(data))?.data;
  }

  static async postFAQCategory(data: any) {
    return (await this.url('/admin/faq/category').post(data))?.data;
  }

  static async getFAQCategoryById(id: string | number) {
    return (await this.url(`/admin/faq/category/${id}`).get())?.data;
  }

  static async getFAQById(id: string | number) {
    return (await this.url(`/admin/faq/${id}`).get())?.data;
  }

  static async editFAQCategory(id: string | number, data: any) {
    return (await this.url(`/admin/faq/category/${id}`).put(data))?.data;
  }

  static async deleteFAQCategory(id: string | number) {
    return (await this.url(`/admin/faq/category/${id}`).delete())?.data;
  }

  static async editFAQ(id: string | number, data: any) {
    return (await this.url(`/admin/faq/${id}`).put(data))?.data;
  }

  static async deleteFAQ(id: string | number) {
    return (await this.url(`/admin/faq/${id}`).delete())?.data;
  }

  // UsersList

  static async getUsers() {
    return (await this.url('/admin/users').get())?.data;
  }

  static async getUserById(id: string | number) {
    return (await this.url(`/admin/users/${id}`).get())?.data;
  }

  static async updateUserRole(id: string | number, role: number | string) {
    return (await this.url(`/admin/users/${id}`).patch({ role }))?.data;
  }

  // Plans

  static async getPlans() {
    return (await this.url('/admin/pricing').get())?.data;
  }

  static async updatePricingStatus(id: string | number, active: boolean) {
    return (await this.url(`/admin/pricing/${id}`).patch({ active }))?.data;
  }

  static async postPlan(data: any) {
    return (await this.url('/admin/pricing').post(data))?.data;
  }

  static async getPlanById(id: string | number) {
    return (await this.url(`/admin/pricing/${id}`).get())?.data;
  }

  static async editPlan(id: string | number, data: any) {
    return (await this.url(`/admin/pricing/${id}`).put(data))?.data;
  }

  // filter attributes

  static async getProductCategories() {
    return (await this.url('/admin/product-attributes/categories').get())?.data;
  }

  static async getProductAttributesByCategory(category: string) {
    return (await this.url(`/admin/product-attributes/category/${category}`).get())?.data;
  }

  static async getFieldsByAttributes(category: string, attribute: string) {
    return (await this.url(`/admin/product-attributes/categories/${category}/${attribute}`).get())?.data;
  }

  static async postFilterAttributeField(productType: string, attribute: string, data: any) {
    return (await this.url(`/admin/product-attributes/category/${productType}/${attribute}`).post(data))?.data;
  }

  static async putFilterAttributeField(id: string | number, data: any) {
    return (await this.url(`/admin/product-attributes/${id}`).put(data))?.data;
  }

  static async deleteFilterField(id: string | number) {
    return (await this.url(`/admin/product-attributes/${id}`).delete())?.data;
  }

  static async getUserChats(id: string | number, type: number) {
    return (await this.url(`/admin/chats?type=${type}&id=${id}`).get())?.data;
  }

  static async getUserChatMessages(id: string | number, type: number | string, uuid: string) {
    return (await this.url(`/admin/chats/${uuid}?type=${type}&id=${id}`).get())?.data;
  }

  static async getOrders(page: string | number) {
    return (await this.url(`/admin/orders?page=${page}`).get())?.data;
  }

  static async getOrderById(id: string | number) {
    return (await this.url(`/admin/orders/${id}`).get())?.data;
  }
}
