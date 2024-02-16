import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const token = 'jwtToken';

  const mockAuthService = {
    signUp: jest.fn().mockResolvedValueOnce({ token }),
    login: jest.fn().mockResolvedValueOnce({ token }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user', async () => {
      const mockSignUpUserDto = {
        name: 'yuliana',
        email: 'yuliana@gmail.com',
        password: '1234',
      };
      const result = await controller.signUp(mockSignUpUserDto);

      expect(service.signUp).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });

  describe('login', () => {
    it('should login an user', async () => {
      const mockLoginUserDto = {
        email: 'yuliana@gmail.com',
        password: '1234',
      };
      const result = await controller.login(mockLoginUserDto);

      expect(service.login).toHaveBeenCalled();
      expect(result).toEqual({ token });
    });
  });
});
