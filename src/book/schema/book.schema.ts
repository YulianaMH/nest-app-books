import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Category {
  ADVENTURE = 'Adventure',
  CRIME = 'Crime',
  FANTASY = 'Fantasy',
}

export enum StatusType {
  IN_STOCKE = 'In Stock',
  OUT_OF_STOCK = 'Out of Stock',
}

@Schema({
  timestamps: true,
})
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  editorial: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: Category;

  @Prop({ required: true })
  status: StatusType;
}

export const BookSchema = SchemaFactory.createForClass(Book);
