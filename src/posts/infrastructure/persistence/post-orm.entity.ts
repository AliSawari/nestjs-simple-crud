import { UserOrmEntity } from 'src/users/infrastructure/persistence/user-orm.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('posts')
export class PostOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  content: string;

  
  @ManyToOne(() => UserOrmEntity, (user) => user.posts, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  author: UserOrmEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}