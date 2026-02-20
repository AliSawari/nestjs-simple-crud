import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import TypeOrmModuleConfig from './config/typeorm.config'
import { AuthModule } from './auth/auth.module';
import { AppCacheModule } from './common/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModuleConfig,
    AppCacheModule,
    AuthModule,
    PostsModule,
  ],
})
export class AppModule { }