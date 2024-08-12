import { ApiService } from '../../app/services/api.service.client';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ForgotDto } from '../dto/forgot.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

export abstract class AuthApi extends ApiService {
  static async login(data: LoginDto) {
    return this.url('/auth/login').post(data);
  }

  static async registration(data: RegisterDto) {
    return this.url('/auth/register').post(data);
  }

  static async forgotPassword(data: ForgotDto) {
    return this.url('/auth/forgot-password').post(data);
  }

  static async resetPassword(data: ResetPasswordDto) {
    return this.url('/auth/reset-password').post(data);
  }
}
