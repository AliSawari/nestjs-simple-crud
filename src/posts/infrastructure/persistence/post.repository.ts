import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { PostOrmEntity } from './post-orm.entity';
import { IPostRepository } from '../../domain/post.repository.interface';
import { Post } from '../../domain/post.entity';
import { CreatePostDto } from '../../application/dto/create-post.dto';
import { UpdatePostDto } from '../../application/dto/update-post.dto';
import { User } from 'src/users/domain/user.entity';
import { UserOrmEntity } from 'src/users/infrastructure/persistence/user-orm.entity';
import { PostResponse } from 'src/posts/application/dto/response-post.dto';

const SAFE_FIELDS: any = ['content', 'createdAt', 'title', 'updatedAt', 'id']

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectRepository(PostOrmEntity)
    private readonly repo: Repository<PostOrmEntity>,
  ) { }


  findAll(): Promise<Post[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: number): Promise<Post | null> {
    return this.repo.findOne({ where: { id }, relations: { author: true } });
  }

  findAllSafe(): Promise<Post[]> {
    return this.repo.find({ select: SAFE_FIELDS,  order: { createdAt: 'DESC' } })
  }

  findByTitleSafe(title:string): Promise<Post[]> {
    return this.repo.find({ where: { title: ILike(`%${title}%`) }, select: SAFE_FIELDS,  order: { createdAt: 'DESC' } })
  }

  findOneSafe(id: number): Promise<Post | null> {
    return this.repo.findOne({ where: { id }, select: SAFE_FIELDS })
  }

  create(dto: CreatePostDto): Promise<Post> {
    const post = this.repo.create(dto);
    return this.repo.save(post);
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findById(id);
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    Object.assign(post, dto);
    return this.repo.save(post as PostOrmEntity);
  }

  async delete(id: number): Promise<void> {
    const post = await this.findById(id);
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    await this.repo.remove(post as PostOrmEntity);
  }
}