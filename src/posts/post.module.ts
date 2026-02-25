import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostOrmEntity } from './infrastructure/persistence/post-orm.entity';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { POST_REPOSITORY } from './domain/post.repository.interface';
import { PostsService } from './application/post.service';
import { PostsController } from './presentation/post.controller';
import { AppCacheModule } from '../shared/infrastructure/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostOrmEntity]), AppCacheModule],
  controllers: [PostsController],
  providers: [
    PostRepository,
    PostsService,
  ],
})
export class PostsModule { }
