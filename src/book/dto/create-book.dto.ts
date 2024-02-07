import { IsEmpty, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Category, StatusType } from '../schema/book.schema';
import { User } from '../../auth/schemas/user.schema';

export class CreateBookDto {
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
  @IsEnum(Category, { message: 'Please enter a valid category.' })
  readonly category: Category;

  @IsNotEmpty()
  @IsEnum(StatusType, { message: 'Please enter a valid status.' })
  readonly status: StatusType;

  @IsEmpty({ message: 'You cannot pass user id.' })
  readonly user: User;
}
