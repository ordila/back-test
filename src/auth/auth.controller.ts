import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { Request, Response } from 'express';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  async registerUser(@Body() authUserDto: AuthUserDto) {
    return this.authService.register(authUserDto);
  }

  @HttpCode(200)
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() authUserDto: AuthUserDto, @Res() res: Response) {
    const result = await this.authService.login(authUserDto, res);
    res.json(result);
  }

  @HttpCode(200)
  @Post('admin-login')
  @UsePipes(new ValidationPipe())
  async adminLogin(@Body() authUserDto: AuthUserDto, @Res() res: Response) {
    const result = await this.authService.adminLogin(authUserDto, res);
    res.json(result);
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      await this.authService.logout(req, res);
      res.json({ message: 'Successfully logged out' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to log out' });
      console.log('error', error);
    }
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.refreshToken(req, res);

    return res.json(token);
  }
}
