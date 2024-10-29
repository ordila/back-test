import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      throw new UnauthorizedException('Access token not provided');
    }

    // Перевірка access токена
    const payload = this.jwtService.verifyToken(accessToken);

    // Перевірка адміністративних прав
    if (payload.isAdmin) {
      request['user'] = payload; // Зберігаємо дані користувача в запиті
      return true;
    }

    throw new UnauthorizedException('Not an admin');
  }
}
