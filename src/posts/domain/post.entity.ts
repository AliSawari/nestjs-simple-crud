import { ResponseUser } from "src/users/application/dto/response-user.dto";
import { User } from "src/users/domain/user.entity";


export class Post {
  id: number;
  title: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}