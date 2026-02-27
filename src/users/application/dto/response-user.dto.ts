import { User } from "src/users/domain/user.entity";

export type ResponseUser = Omit<User, 'password'>