import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../shared/infrastructure/cache/cache.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../domain/post.entity';
import type { IPostRepository } from '../domain/post.repository.interface';
import { POST_REPOSITORY } from '../domain/post.repository.interface';
import { PostRepository } from '../infrastructure/persistence/post.repository';
import { User } from 'src/users/domain/user.entity';
import { UserOrmEntity } from 'src/users/infrastructure/persistence/user-orm.entity';
import { PostResponse } from './dto/response-post.dto';

const CACHE_KEYS = {
  allPosts: 'posts:all',
  post: (id: number) => `posts:${id}`,
};

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly cacheService: CacheService,
  ) { }

  checkAccess(post: Post, user: User): Boolean {
    return post.author.id === user.id;
  }

  async findAll(): Promise<Post[]> {
    const cached = await this.cacheService.get<Post[]>(CACHE_KEYS.allPosts);
    if (cached) return cached;

    const posts = await this.postRepository.findAllSafe();
    await this.cacheService.set(CACHE_KEYS.allPosts, posts);
    return posts;
  }

  async findById(id: number): Promise<PostResponse> {
    const cached = await this.cacheService.get<Post>(CACHE_KEYS.post(id));
    if (cached) return cached;

    const post = await this.postRepository.findOneSafe(id);
    if (!post) throw new NotFoundException(`Post ${id} not found`);

    await this.cacheService.set(CACHE_KEYS.post(id), post);
    return post;
  }

  async create(dto: CreatePostDto, user: User): Promise<PostResponse> {
    const post = await this.postRepository.create(dto);
    post.author = user;
    await this.postRepository.update(post.id, post);
    await this.cacheService.del(CACHE_KEYS.allPosts);
    delete (post as any).author
    return post;
  }

  async update(id: number, dto: UpdatePostDto, user: User): Promise<Post | NotFoundException | ForbiddenException> {
    const post = await this.postRepository.findById(id);
    if (post) {
      const hasAccess = this.checkAccess(post, user)
      if (hasAccess) {
        const post = await this.postRepository.update(id, dto);
        await Promise.all([
          this.cacheService.del(CACHE_KEYS.post(id)),
          this.cacheService.del(CACHE_KEYS.allPosts),
        ]);
        delete (post as any).author;
        return post;
      }
      return new ForbiddenException()
    }
    return new NotFoundException();
  }

  async delete(id: number, user: User): Promise<string | NotFoundException | ForbiddenException> {
    const post = await this.postRepository.findById(id);
    if (post) {
      const hasAccess = this.checkAccess(post, user)
      if (hasAccess) {
        await this.postRepository.delete(id);
        await Promise.all([
          this.cacheService.del(CACHE_KEYS.post(id)),
          this.cacheService.del(CACHE_KEYS.allPosts),
        ]);
        return "Post Deleted!"
      }
      return new ForbiddenException()
    }
    return new NotFoundException(post, { description: 'Post not found' });

  }
}
