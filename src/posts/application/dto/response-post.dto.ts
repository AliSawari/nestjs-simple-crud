import { PostOrmEntity } from "src/posts/infrastructure/persistence/post-orm.entity";

export type PostResponse = Omit<PostOrmEntity, 'author'>