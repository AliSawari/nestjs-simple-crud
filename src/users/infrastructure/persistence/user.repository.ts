import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user-orm.entity';
import { User } from '../../domain/user.entity';
import type { IUserRepository } from 'src/users/domain/user.repository.interface';

export const USER_REPOSITORY = 'USER_REPOSITORY';


@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  create(email: string, hashedPassword: string): Promise<User> {
    const user = this.repo.create({ email, password: hashedPassword });
    return this.repo.save(user);
  }

  findOneById(id: number): Promise<User | null> {
    return this.repo.findOne({where: { id }});
  }

  save(user:User): Promise<User | null>{
    return this.repo.save(user);
  }
}