import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '../../shared/infrastructure/cache/cache.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../domain/post.entity';
import type { IPostRepository } from '../domain/post.repository.interface';
import { POST_REPOSITORY } from '../domain/post.repository.interface';
import { PostRepository } from '../infrastructure/persistence/post.repository';

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

  async findAll(): Promise<Post[]> {
    const cached = await this.cacheService.get<Post[]>(CACHE_KEYS.allPosts);
    if (cached) return cached;

    const posts = await this.postRepository.findAll();
    await this.cacheService.set(CACHE_KEYS.allPosts, posts);
    return posts;
  }

  async findById(id: number): Promise<Post> {
    const cached = await this.cacheService.get<Post>(CACHE_KEYS.post(id));
    if (cached) return cached;

    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(`Post ${id} not found`);

    await this.cacheService.set(CACHE_KEYS.post(id), post);
    return post;
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const post = await this.postRepository.create(dto);
    await this.cacheService.del(CACHE_KEYS.allPosts);
    return post;
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.update(id, dto);
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.post(id)),
      this.cacheService.del(CACHE_KEYS.allPosts),
    ]);
    return post;
  }

  async delete(id: number): Promise<void> {
    await this.postRepository.delete(id);
    await Promise.all([
      this.cacheService.del(CACHE_KEYS.post(id)),
      this.cacheService.del(CACHE_KEYS.allPosts),
    ]);
  }
}
