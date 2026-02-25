import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/user-orm.entity';
import { UsersService } from './application/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}