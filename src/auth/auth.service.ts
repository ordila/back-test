import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';
import { JwtService } from 'src/common/services/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
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
      throw new BadRequestException(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }
    return true;
  }

  async getProfile(req: Request) {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      throw new BadRequestException(ErrorMessages.ACCESS_TOKEN_NOT_PROVIDED);
    }

    try {
      const decoded = this.jwtService.verifyToken(accessToken) as {
        userId: number;
      };

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          middleName: true,
          lastName: true,
          sex: true,
          dateOfBirth: true,
          createdAt: true,
          updatedAt: true,
          contacts: true,
          ordersRecipients: true,
          deliveryAddresses: true,
        },
      });

      if (!user) {
        throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new BadRequestException(
        ErrorMessages.ACCESS_TOKEN_EXPIRED_OR_INVALID,
      );
    }
  }

  async register(authUserDto: AuthUserDto, res: Response) {
    const { password, email } = authUserDto;

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_TAKEN);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.isAdmin,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('ACCESS_TOKEN_COOKIE_MAX_AGE'),
      ),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE'),
      ),
    });

    return { message: 'Registration successful', user };
  }

  async login(authUserDto: AuthUserDto, res: Response) {
    const { email, password } = authUserDto;
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('ACCESS_TOKEN_COOKIE_MAX_AGE'),
      ),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE'),
      ),
    });
  }

  async adminLogin(authUserDto: AuthUserDto, res: Response) {
    const { email, password } = authUserDto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.isAdmin) {
      throw new BadRequestException(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('ACCESS_TOKEN_COOKIE_MAX_AGE'),
      ),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE'),
      ),
    });
  }

  async refreshToken(req: Request, res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'];

    if (!oldRefreshToken) {
      throw new BadRequestException(ErrorMessages.NO_REFRESH_TOKEN_PROVIDED);
    }

    const decoded = jwt.verify(
      oldRefreshToken,
      this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    ) as { userId: number };

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new BadRequestException(ErrorMessages.INVALID_REFRESH_TOKEN);
    }

    const newAccessToken = this.generateAccessToken(user.id, user.isAdmin);
    const newRefreshToken = this.generateRefreshToken(user.id);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('ACCESS_TOKEN_COOKIE_MAX_AGE'),
      ),
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: Number(
        this.configService.get<string>('REFRESH_TOKEN_COOKIE_MAX_AGE'),
      ),
    });
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new BadRequestException(ErrorMessages.NO_REFRESH_TOKEN_FOUND);
    }

    const user = await this.prisma.user.findFirst({ where: { refreshToken } });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  async checkAuthStatus(req: Request): Promise<boolean> {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
      return false;
    }

    try {
      this.jwtService.verifyToken(accessToken);
      console.log('jwtService', this.jwtService.verifyToken(accessToken));
      return true;
    } catch (error) {
      return false;
    }
  }
}
