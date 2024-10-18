import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

@Injectable()
export class WishListService {
  constructor(private prisma: PrismaService) {}

  async getWishListForUser(userId: number) {
    return this.prisma.wishList.findMany({
      where: { userId },
      select: { productId: true },
    });
  }

  async addToWishList(userId: number, productId: number) {
    console.log('userId', userId);
    const existingItem = await this.prisma.wishList.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      throw new Error('This product is already in the wish list');
    }

    return this.prisma.wishList.create({
      data: {
        userId: userId,
        productId: productId,
      },
    });
  }

  async removeFromWishList(userId: number, productId: number) {
    const existingItem = await this.prisma.wishList.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!existingItem) {
      throw new BadRequestException(ErrorMessages.PRODUCT_NOT_IN_WISHLIST);
    }

    return this.prisma.wishList.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  async clearWishlist(userId: number) {
    return this.prisma.wishList.deleteMany({
      where: { userId },
    });
  }
}
