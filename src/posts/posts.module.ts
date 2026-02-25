import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostOrmEntity } from './infrastructure/persistence/post-orm.entity';
import { PostRepository } from './infrastructure/persistence/post.repository';
import { POST_REPOSITORY } from './domain/post.repository.interface';
import { PostsService } from './application/posts.service';
import { PostsController } from './presentation/posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostOrmEntity])],
  controllers: [PostsController],
  providers: [
    { provide: POST_REPOSITORY, useClass: PostRepository },
    PostsService,
  ],
})
export class PostsModule {}