import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    try {
      const { name, email, password } = signUpDto;
      const hashedPassword = await hash(password, 10);
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });
      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Duplicate Email entered');
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Ivalid email or password');
    }
    const isPasswordMatched = await compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }
}
