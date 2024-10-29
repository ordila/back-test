import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  private readonly jwtSecret = process.env.JWT_SECRET;
  private readonly refreshSecret = process.env.REFRESH_TOKEN_SECRET;

  verifyToken(token: string) {
    try {
      const payload = jwt.verify(token, this.jwtSecret);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  extractTokenFromHeader(authHeader: string): string {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    throw new UnauthorizedException('No token provided');
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Перевірка валідності refresh токена
      const payload = jwt.verify(refreshToken, this.refreshSecret) as {
        userId: number;
      };

      // Генерація нового access токена
      const newAccessToken = jwt.sign(
        { userId: payload.userId },
        this.jwtSecret,
        {
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      return newAccessToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
