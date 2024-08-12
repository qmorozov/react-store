import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { In, IsNull, Repository } from 'typeorm';
import { User } from '../models/User';
import { ResetPassword } from '../models/ResetPassword';
import { ActionTargetKey } from '../decorator/action.target.decorator';
import { RedisNamespace, RedisService } from '../../app/database/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, Database.Main) private readonly usersRepository: Repository<User>,
    @InjectRepository(ResetPassword, Database.Main) private readonly passwordRepository: Repository<ResetPassword>,
    private readonly redisService: RedisService,
  ) {}

  async findByEmail(email: string, select?) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
      select,
    });
  }

  async findOneByUuid(uuid: string) {
    return this.usersRepository.findOne({
      where: {
        uuid,
      },
    });
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }

  async getActiveUsersByIds(ids: number[]) {
    if (!ids.length) {
      return [];
    }
    return this.usersRepository.find({
      where: {
        id: In(ids),
        verificationCode: IsNull(),
      },
    });
  }

  async getUser(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getAdditionalData(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'email', 'phone'],
    });
  }

  async setIsOnline(...actionTargetKeys: ActionTargetKey[]) {
    const db = this.redisService.namespace(RedisNamespace.UserOnline);
    return Promise.all(
      (actionTargetKeys || []).map((t) => {
        return db.set(t.toString(), 1, {
          EX: 4 * 60,
        });
      }),
    );
  }

  async isOnline(target: ActionTargetKey) {
    const db = this.redisService.namespace(RedisNamespace.UserOnline);
    return !!(await db.get(target.toString()));
  }

  async getList() {
    return this.usersRepository.find();
  }

  async findByVerificationCode(token: string) {
    return this.usersRepository.findOneBy({
      status: 0,
      verificationCode: token,
    });
  }
}
