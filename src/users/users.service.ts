import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../common/config/config.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ where: { email: loginDto.email } });

    if (!user) {
      throw new UnauthorizedException(`email yoki parol noto'g'ri`);
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(`email yoki parol noto'g'ri`);
    
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshTokenDto: { refreshToken: string }) {
    const { refreshToken } = refreshTokenDto;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token yuborilmadi');
    }

    let payload: any;
    try {
      payload = jwt.verify(
        refreshToken,
        this.configService.get('JWT_REFRESH_SECRET'),
      );
    } catch (e) {
      throw new UnauthorizedException(`Refresh token muddati o'tgan yoki yaroqsiz`);
    }

    const user = await this.userModel.findByPk(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi yoki faol emas');
    }

    const newAccessToken = jwt.sign(
      { sub: user.id, email: user.email },
      this.configService.get('JWT_ACCESS_SECRET'),
      {
        expiresIn:
          this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
      },
    );

    return {
      accessToken: newAccessToken,
    };
  }

  private generateAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return jwt.sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') || '15m',
    });
  }

  private generateRefreshToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return jwt.sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });
  }

  async validateToken(token: string, type: 'access' | 'refresh' = 'access') {
    try {
      return jwt.verify(token, type === 'access'
        ? this.configService.get('JWT_ACCESS_SECRET')
        : this.configService.get('JWT_REFRESH_SECRET'));
    } catch (e) {
      throw new UnauthorizedException(`Token yaroqsiz yoki muddati o'tgan`);
    }
  }

  async createAdmin() {
    const email = 'admin@gmail.com';
    const existing = await this.userModel.findOne({ where: { email } });

    if (existing) return existing;

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await this.userModel.create({
      email,
      password: hashedPassword,
    });

    const { password, ...result } = admin.toJSON();
    return {
      message: 'DEFAULT Admin yaratildi',
      admin: result,
      password: 'admin123',
    };
  }

  async findAll() {
    return this.userModel.findAll({
      attributes: { exclude: ['password', 'login_token'] },
    });
  }

}