import { Post } from './post.entity';
import { CreatePostDto } from '../application/dto/create-post.dto';
import { UpdatePostDto } from '../application/dto/update-post.dto';
import { UserOrmEntity } from 'src/users/infrastructure/persistence/user-orm.entity';
import { User } from 'src/users/domain/user.entity';

export const POST_REPOSITORY = 'POST_REPOSITORY';

export interface IPostRepository {
  find?(): Promise<Post[]>;
  findAll(): Promise<Post[]>;
  findOne?(id: number): Promise<Post | null>;
  findById(id: number): Promise<Post | null>;
  create(dto: CreatePostDto, user: User): Promise<Post>;
  update(id: number, dto: UpdatePostDto): Promise<Post>;
  delete(id: number): Promise<void>;
}
