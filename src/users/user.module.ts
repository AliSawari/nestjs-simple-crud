import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user-orm.entity';
import { UsersService } from './application/user.service';
import { UserRepository } from './infrastructure/persistence/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
