import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '../services/jwt.service';
import { ErrorMessages } from '../enums/error-messages.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const token = this.jwtService.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new UnauthorizedException(ErrorMessages.ACCESS_TOKEN_NOT_PROVIDED);
    }

    try {
      const payload = this.jwtService.verifyToken(token);
      request['user'] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException(
        ErrorMessages.ACCESS_TOKEN_EXPIRED_OR_INVALID,
      );
    }
  }
}
