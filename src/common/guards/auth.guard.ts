import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    const token = this.jwtService.extractTokenFromHeader(authHeader);
    const payload = this.jwtService.verifyToken(token);

    request['user'] = payload;

    return true;
  }
}
