import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schema/book.schema';

@Controller('book')
@ApiTags('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(AuthGuard())
  async create(@Body() book: CreateBookDto, @Req() req): Promise<Book> {
    return this.bookService.create(book, req.user);
  }

  @Get()
  async findAll(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.update(id, book);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<unknown | Book> {
    return this.bookService.remove(id);
  }
}
