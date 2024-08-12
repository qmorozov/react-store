import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../models/Session';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(@InjectRepository(Session, Database.Main) protected sessionRepository: Repository<Session>) {}

  async save(session: Session) {
    return this.sessionRepository.save(session);
  }

  async getByJwt(jwt: string) {
    return this.sessionRepository.findOne({
      where: {
        refreshToken: jwt,
      },
      relations: {
        user: true,
      },
    });
  }

  async deleteByJwt(refreshToken: string) {
    return this.sessionRepository.delete({
      refreshToken,
    });
  }
}
