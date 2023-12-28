import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../api/services/prisma/prisma.service';
import { encrypt, isPasswordValid } from '../utils/hash';
import { Register } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('No user found for email: ', email);
    }

    const doesMatch = await isPasswordValid(password, user.password);

    if (!doesMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  async register(registerParams: Register) {
    try {
      const encryptedPassword = await encrypt(registerParams.password);
      registerParams.password = encryptedPassword;
      const user = await this.prisma.user.create({
        data: registerParams,
      });

      return {
        user,
      };
    } catch (err: unknown) {
      Logger.error('Err while registering user: ', err);
    }
  }
}
