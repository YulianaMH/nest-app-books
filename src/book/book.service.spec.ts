import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { BookService } from './book.service';
import { Book, Category, StatusType } from './schema/book.schema';
import { User } from '../auth/schemas/user.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookService', () => {
  let service: BookService;
  let model: Model<Book>;
  const mockBookService = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockBook: any = {
    _id: '65c3d46b285bcd779a9b0788',
    user: '65c3b4c5233f93d8fd03d33a',
    title: 'Book 5',
    author: 'Author 3',
    price: 500,
    category: Category.ADVENTURE,
    editorial: 'Editorial 3',
    status: StatusType.IN_STOCKE,
    createdAt: '2024-02-07T19:05:15.746Z',
    updatedAt: '2024-02-07T19:05:15.746Z',
  };

  const mockUser = {
    _id: '65c3b4c5233f93d8fd03d33a',
    name: 'yuliana',
    email: 'yuliana@gmail.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('shoul return an array of books', async () => {
      const query = { page: '1', keyword: 'test' };
      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockBook]),
            }),
          }) as any,
      );
      const result = await service.findAll(query);

      expect(model.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
      });
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should find and return a book by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);
      const result = await service.findOne(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';
      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);
      expect(isValidObjectIDMock).toHaveBeenLastCalledWith(id);
      isValidObjectIDMock.mockRestore(); // here I just restore the isValidObjectId value
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findOne(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const newBook = {
        title: 'Book 5',
        author: 'Author 3',
        price: 500,
        category: Category.ADVENTURE,
        editorial: 'Editorial 3',
        status: StatusType.IN_STOCKE,
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockBook);

      const result = await service.create(
        newBook as CreateBookDto,
        mockUser as User,
      );

      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update and return a book', async () => {
      const bookToUpdate = {
        title: 'Book 5 edited',
      };
      const updatedBook = { ...mockBook, title: 'Book 5 edited' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);
      const result = await service.update(
        mockBook._id,
        bookToUpdate as UpdateBookDto,
      );

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockBook._id,
        bookToUpdate,
        {
          new: true,
          runValidators: true,
        },
      );
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should delete and return a book', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);
      const result = await service.remove(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);
      expect(result).toEqual(mockBook);
    });
  });
});
