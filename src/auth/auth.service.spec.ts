import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;

  const token = 'jwtToken';
  const mockUser: any = {
    _id: '65c3b4c5233f93d8fd03d33a',
    name: 'yuliana',
    email: 'yuliana@gmail.com',
  };

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const mockSignUpUserDto = {
      name: 'yuliana',
      email: 'yuliana@gmail.com',
      password: '1234',
    };

    it('should register a mew user', async () => {
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockUser));
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.signUp(mockSignUpUserDto);

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });

    it('should throw Duplicate Email entered', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.reject({ code: 11000 })); // duplicate key source code 11000 in Mongo

      await expect(service.signUp(mockSignUpUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const mockLoginUserDto = {
      email: 'yuliana@gmail.com',
      password: '1234',
    };

    it('should login an user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(mockLoginUserDto);
      expect(result).toEqual({ token });
    });

    it('should throw UnauthorizedException when invalid user', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

      await expect(service.login(mockLoginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when invalid password', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(service.login(mockLoginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
