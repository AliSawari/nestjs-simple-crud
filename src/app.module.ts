import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/post.module';
import TypeOrmModuleConfig from './config/typeorm.config'
import { AuthModule } from './auth/auth.module';
import { AppCacheModule } from './shared/infrastructure/cache/cache.module';

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