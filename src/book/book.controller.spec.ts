import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Category, StatusType } from './schema/book.schema';
import { User } from '../auth/schemas/user.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookController', () => {
  let controller: BookController;
  let bookService: BookService;

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

  const mockBookService = {
    create: jest.fn().mockResolvedValueOnce(mockBook),
    findAll: jest.fn().mockResolvedValueOnce([mockBook]),
    findOne: jest.fn().mockResolvedValueOnce(mockBook),
    update: jest.fn(),
    remove: jest.fn().mockResolvedValueOnce(mockBook),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    bookService = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should get all books', async () => {
      const result = await controller.findAll({ page: '1', keyword: 'test' });

      expect(bookService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findOne', () => {
    it('should get one book by id', async () => {
      const result = await controller.findOne(mockBook._id);

      expect(bookService.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('create', () => {
    it('should create a book', async () => {
      const newBook = {
        title: 'Book 5',
        author: 'Author 3',
        price: 500,
        category: Category.ADVENTURE,
        editorial: 'Editorial 3',
        status: StatusType.IN_STOCKE,
      };

      const result = await controller.create(
        newBook as CreateBookDto,
        mockUser as User,
      );

      expect(bookService.create).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book by id', async () => {
      const bookToUpdate = {
        title: 'Book 5 edited',
      };
      const updatedBook = { ...mockBook, title: 'Book 5 edited' };

      mockBookService.update.mockResolvedValueOnce(updatedBook);

      const result = await controller.update(
        mockBook._id,
        bookToUpdate as UpdateBookDto,
      );

      expect(bookService.update).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should delete one book by id', async () => {
      const result = await controller.remove(mockBook._id);

      expect(bookService.remove).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });
});
