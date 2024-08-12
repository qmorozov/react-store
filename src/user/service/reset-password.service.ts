import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPassword } from '../models/ResetPassword';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';
import { User } from '../models/User';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPassword, Database.Main) private readonly passwordRepository: Repository<ResetPassword>,
  ) {}

  async resetForUser(user: User) {
    const resetPassword =
      (await this.passwordRepository.findOneBy({
        user: {
          id: user.id,
        },
      })) || ResetPassword.for(user);

    resetPassword.generateNewToken();

    return this.passwordRepository.save(resetPassword);
  }

  async findByToken(token: string) {
    return this.passwordRepository.findOne({
      where: {
        token,
      },
      relations: {
        user: true,
      },
    });
  }

  async delete(resetPassword: ResetPassword) {
    return this.passwordRepository.remove(resetPassword);
  }
}
