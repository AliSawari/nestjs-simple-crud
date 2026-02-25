import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { UserRepository } from '../infrastructure/persistence/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const user = await this.userRepo.create(email, hashedPassword);
    return this.userRepo.save(user);
  }
}
