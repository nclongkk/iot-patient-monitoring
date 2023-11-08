import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppRepository } from '../../database/database.repository';
import { User } from '../../database/entities/user.entity';
import { comparePassword } from '../../shared/helper/helper';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private appRepository: AppRepository,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.appRepository
      .use(User)
      .findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    // const isPasswordMatch = await comparePassword(password, user.password);
    if (user.password !== password) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    return { accessToken: await this.generateToken(user) };
  }

  generateToken(user: User) {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }
}
