import { NestMiddleware, Injectable, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/** The AuthMiddleware is used to
 * (1) read the request header bearer token/user access token
 * (2) decrypt the access token to get the user object
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    let user;

    if (!bearerHeader || !accessToken) {
      return next();
    }

    try {
      const { userId } = this.jwtService.decode(
        accessToken,
        this.config.get('JWT_SECRET')!,
      );

      user = await this.userService.getUserById(userId);
    } catch (error) {
      throw new ForbiddenException('Please register or sign in.');
    }

    if (user) {
      req.user = user;
    }

    next();
  }
}
