import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BasketService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserBasket(userId: number) {
    return this.prisma.basket.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              where: { isDefault: true },
              select: { imageUrl: true },
            },
          },
        },
      },
    });
  }

  async addToBasket(userId: number, productId: number, quantity: number) {
    const existingItem = await this.prisma.basket.findFirst({
      where: { userId, productId },
    });

    if (existingItem) {
      return this.prisma.basket.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return this.prisma.basket.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }

  async removeFromBasket(id: number) {
    return this.prisma.basket.delete({
      where: { id },
    });
  }

  async clearBasket(userId: number) {
    return this.prisma.basket.deleteMany({
      where: { userId },
    });
  }
}
