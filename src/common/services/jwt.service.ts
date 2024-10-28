import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  verifyToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
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
}
