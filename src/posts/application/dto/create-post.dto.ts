import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Post', description: 'Title of the post' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'This is the post content...', description: 'Body of the post' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  content: string;

  // @ApiPropertyOptional({ example: 'John', description: 'Author name' })
  // @IsString()
  // @IsOptional()
  // @MaxLength(100)
  // author?: string;
}