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
    const authHeader = request.headers.authorization;

    const token = this.jwtService.extractTokenFromHeader(authHeader);
    const payload = this.jwtService.verifyToken(token);

    if (payload.isAdmin) {
      request['user'] = payload;
      return true;
    }

    throw new UnauthorizedException('Not an admin');
  }
}
