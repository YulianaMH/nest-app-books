import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schema/book.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return await this.bookModel.create(createBookDto);
  }

  async findAll(query: Query): Promise<Book[]> {
    const itemsPerPage = 3;
    const currentPage = Number(query.page) || 1;
    const skip = itemsPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const books = await this.bookModel
      .find({ ...keyword })
      .limit(itemsPerPage)
      .skip(skip);
    return books;
  }

  async findOne(id: string): Promise<Book> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Please enter correct id.');
    }
    const book = await this.bookModel.findById(id);
    if (!book) {
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
