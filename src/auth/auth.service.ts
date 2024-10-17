import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  private generateAccessToken(userId: number, isAdmin: boolean): string {
    return jwt.sign(
      { userId, isAdmin },
      this.configService.get<string>('JWT_SECRET'),
      { expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') },
    );
  }

  private generateRefreshToken(userId: number): string {
    return jwt.sign(
      { userId },
      this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      { expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') },
    );
  }

  private async generateTokens(userId: number, isAdmin: boolean) {
    const accessToken = this.generateAccessToken(userId, isAdmin);
    const refreshToken = this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  private async isPasswordValid(password: string, userPassword: string) {
    const isValid = await bcrypt.compare(password, userPassword);
    if (!isValid) {
      throw new BadRequestException('Invalid email or password');
    }
    return true;
  }

  async register(authUserDto: AuthUserDto) {
    const { password, email } = authUserDto;
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  async login(authUserDto: AuthUserDto, res: Response) {
    const { email, password } = authUserDto;
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    await this.isPasswordValid(password, user.password);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.isAdmin,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async adminLogin(authUserDto: AuthUserDto, res: Response) {
    const { email, password } = authUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.isAdmin) {
      throw new BadRequestException('Invalid email or password');
    }

    await this.isPasswordValid(password, user.password);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.isAdmin,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const oldRefreshToken = req.cookies['refreshToken'];

      if (!oldRefreshToken) {
        throw new BadRequestException('No refresh token provided');
      }

      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      ) as { userId: number };

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== oldRefreshToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user.id, user.isAdmin);
      const newRefreshToken = this.generateRefreshToken(user.id);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: newRefreshToken },
      });

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new BadRequestException('No refresh token found');
    }

    const user = await this.prisma.user.findFirst({ where: { refreshToken } });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
    }

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });

    return { message: 'Logged out successfully' };
  }
}
