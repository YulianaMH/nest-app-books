import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Category, StatusType } from '../schema/book.schema';

export class UpdateBookDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;
  
    @IsNotEmpty()
    @IsString()
    readonly author: string;
  
    @IsNotEmpty()
    @IsString()
    readonly editorial: string;
  
    @IsNotEmpty()
    @IsInt()
    readonly price: number;
  
    @IsNotEmpty()
    @IsEnum(Category)
    readonly category: Category;
  
    @IsNotEmpty()
    @IsEnum(StatusType)
    readonly status: StatusType;
}
