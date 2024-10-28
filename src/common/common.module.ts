import { Module } from '@nestjs/common';
import { AdminGuard } from './guards/admin.guard';
import { JwtService } from './services/jwt.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  providers: [AdminGuard, JwtService, AuthGuard],
  exports: [AdminGuard, JwtService, AuthGuard],
})
export class CommonModule {}
