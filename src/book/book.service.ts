import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schema/book.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return await this.bookModel.create(createBookDto);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookModel.find();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if(!book) {
      throw new NotFoundException('Book not found.');
    }
    return book;
  }

  async update(id: string, book: UpdateBookDto): Promise<Book> {
    return await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string): Promise<unknown | Book> {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
