import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { Request, Response } from 'express';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    try {
      return await this.authService.getProfile(req);
    } catch (error) {
      throw new BadRequestException(ErrorMessages.ACCESS_TOKEN_NOT_PROVIDED);
    }
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async registerUser(@Body() authUserDto: AuthUserDto, @Res() res: Response) {
    res.json(await this.authService.register(authUserDto, res));
  }

  @HttpCode(200)
  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() authUserDto: AuthUserDto, @Res() res: Response) {
    await this.authService.login(authUserDto, res);
    res.json({ message: 'Login successful' });
  }

  @HttpCode(200)
  @Post('admin-login')
  @UsePipes(new ValidationPipe())
  async adminLogin(@Body() authUserDto: AuthUserDto, @Res() res: Response) {
    await this.authService.adminLogin(authUserDto, res);
    res.json({ message: 'Admin login successful' });
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      await this.authService.logout(req, res);
      res.json({ message: 'Successfully logged out' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to log out' });
    }
  }

  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    await this.authService.refreshToken(req, res);
    res.json({ message: 'Token refreshed successfully' });
  }

  @Get('status')
  async getStatus(@Req() req: Request) {
    try {
      const isLoggedIn = await this.authService.checkAuthStatus(req);
      console.log('isLoggeIn', isLoggedIn);
      return { isLoggedIn };
    } catch (error) {
      return { isLoggedIn: false };
    }
  }
}
