import { RegisterDto } from 'src/auth/application/dto/register.dto';
import { User } from './user.entity';

export const POST_REPOSITORY = 'POST_REPOSITORY';

export interface IUserRepository {
  find?(): Promise<User[]>;
  findAll?(): Promise<User[]>;
  findOne?(id: number): Promise<User | null>;
  findById?(id: number): Promise<User | null>;
  create(email:string, pahashedPassword: string): Promise<User>;
  save(user:User): Promise<User>;
  // for now we dont update or delete users
  // update(id: number, dto: UpdatePostDto): Promise<Post>;
  // delete(id: number): Promise<void>;
}