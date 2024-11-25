import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '../services/jwt.service';
import { ErrorMessages } from '../enums/error-messages.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const accessToken = request.cookies['accessToken'];
    const refreshToken = request.cookies['refreshToken'];

    if (!accessToken) {
      throw new UnauthorizedException(ErrorMessages.ACCESS_TOKEN_NOT_PROVIDED);
    }

    try {
      // Перевіряємо валідність access токену
      const payload = this.jwtService.verifyToken(accessToken);
      request['user'] = payload; // Зберігаємо дані користувача в запиті
      return true;
    } catch (err) {
      // Якщо access токен недійсний, пробуємо оновити його через refresh токен
      if (refreshToken) {
        try {
          // Оновлюємо access токен
          const newAccessToken =
            await this.jwtService.refreshAccessToken(refreshToken);

          // Встановлюємо новий access токен в кукі
          response.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: Number(
              this.configService.get<string>('ACCESS_TOKEN_COOKIE_MAX_AGE'),
            ),
          });

          // Перевіряємо новий access токен і додаємо дані користувача в запит
          const payload = this.jwtService.verifyToken(newAccessToken);
          request['user'] = payload;
          return true;
        } catch (refreshError) {
          throw new UnauthorizedException(
            ErrorMessages.ACCESS_TOKEN_EXPIRED_OR_INVALID,
          );
        }
      }

      throw new UnauthorizedException(
        ErrorMessages.ACCESS_TOKEN_EXPIRED_OR_INVALID,
      );
    }
  }
}
