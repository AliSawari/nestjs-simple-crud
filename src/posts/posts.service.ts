import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CacheService } from '../common/cache/cache.service';

const CACHE_KEYS = {
  allPosts: 'posts:all',
  post: (id: number) => `posts:${id}`,
};

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    private readonly cacheService: CacheService,
  ) {}

  async findAll(): Promise<Post[]> {
    const cached = await this.cacheService.get<Post[]>(CACHE_KEYS.allPosts);
    if (cached) return cached;

    const posts = await this.postRepo.find({ order: { createdAt: 'DESC' } });
    await this.cacheService.set(CACHE_KEYS.allPosts, posts);
    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const cached = await this.cacheService.get<Post>(CACHE_KEYS.post(id));
    if (cached) return cached;

    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post ${id} not found`);

    await this.cacheService.set(CACHE_KEYS.post(id), post);
    return post;
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postRepo.create(dto);
    const saved = await this.postRepo.save(post);

    await this.cacheService.del(CACHE_KEYS.allPosts);
    return saved;
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, dto);
    const updated = await this.postRepo.save(post);

    await Promise.all([
      this.cacheService.del(CACHE_KEYS.post(id)),
      this.cacheService.del(CACHE_KEYS.allPosts),
    ]);

    return updated;
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);

    await Promise.all([
      this.cacheService.del(CACHE_KEYS.post(id)),
      this.cacheService.del(CACHE_KEYS.allPosts),
    ]);
  }
}