import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Category, StatusType } from '../schema/book.schema';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsString()
  readonly editorial: string;

  @IsOptional()
  @IsInt()
  readonly price: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter a valid category.' })
  readonly category: Category;

  @IsOptional()
  @IsEnum(StatusType, { message: 'Please enter a valid status.' })
  readonly status: StatusType;
}
